import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const words = ["code", "startups", "side-projects", "ideas"];

const Hero = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();
  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % words.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center justify-center h-[80vh] text-center px-4">
      <div className="p-10 rounded-3xl shadow-2xl max-w-2xl">
        <h1 className="text-4xl md:text-5xl font-bold text-white leading-tight">
          Match with developers who love{" "}
          <span className="text-red-500 transition-all duration-500">
            {words[index]}
          </span>
        </h1>

        <p className="text-gray-300 mt-4 text-lg">
          CodeMatch helps developers connect, collaborate, and build amazing
          things together.
        </p>

        <div className="mt-8 flex justify-center gap-4">
          <button
            className="btn btn-primary"
            onClick={() => navigate("/login", { state: { mode: "signup" } })}
          >
            Get Started
          </button>

          <Link to="/login" className="btn btn-outline btn-error px-8">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Hero;
