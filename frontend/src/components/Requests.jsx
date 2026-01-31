import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";
import { useEffect } from "react";
import NoRequests from "./NoRequests";

const Requests = () => {
  const requests = useSelector((store) => store.requests);
  const user = useSelector((store) => store.user)?.data;
  const dispatch = useDispatch();

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        `${BASE_URL}/request/review/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeRequest(_id));
    } catch (err) {}
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(
        `${BASE_URL}/user/request/received`,
        { withCredentials: true }
      );
      dispatch(addRequests(res.data.data));
    } catch (err) {}
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) return null;

  if (requests.length === 0) {
    return <NoRequests gender={user?.gender || "male"} />;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
  <h1 className="text-center text-3xl font-bold text-white mb-8">
    💖 Connection Requests
  </h1>

  <div className="space-y-6">
    {requests.map((request) => {
      const {
        _id,
        firstName,
        lastName,
        photoUrl,
        age,
        gender,
        about,
        skills
      } = request.fromUserId;

      return (
        <div
  key={_id}
  className="
    group bg-gradient-to-r from-[#1A1A22] to-[#222235]
    rounded-2xl shadow-xl p-5
    flex flex-col sm:flex-row
    gap-5 sm:gap-6
    hover:scale-[1.02] transition-all duration-300
  "
>

          {/* Profile Image */}
          <img
  src={photoUrl}
  alt="profile"
  className="
    w-20 h-20 sm:w-24 sm:h-24
    rounded-full object-cover
    ring-4 ring-purple-600
    mx-auto sm:mx-0
  "
/>


          {/* User Info */}
          <div className="flex-1 text-center sm:text-left">

            <h2 className="flex items-center gap-2 text-2xl font-bold tracking-wide text-white transition-all duration-300 ease-out group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-red-500 group-hover:scale-105 origin-left">
              {firstName} {lastName}
              <span className="opacity-0 scale-50 transition-all duration-300 ease-out group-hover:opacity-100 group-hover:scale-100 text-pink-500 animate-pulse">
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
{/* About */}
{about && (
  <p
    className="
      group/about
      text-left sm:text-left
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



            {/* Skills */}
{/* Skills */}
{skills.length > 0 && (
  <div className="flex flex-wrap gap-2 mt-3">
    {skills.map((skill, index) => (
      <span
        key={index}
        className="
          group/skill
          relative px-4 py-1.5
          rounded-full text-xs font-medium
          text-[#f5e6ff]
          bg-white/10
          ring-1 ring-white/20
          backdrop-blur-md
          transition-all duration-300
          hover:bg-white/20
          hover:ring-pink-400/40
          hover:shadow-[0_0_16px_rgba(236,72,153,0.35)]
          hover:-translate-y-0.5
        "
      >
        {skill}

        {/* subtle heart */}
        <span
          className="
            absolute -top-1 -right-1 text-[10px]
            opacity-0 scale-0
            group-hover/skill:opacity-100
            group-hover/skill:scale-100
            transition-all duration-300
          "
        >
          💗
        </span>
      </span>
    ))}
  </div>
)}


          </div>

          {/* Actions */}
          <div
  className="
    flex flex-row sm:flex-col
    gap-3 sm:gap-4
    justify-center
    mt-4 sm:mt-0
  "
>

            <button
              className="px-6 py-2 rounded-full border border-red-400 text-red-400 hover:bg-red-400 hover:text-white transition"
              onClick={() => reviewRequest("rejected", request._id)}
            >
              <span className="inline-block group-hover:hidden">❤️</span>
  {/* Hover white cross ❌ 🤍 */}
  <span className="hidden group-hover:inline-block">🤍</span>
  <span className="ml-2 group-hover:text-white">Reject</span>
            </button>

            <button
  className="px-6 py-2 rounded-full bg-purple-600 hover:bg-purple-700 text-white transition-shadow shadow-lg group"
  onClick={() => reviewRequest("accepted", request._id)}
>
   <span className="transition-colors">
    <span className="inline-block group-hover:hidden">🤍</span>
    <span className="hidden group-hover:inline-block text-red-400">❤️</span>
  </span>
  <span className="group-hover:text-red-400 transition-colors">Accept</span>
</button>

          </div>
        </div>
      );
    })}
  </div>
</div>


  );
};

export default Requests;
