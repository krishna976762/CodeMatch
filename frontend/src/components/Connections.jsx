import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/conectionSlice";
import NoRequests from "./NoRequests";
import { Link } from "react-router-dom";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const user = useSelector((store) => store.user)?.data;
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/user/connections`, {
        withCredentials: true,
      });
      dispatch(addConnections(res.data.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) return null;

  if (connections.length === 0) {
    return <NoRequests gender={user?.gender || "male"} />;
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-center text-3xl font-bold text-white mb-10">
        💞 Your Connections
      </h1>

      <div className="space-y-6">
        {connections.map((connection) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } =
            connection;

          return (
            <div
              key={_id}
              className="
                group flex items-center gap-6
                bg-gradient-to-r from-[#1A1A22] to-[#25253A]
                rounded-2xl p-6 shadow-xl
                hover:scale-[1.02] transition-all duration-300
              "
            >
              {/* Profile Image */}
              <div className="relative">
                <img
                  src={photoUrl}
                  alt="profile"
                  className="
                    w-24 h-24 rounded-full object-cover
                    ring-4 ring-pink-500/70
                  "
                />

                {/* Love indicator */}
                <span
                  className="
                  absolute -bottom-1 -right-1
                  bg-pink-500 text-white text-xs
                  px-2 py-1 rounded-full
                "
                >
                  💖
                </span>
              </div>

              {/* User Info */}
              <div className="flex-1">
                <h2
                  className="
                    flex items-center gap-2
                    text-2xl font-bold tracking-wide
                    text-white
                    transition-all duration-300 ease-out
                    group-hover:text-transparent
                    group-hover:bg-clip-text
                    group-hover:bg-gradient-to-r
                    group-hover:from-pink-400
                    group-hover:to-red-500
                    group-hover:scale-105
                    origin-left
                  "
                >
                  {firstName} {lastName}
                  <span
                    className="
                      opacity-0 scale-50
                      transition-all duration-300 ease-out
                      group-hover:opacity-100
                      group-hover:scale-100
                      text-pink-500 animate-pulse
                    "
                  >
                    💖
                  </span>
                </h2>

                {age && gender && (
                  <div className="flex gap-3 mt-2">
                    <span className="px-3 py-1 rounded-full text-sm bg-white/10 text-gray-300">
                      {age} yrs
                    </span>
                    <span className="px-3 py-1 rounded-full text-sm bg-white/10 text-gray-300 capitalize">
                      {gender}
                    </span>
                  </div>
                )}

                {/* About */}
                {about && (
                  <p
                    className="
      group/about
      relative mt-4
      text-gray-300 text-sm leading-relaxed
      transition-all duration-300
      hover:text-white
      hover:drop-shadow-[0_0_12px_rgba(236,72,153,0.45)]
    "
                  >
                    {about}

                    {/* tiny floating heart */}
                    <span
                      className="
        absolute -top-2 -right-2
        text-[12px]
        opacity-0 scale-75
        group-hover/about:opacity-100
        group-hover/about:scale-100
        transition-all duration-300
      "
                    >
                      💖
                    </span>
                  </p>
                )}
                <Link to={"/chat/" + _id}>
                  <button className="btn btn-primary">Chat</button>
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Connections;
