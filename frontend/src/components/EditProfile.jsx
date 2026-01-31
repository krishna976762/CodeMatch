import { useState } from "react";
import UserCard from "./UserCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();
  const [showToast, setShowToast] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    firstName: user?.data?.firstName || "",
    lastName: user?.data?.lastName || "",
    photoUrl: user?.data?.photoUrl || "",
    age: user?.data?.age || "",
    gender: user?.data?.gender || "",
    about: user?.data?.about || "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const saveProfile = async () => {
    setError("");
    try {
      const res = await axios.patch(
        `${BASE_URL}/profile/edit`,
        form,
        { withCredentials: true }
      );
      dispatch(addUser(res.data.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError("Something went wrong");
    }
  };

  return (
    <>
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">

        {/* LEFT – EDIT FORM */}
        <div className="bg-base-300 rounded-3xl p-8 shadow-xl">
          <h2 className="text-2xl font-bold mb-6 text-center text-pink-500">
            Edit Your Profile
          </h2>

          <div className="space-y-4">
            <input
              name="firstName"
              placeholder="First Name"
              value={form.firstName}
              onChange={handleChange}
              className="input input-bordered w-full"
            />

            <input
              name="lastName"
              placeholder="Last Name"
              value={form.lastName}
              onChange={handleChange}
              className="input input-bordered w-full"
            />

            <input
              name="photoUrl"
              placeholder="Profile Photo URL"
              value={form.photoUrl}
              onChange={handleChange}
              className="input input-bordered w-full"
            />

            <div className="grid grid-cols-2 gap-4">
              <input
                name="age"
                type="number"
                placeholder="Age"
                value={form.age}
                onChange={handleChange}
                className="input input-bordered w-full"
              />

              <select
                name="gender"
                value={form.gender}
                onChange={handleChange}
                className="select select-bordered w-full"
              >
                <option value="">Gender</option>
                <option>male</option>
                <option>female</option>
                <option>other</option>
              </select>
            </div>

            <textarea
              name="about"
              placeholder="Tell something about yourself…"
              value={form.about}
              onChange={handleChange}
              className="textarea textarea-bordered w-full h-24"
            />

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              onClick={saveProfile}
              className="btn w-full bg-gradient-to-r from-pink-500 to-purple-600 text-white border-none mt-4"
            >
              Save Profile
            </button>
          </div>
        </div>

        {/* RIGHT – LIVE PREVIEW */}
        <div className="flex justify-center min-h-screen sticky top-10 overflow-visible">
          <UserCard user={form || user} />
        </div>
      </div>

      {showToast && (
        <div className="toast toast-top toast-center">
          <div className="alert alert-success">
            <span>Profile updated successfully 🎉</span>
          </div>
        </div>
      )}
    </>
  );
};

export default EditProfile;
