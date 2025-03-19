import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Login = () => {
  const [dealerId, setDealerId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate(); // Hook for navigation

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (!dealerId || !password) {
      setMessage("Both fields are required!");
      setLoading(false);
      return;
    }

    const loginData = { dealerId, password };

    try {
      const response = await axios.post("/api/v1/auth/user-login", loginData);
      
      // Save JWT token in localStorage
      localStorage.setItem("token", response.data.token);

      setMessage("Login successful!");

      // Redirect to the home page after 1 second
      setTimeout(() => {
        navigate("/");
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.error || "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">User Login</h2>

        {message && <p className="text-center text-red-600">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Dealer ID:</label>
            <input
              type="text"
              value={dealerId}
              onChange={(e) => setDealerId(e.target.value)}
              required
              className="w-full p-2 border rounded"
              placeholder="Enter your Dealer ID"
            />
          </div>

          <div className="relative">
            <label className="block font-medium">Password:</label>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full p-2 border rounded pr-10"
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 flex items-center"
            >
              {showPassword ? "🔓" : "🔒"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
