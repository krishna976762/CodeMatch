const jwt = require("jsonwebtoken");
const Users = require("../models/Users");
const { findById } = require("../models/Users");

const userAuth = async (req, res, next) => {
  try {
    const cookies = req.cookies;
    const { token } = cookies;
    const decodeObj = await jwt.verify(token, process.env.JWT_SECRET);
    const { _id } = decodeObj;
    const user = await Users.findById(_id);
    if (!user) {
      throw new Error("User not found");
    } else {
        req.user=user
      next();
    }
  } catch (error) {
    res.status(400).send("Uer not found")
  }
};

module.exports = { userAuth };
