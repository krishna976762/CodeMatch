import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";
import { useState, useEffect } from "react";

const NavBar = () => {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);

  const handleLogout = async () => {
    try {
      setLoading(true);

      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });

      dispatch(removeUser());
      setShowProfileModal(false);
      navigate("/login");
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user) {
      setShowProfileModal(false);
    }
  }, [user]);

  return (
    <>
      {/* NAVBAR */}
      <div className="navbar bg-black/40 backdrop-blur-md px-6 z-50">
        <div className="flex-1">
          <Link to="/" className="flex items-center gap-2 text-white">
            <span className="text-xl">{"< ❤️ >"}</span>
            <span className="font-semibold text-lg">CodeMatch</span>
          </Link>
        </div>

        {user && (
          <div className="flex items-center gap-4">
            <span className="text-white hidden md:block">
              Welcome, {user?.data?.firstName} 💕
            </span>

            {/* Avatar */}
            <div
              className="cursor-pointer"
              onClick={() => setShowProfileModal(true)}
            >
              <img
                className="w-10 h-10 rounded-full ring-2 ring-pink-400 hover:scale-110 transition-transform"
                src={user?.data?.photoUrl}
                alt="user"
              />
            </div>
          </div>
        )}
      </div>

      {/* MODAL */}
      {showProfileModal && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setShowProfileModal(false)}
          />

          {/* Modal Card */}
          <div className="relative bg-white rounded-3xl shadow-2xl w-[90%] max-w-sm p-6 animate-scaleIn">
            {/* Close */}
            <button
              className="absolute top-3 right-4 text-xl opacity-70 hover:opacity-100"
              onClick={() => setShowProfileModal(false)}
            >
              ✖
            </button>

            {/* Profile */}
            <div className="flex flex-col items-center text-center">
              <img
                src={user?.data?.photoUrl}
                alt="profile"
                className="w-24 h-24 rounded-full ring-4 ring-pink-400 mb-3"
              />

              <h2 className="text-xl font-semibold">
                {user?.data?.firstName} {user?.data?.lastName}
              </h2>

              <p className="text-sm opacity-70 mt-1">
                {user?.data?.about || "Full of love & code 💖"}
              </p>

              <div className="mt-4 w-full space-y-2">
                <Link
                  to="/profile"
                  className="btn btn-primary w-full rounded-full"
                  onClick={() => setShowProfileModal(false)}
                >
                  View Profile 💘
                </Link>

                <Link
                  to="/connections"
                  className="btn btn-outline w-full rounded-full"
                  onClick={() => setShowProfileModal(false)}
                >
                  Connections 🤝
                </Link>

                <Link
                  to="/requests"
                  className="btn btn-outline w-full rounded-full"
                  onClick={() => setShowProfileModal(false)}
                >
                  Requests 💌
                </Link>

                <button
                  className="btn btn-error w-full rounded-full"
                  onClick={handleLogout}
                >
                  Logout 🚪
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default NavBar;
