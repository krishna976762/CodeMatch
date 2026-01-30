const express = require("express");
const mongoose = require("mongoose");
const Users = require("../models/Users");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status.toLowerCase();

      // ✅ Validate IDs
      if (!fromUserId || !toUserId) {
        return res.status(400).send("Invalid user IDs");
      }

      // ✅ Allowed statuses
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).send("Invalid status type: " + status);
      }

      // ✅ Check if recipient exists
      const toUser = await Users.findById(toUserId);
      if (!toUser) {
        return res.status(404).send("User not found");
      }

      // ✅ Check for existing requests (either direction)
      const existingConnectionRequest = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: new mongoose.Types.ObjectId(fromUserId), toUserId: new mongoose.Types.ObjectId(toUserId) },
          { fromUserId: new mongoose.Types.ObjectId(toUserId), toUserId: new mongoose.Types.ObjectId(fromUserId) },
        ],
      });

      if (existingConnectionRequest) {
        return res.status(400).send("Connection request already exists");
      }

      // ✅ Create new request
      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save();

      res.status(201).json({
        message: "Connection request sent successfully",
        data,
      });

    } catch (error) {
      res.status(400).send("ERROR: " + error.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    const logedinUser= req.user
    const {status} = req.params;
    const {requestId} = req.params;
    const allowedStatus=["accepted","rejected"]
    if(!allowedStatus.includes(status)){
        return res.status(400).json({message:"status not allowed"})
    }

    const connectionRequest = await ConnectionRequest.findOne({
        _id:requestId,
        toUserId:logedinUser._id,
        status:"interested"
    })  

    if(!connectionRequest){
        return res.status(404).json({message:"Request not found"})
    }
    connectionRequest.status = status
    const data = await connectionRequest.save()
    res.json({message:"Connection request " + status})
})

module.exports = requestRouter;
