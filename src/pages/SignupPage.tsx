import React, { useState } from "react";
import {
  Car,
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
    <div className="min-h-screen bg-[#BAD6EB] flex items-center justify-center p-4">
      <div className="bg-white rounded-lg max-w-md w-full">
        {/* Header with car */}
        <div className="bg-[#334EAC] p-6 flex flex-col items-center">
          <Car size={48} className="text-white mb-2" />
          <h1 className="text-2xl font-bold text-white">Ctrl-Alt-Elite</h1>
          <p className="text-[#F7F2EB]">Make Bootcamp Fun!</p>
        </div>

        {/* Signup Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Account Type */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Account Type
            </label>
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <IdCard size={18} className="text-gray-400" />
              </div>
              <select
                id="accountType"
                value={formData.accountType}
                onChange={(e) =>
                  setFormData({ ...formData, accountType: e.target.value })
                }
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3 appearance-none"
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
            <label className="text-sm font-medium text-gray-700">
              Full Name
            </label>
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <User size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                className="input pl-10 w-full rounded-md border border-gray-300 py-2 px-3"
                placeholder="John Doe"
                required
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail size={18} className="text-gray-400" />
              </div>
              <input
                id="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3"
                placeholder="your@email.com"
                required
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-2">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock size={18} className="text-gray-400" />
              </div>
              <input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                className="pl-10 w-full rounded-md border border-gray-300 py-2 px-3"
                placeholder="••••••••"
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={isSigningUp}
              className="w-full rounded-md bg-[#334EAC] py-3 text-white font-medium hover:bg-[#081F5C] flex items-center justify-center"
            >
              {isSigningUp ? (
                <>
                  <Loader2 className="size-5 animate-spin" />
                  Loading...
                </>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>
        </form>

        {/* Already have an account */}
        <div className="bg-gray-50 pb-4 text-center font-bold">
          <p className="text-sm">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:text-blue-800">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
