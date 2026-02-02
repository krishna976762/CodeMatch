const mongoose = require("mongoose");

// Message schema
const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    text: {
      type: String,
      required: true,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true },
);

// Chat schema
const ChatSchema = new mongoose.Schema({
  participents: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
  messages: [messageSchema],
});

const Message = mongoose.model("Message", messageSchema);
const Chat = mongoose.model("Chat", ChatSchema);

module.exports = { Chat, Message };
