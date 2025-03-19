// import  { useEffect, useState } from "react";
// import { useNavigate } from "react-router-dom";
// import axios from "axios";
// import Layout from "../components/Layout";
// const HomePage = () => {
//   // const [user, setUser] = useState(null);
//   // const [loading, setLoading] = useState(true);
//   // const [error, setError] = useState("");

//   // const navigate = useNavigate();

//   // useEffect(() => {
//   //   const fetchUserData = async () => {
//   //     try {
//   //       const token = localStorage.getItem("token");
//   //      // console.log(token);
        
//   //       if (!token) {
//   //         navigate("/login");
//   //         return;
//   //       }

//   //       // Decode token to get user ID
//   //       const decodedToken = JSON.parse(atob(token.split(".")[1]));
//   //       const userId = decodedToken.id;
//   //       //  console.log(userId);
         
//   //       const response = await axios.get(`/api/v1/users/${userId}`, {
//   //         headers: {
//   //           Authorization: `Bearer ${token}`,
//   //         },
//   //       });
//   //       console.log("User data received:", response.data);

//   //       setUser(response.data);
//   //     } catch (error) {
//   //       setError("Failed to load user data");
//   //       console.error(error);
//   //     } finally {
//   //       setLoading(false);
//   //     }
//   //   };

//   //   fetchUserData();
//   // }, [navigate]);

//   // if (loading) {
//   //   return <p className="text-center text-lg">Loading...</p>;
//   // }

//   // if (error) {
//   //   return <p className="text-center text-red-600">{error}</p>;
//   // }

//   return (
//     // <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
//     //   <div className="bg-white p-6 rounded-lg shadow-md w-96">
//     //     <h2 className="text-xl font-semibold mb-4 text-center">Welcome, {user.username}!</h2>
//     //     <p className="text-gray-700"><strong>Dealer ID:</strong> {user.dealerId}</p>
//     //     <p className="text-gray-700"><strong>Email:</strong> {user.email}</p>
//     //     <p className="text-gray-700"><strong>Phone:</strong> {user.phone}</p>
//     //     <p className="text-gray-700"><strong>City:</strong> {user.city}</p>

//     //     <button
//     //       onClick={() => {
//     //         localStorage.removeItem("token");
//     //         navigate("/login");
//     //       }}
//     //       className="mt-4 w-full bg-red-600 text-white py-2 rounded hover:bg-red-500"
//     //     >
//     //       Logout
//     //     </button>
//     //   </div>
//     // </div>
//           <Layout></Layout>
//   );
// };

// export default HomePage;

import React from 'react';
import Layout from '../components/Layout';

const Homepage = () => {
  return (
    <>
    <Layout>
    </Layout>  
    </>
  );
};

export default Homepage;