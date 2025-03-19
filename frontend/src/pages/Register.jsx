import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
const Register = () => {
  const   navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [city, setCity] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPass, setConfirmPass] = useState("");
  const [dealerId, setDealerId] = useState(generateDealerID());
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Function to generate a 10-character alphanumeric ID
  function generateDealerID() {
    return Math.random().toString(36).substring(2, 12).toUpperCase();
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    if (password !== confirmPass) {
      setMessage("Passwords do not match!");
      setLoading(false);
      return;
    }

    const userData = { username, city, password, dealerId, phone, email };
    console.log(userData);
    
    try {
       const res = await axios.post("/api/v1/auth/register", userData);
       setMessage(res.data.message);
       setUsername("");
       setCity("");
       setPassword("");
       setConfirmPass("");
       setPhone("");
       setEmail("");
       setDealerId(generateDealerID()); // Generate new ID for next user
       setTimeout(()=>{
        navigate("/login");
       }, 1000)
    } catch (error) {
      setMessage(error.response?.data?.error || "Registration failed");
    }

    // setTimeout(() => {
    //   setMessage("User registered successfully!");
    //   setName("");
    //   setCity("");
    //   setPassword("");
    //   setConfirmPass("");
    //   setDealerID(generateDealerID()); // Generate new ID for next user
    //   setLoading(false);
    // }, 1000);
    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96">
        <h2 className="text-xl font-semibold mb-4 text-center">User Registration</h2>

        {message && <p className="text-center text-red-600">{message}</p>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-medium">Username:</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full p-2 border rounded"
              placeholder="Enter your username"
            />
          </div>

          <div>
            <label className="block font-medium">Email:</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full p-2 border rounded"
              placeholder="Enter your email"
            />
          </div>

          <div>
            <label className="block font-medium">Phone:</label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
              className="w-full p-2 border rounded"
              placeholder="Enter your phone number"
            />
          </div>

          <div>
            <label className="block font-medium">City:</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="w-full p-2 border rounded"
              placeholder="Enter your city"
            />
          </div>

          <div>
            <label className="block font-medium">Dealer ID:</label>
            <input
              type="text"
              value={dealerId}
              readOnly
              className="w-full p-2 border rounded bg-gray-100"
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
              placeholder="Enter password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute inset-y-0 right-2 flex items-center"
            >
              {showPassword ? "🔓" : "🔒"}
            </button>
          </div>

          <div className="relative">
            <label className="block font-medium">Confirm Password:</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPass}
              onChange={(e) => setConfirmPass(e.target.value)}
              required
              className="w-full p-2 border rounded pr-10"
              placeholder="Confirm password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-2 flex items-center"
            >
              {showConfirmPassword ? "🔓" : "🔒"}
            </button>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-500"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default Register;
