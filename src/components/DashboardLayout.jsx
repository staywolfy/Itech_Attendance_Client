import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaSignOutAlt } from "react-icons/fa";
import { motion } from "framer-motion";

export default function DashboardLayout() {
  const location = useLocation();
  const navigate = useNavigate();

  const user = location.state?.user;

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    localStorage.clear()
    navigate("/login");
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-blue-800 text-center shadow-lg"
      >
        <motion.h1 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-3xl font-bold mb-2 text-white"
        >
          Welcome, {user.name}!
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="text-lg text-blue-100"
        >
          Branch: <span className="font-semibold text-white">{user.branch}</span> | Course:{" "}
          <span className="font-semibold text-white">{user.course}</span>
        </motion.p>
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow p-6 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
        {/* Page-specific content renders here */}
        <Outlet />
      </main>

      {/* Footer Navigation */}
      <motion.footer 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex justify-around bg-blue-800 p-4 shadow-lg"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/dashboard", { state: { user } })}
          className="flex flex-col items-center text-blue-100 hover:text-white transition duration-300"
          aria-label="Home"
        >
          <FaHome size={24} />
          <span className="text-sm mt-1">Home</span>
        </motion.button>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogout}
          className="flex flex-col items-center text-blue-100 hover:text-white transition duration-300"
          aria-label="Logout"
        >
          <FaSignOutAlt size={24} />
          <span className="text-sm mt-1">Logout</span>
        </motion.button>
      </motion.footer>
    </div>
  );
}