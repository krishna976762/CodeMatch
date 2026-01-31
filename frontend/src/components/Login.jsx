import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";
import { BASE_URL } from "../utils/constants";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [isLoginForm, setIsLoginForm] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Form fields
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [emailId, setEmailId] = useState("");
  const [password, setPassword] = useState("");
  const [age, setAge] = useState("");
  const [gender, setGender] = useState("");
  const [skills, setSkills] = useState("");
  const [about, setAbout] = useState("");
  const [photoUrl, setPhotoUrl] = useState("");

  // Small helper for errors
  const getAuthErrorMessage = (status) => {
    switch (status) {
      case 400:
        return "Bad request 🤖 — payload mismatch!";
      case 401:
        return "Unauthorized ❌ — login failed!";
      case 404:
        return "Endpoint not found 🚧 — API ghosted us!";
      default:
        return "Something went wrong 💥 — check console.";
    }
  };

  const validateInputs = () => {
    if (!emailId.includes("@")) return "Email looks invalid 🧑‍💻";
    if (password.length < 6) return "Password too weak ⚠️";
    return null;
  };

  const handleLogin = async () => {
    const validationError = validateInputs();
    if (validationError) return setError(validationError);

    try {
      setLoading(true);
      setError("");
      const res = await axios.post(
        BASE_URL + "/login",
        { email: emailId, password },
        { withCredentials: true },
      );
      dispatch(addUser(res.data));
      navigate("/");
    } catch (err) {
      setError(getAuthErrorMessage(err?.response?.status));
    } finally {
      setLoading(false);
    }
  };

  const handleSignUp = async () => {
    const validationError = validateInputs();
    if (validationError) return setError(validationError);

    try {
      setLoading(true);
      setError("");
      const res = await axios.post(
        BASE_URL + "/signup",
        {
          firstName,
          lastName,
          emailId,
          password,
          age,
          gender,
          skills: skills.split(","),
          about,
          photoUrl,
        },
        { withCredentials: true },
      );
      dispatch(addUser(res.data));
      navigate("/profile");
    } catch (err) {
      setError(getAuthErrorMessage(err?.response?.status));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (location.state?.mode === "signup") {
      setIsLoginForm(false);
    }
  }, []);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-pink-100 to-purple-200 p-4">
      <div className="card bg-white shadow-2xl rounded-2xl w-full max-w-md p-6 animate-fadeIn">
        <h2 className="text-2xl font-bold text-center mb-4 text-pink-500">
          {isLoginForm ? "Login" : "Sign Up 💖"}
        </h2>

        {!isLoginForm && (
          <>
            <input
              type="text"
              placeholder="First Name"
              className="input input-bordered my-2"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              type="text"
              placeholder="Last Name"
              className="input input-bordered my-2"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <input
              type="number"
              placeholder="Age"
              className="input input-bordered my-2"
              value={age}
              onChange={(e) => setAge(e.target.value)}
            />
            <select
              className="input input-bordered my-2"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select Gender</option>
              <option value="female">Female</option>
              <option value="male">Male</option>
              <option value="other">Other</option>
            </select>
            <input
              type="text"
              placeholder="Skills (comma separated)"
              className="input input-bordered my-2"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
            />
            <textarea
              placeholder="About You"
              className="input input-bordered my-2"
              value={about}
              onChange={(e) => setAbout(e.target.value)}
            />
            <input
              type="text"
              placeholder="Photo URL"
              className="input input-bordered my-2"
              value={photoUrl}
              onChange={(e) => setPhotoUrl(e.target.value)}
            />
          </>
        )}

        <input
          type="text"
          placeholder="Email ID"
          className="input input-bordered my-2"
          value={emailId}
          onChange={(e) => setEmailId(e.target.value)}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="input input-bordered w-full my-2 pr-10"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <span
            className="absolute right-3 top-4 cursor-pointer text-sm opacity-70"
            onClick={() => setShowPassword((v) => !v)}
          >
            {showPassword ? "🙈" : "👁️"}
          </span>
        </div>

        {error && (
          <div className="text-red-500 text-sm mt-2 p-2 rounded">{error}</div>
        )}

        <button
          className="btn btn-primary w-full mt-4 animate-pulse hover:scale-105 transition-transform duration-300"
          disabled={loading}
          onClick={isLoginForm ? handleLogin : handleSignUp}
        >
          {loading ? "Authenticating..." : isLoginForm ? "Login" : "Sign Up 💌"}
        </button>

        <p
          className="relative z-10 text-center mt-4 cursor-pointer text-sm text-pink-400 hover:text-pink-600 transition-colors select-none"
          onClick={() => {
            setError("");
            setIsLoginForm((v) => !v);
          }}
        >
          {isLoginForm
            ? "New User? Signup Here 💖 ✋"
            : "Existing User? Login Here 🔒 🖐️"}
        </p>
      </div>
    </div>
  );
};

export default Login;
