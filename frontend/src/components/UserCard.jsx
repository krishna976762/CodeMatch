import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { useState } from "react";

const UserCard = ({ user }) => {
  const dispatch = useDispatch();
  const [expanded, setExpanded] = useState(false);
const [flipped, setFlipped] = useState(false);
  const {
    _id,
    firstName,
    lastName,
    photoUrl,
    about,
    skills = [],
    age,
  } = user;

  const handleSendRequest = async (status) => {
    try {
      await axios.post(
        `${BASE_URL}/request/send/${status}/${_id}`,
        {},
        { withCredentials: true }
      );
      dispatch(removeUserFromFeed(_id));
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex items-center justify-center overflow-visible">

      {/* CARD */}
      <div className="relative w-[360px] h-[78vh] perspective mt-6 mb-10">

  <div
    className={`relative w-full h-full transition-transform duration-700 ease-in-out
      transform-style-preserve-3d
      ${flipped ? "rotate-y-180" : ""}
    `}
  >

    {/* ================= FRONT SIDE ================= */}
    <div className="absolute inset-0 overflow-hidden backface-hidden rounded-3xl overflow-hidden">

      {/* Image */}
      <img
        src={photoUrl}
        alt="profile"
        className="w-full h-full object-cover"
      />

      {/* Gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />


<div
  className={`absolute left-0 right-0 bottom-16 px-6 z-40 flex items-center justify-between text-white ${flipped ? "hidden" : ""}`}
>

  <h2 className="text-xl md:text-2xl font-extrabold tracking-wide drop-shadow-lg">
  {firstName} {lastName}
  {age && (
    <span className="block opacity-90 text-lg">
      {age} years
    </span>
  )}
</h2>


  <button
    onClick={() => setFlipped(true)}
    className="
      w-12 h-12 rounded-full
      bg-gradient-to-br from-white-500 to-red-500
      flex items-center justify-center
      shadow-2xl
      hover:scale-125 hover:shadow-pink-500/50 transition-all duration-300
      text-white text-xl
    "
    title="See more"
  >
    💖
  </button>
</div>






      {/* Flip Button */}
       
    </div>


      {/* Actions */}
{/* Actions */}

{/* Actions */}
<div
  className="
    absolute z-[999]  mb-[50px]
    left-1/2 -bottom-[5rem] -translate-x-1/2
    flex justify-center gap-6
    overflow-visible
    pointer-events-none
  "
>
  {/* ❌ Button */}
  <button
    onClick={() => handleSendRequest('ignored')}
    className="
      pointer-events-auto
      w-16 h-16 rounded-full 
      bg-red-500 
      shadow-lg 
      ring-2 ring-red-300
      text-white text-2xl 
      flex items-center justify-center 
      transition-all duration-300
      hover:scale-110 hover:shadow-2xl
      active:scale-95 active:shadow-inner
    "
  >
    ✕
  </button>

  {/* ❤️ Button */}
  <button
    onClick={() => handleSendRequest('interested')}
    className="
      pointer-events-auto
      w-16 h-16 rounded-full 
      bg-gradient-to-br from-pink-500 to-red-600 
      shadow-lg 
      ring-2 ring-pink-300
      text-white text-2xl 
      flex items-center justify-center 
      transition-all duration-300
      hover:scale-110 hover:shadow-2xl
      active:scale-95 active:shadow-inner
    "
  >
    ♥
  </button>
</div>



    {/* ================= BACK SIDE ================= */}
    <div className="
      absolute inset-0 backface-hidden rotate-y-180
      rounded-3xl bg-gradient-to-br from-pink-100 to-rose-200
      flex flex-col
    ">

      {/* Romantic Header */}
      <div className="text-center py-6">
        <h2 className="text-2xl font-bold text-pink-700">
          {firstName} {lastName}
        </h2>
        <p className="text-sm text-pink-500">💞 It’s a connection</p>
      </div>

      {/* Content */}
      <div className="flex-1 px-6 overflow-y-auto">
        {about && (
          <p className="text-gray-700 text-sm leading-relaxed">
            {about}
          </p>
        )}

        {skills.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-4">
            {skills.map((skill, index) => (
              <span
                key={index}
                className="px-3 py-1 text-xs rounded-full bg-white text-pink-600 font-medium"
              >
                {skill}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Back Button */}
      <div className="py-12 flex justify-center">
        <button
          onClick={() => setFlipped(false)}
          className="px-6 py-2 rounded-full bg-pink-500 text-white shadow hover:scale-105 transition"
        >
          🔙 Back
        </button>
      </div>
    </div>

  </div>
</div>

    </div>
  );
};

export default UserCard;
