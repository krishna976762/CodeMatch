import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addUser } from "../utils/userSlice";
import { useEffect } from "react";
import Hero from "./Hero";

const Body = () => {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);
  const location = useLocation();

  const fetchUser = async () => {
    if (user) return;
    try {
      const res = await axios.get(BASE_URL + "/profile/view", {
        withCredentials: true,
      });
      dispatch(addUser(res.data));
    } catch {
      // guest user
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const isHomePage = location.pathname === "/";
  const isGuest = !user;

  return (
    <div className="w-full">
  <div
    className={`min-h-screen ${
      isGuest ? "bg-cover bg-center" : "bg-base-100"
    }`}
    style={
      isGuest
        ? { backgroundImage: "url('/images/wallpaper.png')" }
        : {}
    }
  >
    <Navbar />

    {isGuest && isHomePage ? (
      <Hero />
    ) : (
      <div className="min-h-[calc(100vh-64px)]">
        <Outlet />
      </div>
    )}

    {isGuest && <Footer />}
  </div>
</div>

  );
};

export default Body;
