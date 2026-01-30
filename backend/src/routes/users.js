const express = require("express")
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/ConnectionRequest");
const Users = require("../models/Users");

const userRouter= express()
const USER_SAFE_DATA= "firstName lastName skills age gender about photoUrl"

userRouter.get("/user/request/received",userAuth,async(req,res)=>{
    try {
        const loggedInUser= req.user;
        const connectionRequest = await ConnectionRequest.find({
            toUserId:loggedInUser,
            status:"interested"
        }).populate("fromUserId",["firstName","lastName"])

        if(!connectionRequest){
            return res.json({
            message:"No connection request",        })
        }

        res.json({
            message:"Data fetched successfuly",
            data:connectionRequest
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

userRouter.get("/user/connections",userAuth,async(req,res)=>{
    try {
        const loggedInUser=req.user
        const connectionRequest = await ConnectionRequest.find({
            $or:[
                    {toUserId: loggedInUser._id,status:"accepted"},
                    {fromUserId: loggedInUser._id,status:"accepted"}
            ]
        }).populate("fromUserId",USER_SAFE_DATA).populate("toUserId",USER_SAFE_DATA)
        const data = connectionRequest.map((row) =>{
            if(row.fromUserId._id.toString() == loggedInUser._id.toString()){
                return row.toUserId
            }
            return row.fromUserId
        })
        res.json({
            message:"Data fetched",
            data:data
        })
    } catch (error) {
        res.status(400).json({ error: error.message });
    }

})

userRouter.get("/feed",userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user 
    const page= parseInt(req.query.page) || 1
    let limit = parseInt(req.query.limit) || 10
    limit = limit >50 ? 50 : limit
    const skip= (page-1) * limit

    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { fromUserId: loggedInUser._id },
        { toUserId: loggedInUser._id }
      ]
    }).select("fromUserId toUserId");

    const hideUserFromFeed = new Set();

    connectionRequests.forEach((request) => {
      hideUserFromFeed.add(request.fromUserId.toString());
      hideUserFromFeed.add(request.toUserId.toString());
    });

    const users= await Users.find({
        $and:[
            {_id:{$nin: Array.from(hideUserFromFeed)}},
            {_id:{$ne: loggedInUser._id}}
        ]
    }).select(USER_SAFE_DATA).skip(skip).limit(limit)

    res.json({ message: "Feed fetched successfully", data: users });


  } catch (error) {
    res.status(400).send("ERROR: " + error.message);
  }
});


module.exports=userRouter