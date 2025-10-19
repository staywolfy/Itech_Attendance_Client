import React from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaSignOutAlt, FaUser, FaArrowLeft } from "react-icons/fa";
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

  const handleProfile = () => {
    navigate("/profile", { state: { user } });
  }

  const handleBack = () => {
    navigate(-1);
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="p-6 bg-blue-800 text-center shadow-lg relative"
      >
        {/* Back Button - Top Left */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleBack}
          className="absolute left-4 top-1/2 transform -translate-y-1/2 flex items-center text-blue-100 hover:text-white transition duration-300 p-2 rounded-lg hover:bg-blue-700"
          aria-label="Go back"
        >
          <FaArrowLeft size={20} />
          <span className="ml-2 text-sm hidden sm:block">Back</span>
        </motion.button>

        {/* User Info */}
        <div className="mx-auto max-w-2xl">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-bold mb-4 text-white"
          >
            Welcome, {user.name}!
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-lg text-blue-100 space-y-2"
          >
            <div>
              Branch: <span className="font-semibold text-white">{user.branch}</span>
            </div>
            <div>
              Course: <span className="font-semibold text-white">{user.course}</span>
            </div>
          </motion.div>
        </div>

        {/* Profile Button - Top Right */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleProfile}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center text-blue-100 hover:text-white transition duration-300 p-2 rounded-lg hover:bg-blue-700"
          aria-label="Profile"
        >
          <FaUser size={20} />
          <span className="ml-2 text-sm hidden sm:block">Profile</span>
        </motion.button>
      </motion.header>

      {/* Main Content */}
      <main className="flex-grow p-6 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
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

        {/* <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleProfile}
          className="flex flex-col items-center text-blue-100 hover:text-white transition duration-300"
          aria-label="Profile"
        >
          <FaUser size={24} />
          <span className="text-sm mt-1">Profile</span>
        </motion.button> */}

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