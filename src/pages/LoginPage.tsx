import React, { useState } from "react";
import { Rocket, Lock, Mail, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";
import "../styles/HomePage.css";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { login, isLoggingIn } = useAuthStore();

  //Right now just email validation, can add more complex validation later if we want
  const validateForm = () => {
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Invalid email format");
    } else {
      return true;
    }

    return false;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const success = validateForm();
    if (success === true) {
      //API call to login endpoint
      login(formData); //from useAuthStore.ts
    }
  };

  return (
    <div className="home">
      {/* Header with car */}
      <div
        className="cover flex flex-col items-center justify-center"
        style={{ minHeight: "25vh" }}
      >
        <Rocket size={48} className="text-[var(--c3)] mb-1 mt-3" />
        <h3>Ctrl-Alt-Elite</h3>
        <p className="desc text-center p-4">Make Bootcamp Fun!</p>
      </div>

      {/* Login Form */}
      <div className="bg-[rgba(26,26,46,0.85)] rounded-lg shadow-lg w-full max-w-lg mx-auto p-4 mb-4">
        <h3 className="header text-center text-2xl mb-6">Log In</h3>
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Email */}
          <div>
            <label className="block text-[var(--c3)] font-['Press_Start_2P'] text-sm mb-2">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Mail size={18} className="text-[var(--c3)]" />
              </div>
              <input
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="w-full pl-10 py-3 px-3 rounded-lg border-2 border-[var(--c3)] bg-[#23234d] text-[var(--c3)] focus:outline-none font-['Press_Start_2P'] text-sm"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-[var(--c3)] font-['Press_Start_2P'] text-sm mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <Lock size={18} className="text-[var(--c3)]" />
              </div>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="w-full pl-10 py-3 px-3 rounded-lg border-2 border-[var(--c3)] bg-[#23234d] text-[var(--c3)] focus:outline-none font-['Press_Start_2P'] text-sm"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="mt-4">
            <button
              type="submit"
              className={`w-full rounded-lg bg-[var(--c2)] text-[var(--c1)] py-3 px-6 font-['Press_Start_2P'] text-base flex justify-center items-center transition-all duration-200 ${
                isLoggingIn
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:shadow-lg"
              }`}
              disabled={isLoggingIn}
            >
              {isLoggingIn ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                </>
              ) : (
                "Log in"
              )}
            </button>
          </div>
        </form>

        {/* Don't have an account */}
        <div className="mt-8 text-center">
          <p className="font-['Press_Start_2P'] text-sm text-white">
            Don't have an account?{" "}
            <Link
              to="/signup"
              className="text-[var(--c2)] no-underline hover:text-[var(--c2)]"
            >
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
