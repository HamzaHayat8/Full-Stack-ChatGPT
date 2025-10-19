import React, { useState } from "react";
import { useAppContext } from "../../context/AppContext";

function AuthForm() {
  const [isSignup, setIsSignup] = useState(false);
  const { axios, setToken, navigate } = useAppContext();

  const [name, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isSignup ? "/api/v1/register" : "/api/v1/login";

    try {
      const { data } = await axios.post(url, {
        name,
        email,
        password,
      });
      if (data.success) {
        setToken(data.token);
        localStorage.setItem("token", data.token);
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const toggleForm = () => {
    setIsSignup((prev) => !prev);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-50">
      <form
        onSubmit={handleSubmit}
        className="bg-white text-gray-500 max-w-[340px] w-full mx-4 md:p-6 p-4 py-8 text-left text-sm rounded-lg shadow-[0px_0px_10px_0px] shadow-black/10"
      >
        <h2 className="text-2xl font-bold mb-9 text-center text-gray-800">
          {isSignup ? "Sign Up" : "Log In"}
        </h2>

        {/* Username (only for signup) */}
        {isSignup && (
          <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
            <svg
              width="18"
              height="18"
              viewBox="0 0 15 15"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3.125 13.125a4.375 4.375 0 0 1 8.75 0M10 4.375a2.5 2.5 0 1 1-5 0 2.5 2.5 0 0 1 5 0"
                stroke="#6B7280"
                strokeOpacity=".6"
                strokeWidth="1.3"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input
              value={name}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full outline-none bg-transparent py-2.5"
              type="text"
              placeholder="Username"
              required={isSignup}
            />
          </div>
        )}

        {/* Email */}
        <div className="flex items-center my-2 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m2.5 4.375 3.875 2.906c.667.5 1.583.5 2.25 0L12.5 4.375"
              stroke="#6B7280"
              strokeOpacity=".6"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.875 3.125h-8.75c-.69 0-1.25.56-1.25 1.25v6.25c0 .69.56 1.25 1.25 1.25h8.75c.69 0 1.25-.56 1.25-1.25v-6.25c0-.69-.56-1.25-1.25-1.25Z"
              stroke="#6B7280"
              strokeOpacity=".6"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full outline-none bg-transparent py-2.5"
            type="email"
            placeholder="Email"
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center mt-2 mb-8 border bg-indigo-500/5 border-gray-500/10 rounded gap-1 pl-2">
          <svg
            width="18"
            height="18"
            viewBox="0 0 15 15"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="m2.5 4.375 3.875 2.906c.667.5 1.583.5 2.25 0L12.5 4.375"
              stroke="#6B7280"
              strokeOpacity=".6"
              strokeWidth="1.3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.875 3.125h-8.75c-.69 0-1.25.56-1.25 1.25v6.25c0 .69.56 1.25 1.25 1.25h8.75c.69 0 1.25-.56 1.25-1.25v-6.25c0-.69-.56-1.25-1.25-1.25Z"
              stroke="#6B7280"
              strokeOpacity=".6"
              strokeWidth="1.3"
              strokeLinecap="round"
            />
          </svg>
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full outline-none bg-transparent py-2.5"
            type="password"
            placeholder="Password"
            required
          />
        </div>

        <button className="w-full mb-3 bg-indigo-500 hover:bg-indigo-600 transition-all active:scale-95 py-2.5 rounded text-white font-medium">
          {isSignup ? "Create Account" : "Log In"}
        </button>

        <p className="text-center mt-4">
          {isSignup ? "Already have an account?" : "Don't have an account?"}{" "}
          <button
            type="button"
            className="text-blue-500 underline"
            onClick={toggleForm}
          >
            {isSignup ? "Log In" : "Sign Up"}
          </button>
        </p>
      </form>
    </div>
  );
}

export default AuthForm;
