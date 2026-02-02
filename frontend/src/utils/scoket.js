import { io } from "socket.io-client";

export const CreateSocketConnection = () => {
  if (window.location.hostname === "localhost") {
    return io("http://localhost:5000", {
      withCredentials: true,
    });
  } else {
    return io("/", {
      path: "/api/socket.io",
      withCredentials: true,
    });
  }
};
