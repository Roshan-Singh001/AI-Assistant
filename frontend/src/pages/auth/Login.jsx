import React from 'react'
import { useState, } from "react";
import { useNavigate, Link } from "react-router-dom";
import { authClient } from '../../utils/auth_client';
import { toast } from 'react-toastify';

const Login = () => {
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
        console.log("Submitting login form with data:", formData);

        if (!formData.email || !formData.password) {
            return setMessage({ type: "error", text: "All fields are required." });
        }

        const {data, error} = await authClient.signIn.email({
            email: formData.email,
            password: formData.password,
        }, {
            onRequest: (ctx)=>{
                setLoading(true);
            },
            onResponse: (ctx)=>{
                setLoading(false);
            },
            onError: (ctx)=>{
                toast.error(ctx.error.message);
            },
            onSuccess: (ctx)=>{
                toast.success("Login successful!");
                navigate("/");
            }
        });

        console.log("Login response data:", data, error);

    }
    return (
        <>
            <div className="flex justify-center items-center min-h-screen bg-gray-50">
                <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
                    <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
                        Login to Your Account
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

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full text-white font-semibold py-2 rounded-lg transition duration-200 ${loading
                                ? "bg-blue-300 cursor-not-allowed"
                                : "bg-blue-600 hover:bg-blue-700"
                                }`}
                        >
                            {loading ? "Login..." : "Login"}
                        </button>
                    </form>

                    <p className="mt-4 text-center text-gray-600 text-sm">
                        Don't have an account?{" "}
                        <Link
                            to="/register"
                            className="text-blue-600 hover:underline font-medium"
                        >
                            Register here
                        </Link>
                    </p>
                </div>
            </div>

        </>
    )
}

export default Login