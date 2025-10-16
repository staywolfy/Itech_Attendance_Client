import React from "react";
import { motion } from "framer-motion";

export default function Attendance({ attendance, selectedBatch, formatDate, onClose }) {
  if (!selectedBatch) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-4 backdrop-blur-sm"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden border border-blue-600/30 shadow-2xl"
      >
        {/* Header */}
        <div className="bg-blue-800/50 p-6 border-b border-blue-600/30">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              {/* Subject Name - Big and Bold */}
              <motion.h2
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-3xl font-bold text-white mb-2"
              >
                {selectedBatch.subject || "N/A"}
              </motion.h2>
              
              {/* Batch Number */}
              <motion.h3
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="text-xl font-semibold text-blue-300"
              >
                Batch: {selectedBatch.batchno || selectedBatch.batchname || "N/A"}
              </motion.h3>
            </div>
            
            {/* Close Button */}
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="text-gray-300 hover:text-white text-2xl font-bold transition duration-200 ml-4"
              onClick={onClose}
            >
              ✖
            </motion.button>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[60vh] overflow-y-auto">
          {attendance.length ? (
            <div className="overflow-x-auto rounded-lg border border-blue-600/30">
              <table className="min-w-full bg-blue-900/20 backdrop-blur-sm">
                <thead className="bg-blue-800/50">
                  <tr>
                    <th className="px-4 py-3 border-b border-blue-600/30 text-white text-sm font-semibold text-left">
                      Date
                    </th>
                    <th className="px-4 py-3 border-b border-blue-600/30 text-white text-sm font-semibold text-left">
                      Status
                    </th>
                    <th className="px-4 py-3 border-b border-blue-600/30 text-white text-sm font-semibold text-left hidden md:table-cell">
                      Topic
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-blue-600/20">
                  {attendance.map((att, idx) => (
                    <motion.tr
                      key={idx}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="hover:bg-blue-800/30 transition duration-200"
                    >
                      <td className="px-4 py-3 text-white text-sm">
                        {formatDate(att.date)}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            att.attendence?.toLowerCase() === "present"
                              ? "bg-green-500/20 text-green-300 border-green-500/30"
                              : att.attendence?.toLowerCase() === "absent"
                              ? "bg-red-500/20 text-red-300 border-red-500/30"
                              : "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
                          }`}
                        >
                          {att.attendence || "Unknown"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-blue-200 text-sm hidden md:table-cell">
                        {att.topic || "-"}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12"
            >
              <div className="text-gray-400 text-6xl mb-4">📊</div>
              <h4 className="text-xl font-semibold text-white mb-2">No Attendance Records</h4>
              <p className="text-gray-300">No attendance records found for this batch.</p>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-blue-800/30 p-4 border-t border-blue-600/30">
          <div className="flex justify-between items-center text-sm">
            <span className="text-blue-200">
              Total Records: <span className="text-white font-semibold">{attendance.length}</span>
            </span>
            <div className="flex gap-4 text-blue-200">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                Present
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                Absent
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                Other
              </span>
            </div>
          </div>
        </div>

        {/* Mobile Topic View for rows */}
        {attendance.length > 0 && (
          <div className="md:hidden p-4 border-t border-blue-600/30">
            {attendance.map((att, idx) => (
              att.topic && (
                <div key={idx} className="bg-blue-800/30 p-3 rounded-lg mb-2">
                  <p className="text-blue-200 text-sm font-semibold">Topic:</p>
                  <p className="text-white">{att.topic}</p>
                </div>
              )
            ))}
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}