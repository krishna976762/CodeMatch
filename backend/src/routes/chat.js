const express = require("express");
const { Chat } = require("../models/Chat");
const User = require("../models/Users")
const { userAuth } = require("../middlewares/auth");

const ChatRouter = express.Router();

// Create or get existing chat
ChatRouter.get("/chat/:targetUserId", userAuth, async (req, res) => {
  const { targetUserId } = req.params;
  const userId = req.user._id;

  if (!userId || !targetUserId) {
    return res.status(400).json({ message: "Missing userId or targetUserId" });
  }

  try {
    let chat = await Chat.findOne({
      participents: { $all: [userId, targetUserId] },
    }).populate("messages.senderId", "firstName lastName");

    if (!chat) {
      chat = new Chat({
        participents: [userId, targetUserId],
        messages: [],
      });
      await chat.save();
    }

    // Get target user info
    const targetUser = await User.findById(targetUserId).select(
      "firstName lastName lastSeen"
    );

    const response = {
      chat,
      targetUser: {
        _id: targetUser._id,
        firstName: targetUser.firstName,
        lastName: targetUser.lastName,
        lastSeen: targetUser.lastSeen,
      },
    };

    res.status(200).json(response); 
  } catch (error) {
    console.error("Error creating/getting chat:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = ChatRouter;
