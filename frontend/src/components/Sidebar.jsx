import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 bg-blue-900 text-white h-full p-6">
      <h2 className="text-xl font-bold mb-6">Admin Panel</h2>
      <ul>
        <li className="mb-4">
          <Link to="/admin" className="hover:text-gray-300">Dashboard</Link>
        </li>
        <li className="mb-4">
          <Link to="/admin/manage-users" className="hover:text-gray-300">Manage Users</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
