import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { FaBook, FaUsers, FaMoneyBillWave } from "react-icons/fa";
import { motion } from "framer-motion";

export default function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();

  const user = location.state?.user;

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="flex flex-col items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl"
      >
        {/* <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center mb-8"
         >
          <motion.h1
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="text-3xl font-bold text-white mb-2"
          >
            Welcome to Dashboard
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="text-gray-300"
          >
            Choose an option to continue
          </motion.p>
        </motion.div> */}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-6"
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard/course", { state: { user } })}
            className="flex items-center space-x-3 bg-white p-6 rounded-lg shadow-lg hover:bg-green-200 transition duration-300 w-full sm:w-auto min-w-[200px]"
          >
            <FaBook size={28} className="text-green-600" />
            <span className="text-lg font-semibold">Course Details</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard/batch", { state: { user } })}
            className="flex items-center space-x-3 bg-white p-6 rounded-lg shadow-lg hover:bg-blue-200 transition duration-300 w-full sm:w-auto min-w-[200px]"
          >
            <FaUsers size={28} className="text-blue-600" />
            <span className="text-lg font-semibold">Batch Details</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/dashboard/feedetails", { state: { user } })}
            className="flex items-center space-x-3 bg-white p-6 rounded-lg shadow-lg hover:bg-yellow-200 transition duration-300 w-full sm:w-auto min-w-[200px]"
          >
            <FaMoneyBillWave size={28} className="text-yellow-600" />
            <span className="text-lg font-semibold">Fees Details</span>
          </motion.button>
        </motion.div>

        {/* Optional: User info display */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8 text-center"
        >
          <p className="text-gray-400 text-sm">
            Logged in as: <span className="text-white font-semibold">{user.username}</span>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
}