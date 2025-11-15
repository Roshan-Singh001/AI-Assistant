import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authClient } from '../../utils/auth_client';
import { toast } from "react-toastify";
import axios from "axios";

const AxiosInstance = axios.create({
  baseURL: 'http://localhost:3000/',
  timeout: 3000,
  headers: {'X-Custom-Header': 'foobar'}
});

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!formData.email || !formData.password || !formData.confirmPassword) {
      return setMessage({ type: "error", text: "All fields are required." });
    }
    if (formData.password.length < 6) {
      return setMessage({ type: "error", text: "Password must be at least 6 characters." });
    }
    if (formData.password !== formData.confirmPassword) {
      return setMessage({ type: "error", text: "Passwords do not match." });
    }

    try {
      setLoading(true);
      const { data, error } = await authClient.signUp.email({
        email: formData.email, // user email address
        password: formData.password, // user password -> min 8 characters by default
        name: formData.email, // user display name
        callbackURL: "/" // A URL to redirect to after the user verifies their email (optional)
      }, {
        onRequest: (ctx) => {
          //show loading
        },
        onSuccess: async(ctx) => {
          toast.success("Registration successful!");
          navigate("/login");
        },
        onError: (ctx) => {
          toast.error(ctx.error.message);
        },
      });


      try {
        await AxiosInstance.post('/api/new_user',{
          userId: data.user.id,
        })
      } catch (error) {
        console.error("Error in creating user tables:", error);
      }
      console.log("Registration data:", data, error);
    } catch (err) {
      console.error("Register error:", err);
      setMessage({
        type: "error",
        text:
          err.response?.data?.message ||
          "Registration failed. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
          Create an Account
        </h2>

        {message.text && (
          <div
            className={`mb-4 p-3 rounded-lg text-sm ${message.type === "error"
                ? "bg-red-100 text-red-600"
                : "bg-green-100 text-green-700"
              }`}
          >
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-gray-700 text-sm font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              placeholder="Re-enter password"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full text-white font-semibold py-2 rounded-lg transition duration-200 ${loading
                ? "bg-blue-300 cursor-not-allowed"
                : "bg-blue-600 hover:bg-blue-700"
              }`}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-4 text-center text-gray-600 text-sm">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-blue-600 hover:underline font-medium"
          >
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
