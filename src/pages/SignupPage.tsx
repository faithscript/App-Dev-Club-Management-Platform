import React, { useState } from "react";
import {
  Rocket,
  User,
  Lock,
  Mail,
  IdCard,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuthStore } from "../store/useAuthStore";

const SignupPage = () => {
  const { signup, isSigningUp } = useAuthStore();

  const [formData, setFormData] = useState({
    accountType: "",
    fullName: "",
    email: "",
    password: "",
  });

  //Right now just a basic name and email validation, can add more complex validation later if we want
  const validateForm = () => {
    if (formData.fullName.trim().split(" ").length < 2) {
      alert("Please enter your full name (first and last name)");
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
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
      signup(formData);
    }
  };

  return (
    <div className="home">
      {/* Header with car */}
      <div
        className="cover flex flex-col items-center justify-center"
        style={{ minHeight: "20vh" }}
      >
        <Rocket size={48} className="text-[var(--c3)] mb-1 mt-3" />
        <h3>Ctrl-Alt-Elite</h3>
        <p className="desc text-center p-2">Make Bootcamp Fun!</p>
      </div>

      <div className="bg-[rgba(26,26,46,0.85)] rounded-lg shadow-lg w-full max-w-lg mx-auto p-4 mb-4">
        <h3 className="header text-center text-2xl mb-4">Sign Up</h3>
        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Account Type */}
          <div>
            <label className="block text-[var(--c3)] font-['Press_Start_2P'] text-sm mb-2">
              Account Type
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <IdCard size={18} className="text-[var(--c3)]" />
              </div>
              <select
                id="accountType"
                value={formData.accountType}
                onChange={(e) =>
                  setFormData({ ...formData, accountType: e.target.value })
                }
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 appearance-none font-['Press_Start_2P'] text-sm"
                required
              >
                <option value="" className="text-gray-400" disabled>
                  Select account type
                </option>
                <option value="Student" className="text-gray-700">
                  Student
                </option>
                <option value="Mentor" className="text-gray-700">
                  Mentor
                </option>
                <option value="Admin" className="text-gray-700">
                  Admin
                </option>
              </select>
              <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
                <ChevronDown size={18} className="text-gray-400" />
              </div>
            </div>
          </div>

          {/* Full Name */}
          <div>
            <label className="block text-[var(--c3)] font-['Press_Start_2P'] text-sm mb-2">
              Full Name
            </label>
            <div className="relative">
              <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
                <User size={18} className="text-[var(--c3)]" />
              </div>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="w-full pl-10 py-3 px-3 rounded-lg border-2 border-[var(--c3)] bg-[#23234d] text-[var(--c3)] focus:outline-none font-['Press_Start_2P'] text-sm appearance-none"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

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
          <div className="mt-2">
            <button
              type="submit"
              disabled={isSigningUp}
              className={`w-full rounded-lg bg-[var(--c2)] text-[var(--c1)] py-3 px-6 font-['Press_Start_2P'] text-base flex justify-center items-center transition-all duration-200 ${
                isSigningUp
                  ? "opacity-70 cursor-not-allowed"
                  : "hover:shadow-lg"
              }`}
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="animate-spin mr-2" size={20} />
                  Loading...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>

        {/* Already have an account */}
        <div className="mt-4 text-center">
          <p className="font-['Press_Start_2P'] text-sm text-white">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-[var(--c2)] no-underline hover:text-[var(--c2)]"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
