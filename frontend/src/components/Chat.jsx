import { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { CreateSocketConnection } from "../utils/scoket";
import { useSelector } from "react-redux";
import ChatSkeleton from "../loader/ChatSkeleton";
import { formatLastSeen } from "../utils/helper";
import axios from "axios";
import { BASE_URL } from "../utils/constants";

const Chat = () => {
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [lastSeenMap, setLastSeenMap] = useState({});
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [loader, setLoader] = useState(true);
  const [targetUser, setTargetUser] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  console.log(lastSeenMap, "lastSeenMap");
  const user =
    useSelector((store) => store.user)?.data ||
    useSelector((store) => store.user);
  const userId = user?._id;
  const fetchMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });
    const chatMessages = chat?.data?.chat?.messages.map((msg) => {
      const { senderId, text } = msg;
      return {
        firstName: senderId?.firstName,
        lastName: senderId?.lastName,
        text: text,
      };
    });
    setLoader(false);
    setMessages(chatMessages);
    setLastSeenMap(chat?.data?.targetUser?.lastSeen);
    setTargetUser(chat?.data?.targetUser);
  };

  useEffect(() => {
    fetchMessages();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!userId || !targetUserId) return;

    socketRef.current = CreateSocketConnection();

    socketRef.current.emit("join", {
      firstName: user?.firstName,
      userId,
      targetUserId,
    });

    socketRef.current.on("onlineUsers", (users) => {
      setOnlineUsers(new Set(users));
    });
    socketRef.current.on("messageReceived", ({ firstName, text }) => {
      if (firstName === user.firstName) return;
      setMessages((prev) => [...prev, { firstName, text }]);
    });
    socketRef.current.on("userOnline", ({ userId }) => {
      setOnlineUsers((prev) => new Set(prev).add(userId));
      setTargetUser((prev) => ({ ...prev, lastSeen: null }));
    });

    socketRef.current.on("userOffline", ({ userId, lastSeen }) => {
      setOnlineUsers((prev) => {
        const s = new Set(prev);
        s.delete(userId);
        return s;
      });
      if (userId === targetUserId) {
        setTargetUser((prev) => ({ ...prev, lastSeen }));
      }
    });

    return () => socketRef.current.disconnect();
  }, [userId, targetUserId]);

  const sendMessage = () => {
    if (!newMessage.trim()) return;

    const msg = {
      firstName: user.firstName,
      text: newMessage,
    };

    setMessages((prev) => [...prev, msg]);

    socketRef.current.emit("sendMessage", {
      firstName: user.firstName,
      userId,
      targetUserId,
      text: newMessage,
    });

    setNewMessage("");
  };

  if (loader) {
    return <ChatSkeleton />;
  }

  return (
    <div className="w-full mt-5 max-w-3xl mx-auto h-[80vh] bg-[#0f0f14] rounded-2xl shadow-xl flex flex-col overflow-hidden border border-white/10">
      {/* 🔝 Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#14141d]">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 flex items-center justify-center text-white font-bold">
              {user?.firstName?.[0]}
            </div>
            <span
              className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-[#14141d]
              ${onlineUsers.has(targetUserId) ? "bg-green-500" : "bg-gray-500"}`}
            />
          </div>

          <div>
            <p className="text-white font-semibold">{`${targetUser?.firstName} ${targetUser?.lastName}`}</p>
            <p className="text-xs text-gray-400">
              {onlineUsers.has(targetUserId)
                ? "Online"
                : `Last seen: ${formatLastSeen(targetUser?.lastSeen)}`}
            </p>
          </div>
        </div>
      </div>

      {/* 💬 Messages */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4 scrollbar-hide">
        {messages.map((msg, index) => {
          const isMe = msg.firstName === user?.firstName;

          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[70%] px-4 py-3 rounded-2xl text-sm shadow-md
              ${
                isMe
                  ? "bg-gradient-to-r from-pink-500 to-purple-600 text-white rounded-br-sm"
                  : "bg-white/10 text-white rounded-bl-sm backdrop-blur"
              }`}
              >
                {!isMe && (
                  <p className="text-xs text-gray-400 mb-1">{msg.firstName}</p>
                )}
                {msg.text}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* ⌨️ Input */}
      <div className="p-4 border-t border-white/10 bg-[#14141d] flex items-center gap-3">
        <input
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type something sweet… 💕"
          className="flex-1 bg-[#0f0f14] text-white placeholder-gray-500 rounded-full px-5 py-3 outline-none border border-white/10 focus:border-pink-500 transition"
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />

        <button
          onClick={sendMessage}
          className="px-5 py-3 rounded-full bg-gradient-to-r from-pink-500 to-purple-600 text-white font-semibold shadow-lg hover:scale-105 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;
