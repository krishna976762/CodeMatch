const { Server } = require("socket.io");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const { Chat } = require("../models/Chat");
const User = require("../models/Users")
const ConnectionRequest = require("../models/ConnectionRequest");
const onlineUsers = new Map();
const getSecretRoomId = ({ userId, targetUserId }) => {
  return crypto
    .createHash("sha256")
    .update([userId, targetUserId].sort().join("_"))
    .digest("hex");
};

const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  // JWT verification middleware
  io.use((socket, next) => { 
    const cookie = socket.handshake.headers.cookie;
    if (!cookie) return next(new Error("No cookie"));

    const token = cookie
      .split("; ")
      .find((c) => c.startsWith("token="))
      ?.split("=")[1];

    if (!token) return next(new Error("No token"));

    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET);
      socket.userId = payload._id;
      next();
    } catch (err) {
      next(new Error("Invalid token"));
    }
  });

 io.on("connection", (socket) => {
  const userId = socket.userId;

  // Add socket to onlineUsers
  if (!onlineUsers.has(userId)) onlineUsers.set(userId, new Set());
  onlineUsers.get(userId).add(socket.id);

  // 1️⃣ Send current online users to this socket
  socket.emit("onlineUsers", Array.from(onlineUsers.keys()));

  // 2️⃣ Notify others that this user came online
  socket.broadcast.emit("userOnline", { userId });

  // JOIN CHAT ROOM
  socket.on("join", ({ firstName, targetUserId }) => {
    const senderId = socket.userId;
    if (!senderId || !targetUserId) return;

    const roomId = getSecretRoomId({ userId: senderId, targetUserId });
    socket.join(roomId);
    console.log(`${firstName} joined room ${roomId}`);
  });

  // SEND MESSAGE
  socket.on("sendMessage", async ({ firstName, targetUserId, text }) => {
    const senderId = socket.userId;
    if (!senderId || !targetUserId || !text) return;

    const roomId = getSecretRoomId({ userId: senderId, targetUserId });

    try {
      const isConnected = await ConnectionRequest.findOne({
        $or: [
          { fromUserId: senderId, toUserId: targetUserId, status: "accepted" },
          { fromUserId: targetUserId, toUserId: senderId, status: "accepted" },
        ],
      });

      if (!isConnected) {
        socket.emit("chatError", { message: "You are not connected with this user" });
        return;
      }

      let chat = await Chat.findOne({ participents: { $all: [senderId, targetUserId] } });
      if (!chat) chat = new Chat({ participents: [senderId, targetUserId], messages: [] });

      chat.messages.push({ senderId, text, createdAt: new Date() });
      await chat.save();

      io.to(roomId).emit("messageReceived", { firstName, sender: senderId, text, createdAt: new Date() });
    } catch (error) {
      console.error("Error sending message:", error);
    }
  });

  // DISCONNECT
  socket.on("disconnect", async () => {
    onlineUsers.get(userId)?.delete(socket.id);

    if (onlineUsers.get(userId)?.size === 0) {
      onlineUsers.delete(userId);

      const lastSeen = new Date();
      await User.findByIdAndUpdate(userId, { lastSeen });

      io.emit("userOffline", { userId, lastSeen });
    }
  });
});

};

module.exports = initializeSocket;
