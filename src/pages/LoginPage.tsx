import React, { useState } from "react";
import { Car, Lock, Mail } from "lucide-react";
import { Link } from "react-router-dom";

const SignupPage = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

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
              className="w-full rounded-md bg-[#334EAC] py-3 text-white font-medium hover:bg-[#081F5C]"
            >
              Sign Up
            </button>
          </div>
        </form>

        {/* Already have an account */}
        <div className="bg-gray-50 pb-4 text-center font-bold">
          <p className="text-sm">
            Don't have an account?{" "}
            <Link to="/signup" className="text-blue-600 hover:text-blue-800">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
