import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import Attendance from "./Attendance";
import { BASE_URL } from "../../config";
import { motion } from "framer-motion";

export default function Batch() {
  const location = useLocation();
  const user = location.state?.user;

  const [selectedCourse, setSelectedCourse] = useState("");
  const [batches, setBatches] = useState({ persuing: [], completed: [], pending: [] });
  const [activeTab, setActiveTab] = useState("Persuing");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [attendance, setAttendance] = useState([]);
  const [showAttendanceModal, setShowAttendanceModal] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState(null);

  if (!user) return <p className="text-white text-center p-6">User data missing. Please login again.</p>;
  const courses = Array.isArray(user.course) ? user.course : [user.course];

  useEffect(() => {
    if (!selectedCourse) return;

    const fetchBatches = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(
          `${BASE_URL}/api/batch/details?id=${user.name_contactid}&course=${encodeURIComponent(selectedCourse)}`
        );
        if (!res.ok) throw new Error("Failed to fetch batches");
        const data = await res.json();
        if (!data.success) throw new Error(data.message || "No batches found");
        setBatches({
          persuing: data.data.persuing || [],
          completed: data.data.completed || [],
          pending: data.data.pending || [],
        });
      } catch (err) {
        console.error(err);
        setError(err.message);
        setBatches({ persuing: [], completed: [], pending: [] });
      } finally {
        setLoading(false);
      }
    };
    fetchBatches();
  }, [selectedCourse, user.name_contactid]);

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    if (dateString.includes("-")) {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-IN", { day: "2-digit", month: "2-digit", year: "numeric" });
    }
    return dateString;
  };

  const getFacultyName = (facultyid) => (facultyid ? facultyid.split("@")[0] : "N/A");

  const fetchAttendance = async (batch) => {
    try {
      setSelectedBatch(batch);
      setAttendance([]);
      setShowAttendanceModal(true);

      const res = await fetch(
        `${BASE_URL}/api/attendance/details?name_contactid=${user.name_contactid}&course=${encodeURIComponent(selectedCourse)}&batch=${encodeURIComponent(batch.batchno || batch.batchname)}`
      );

      if (!res.ok) throw new Error("Failed to fetch attendance");
      const data = await res.json();
      if (!data.success) throw new Error(data.message || "No attendance found");
      setAttendance(data.data);
    } catch (err) {
      console.error(err);
      setAttendance([]);
    }
  };

  const renderBatchTable = () => {
    const list = activeTab === "Persuing" ? batches.persuing : activeTab === "Completed" ? batches.completed : batches.pending;
    if (loading) return <p className="text-blue-200 text-center py-4">Loading batches...</p>;
    if (error) return <p className="text-red-400 text-center py-4">Error: {error}</p>;
    if (!list.length) return <p className="text-gray-300 text-center py-4">No {activeTab.toLowerCase()} batches found.</p>;

    return (
      <div className="overflow-x-auto rounded-lg border border-blue-600/30">
        <table className="min-w-full bg-blue-900/20 backdrop-blur-sm">
          <thead className="bg-blue-800/50">
            <tr>
              <th className="px-3 py-3 border-b border-blue-600/30 text-white text-sm font-semibold text-left">Subject</th>
              <th className="px-3 py-3 border-b border-blue-600/30 text-white text-sm font-semibold text-left">Batch Name</th>
              <th className="px-3 py-3 border-b border-blue-600/30 text-white text-sm font-semibold text-left hidden md:table-cell">Faculty</th>
              <th className="px-3 py-3 border-b border-blue-600/30 text-white text-sm font-semibold text-left hidden lg:table-cell">Start Date</th>
              <th className="px-3 py-3 border-b border-blue-600/30 text-white text-sm font-semibold text-left hidden lg:table-cell">End Date</th>
              <th className="px-3 py-3 border-b border-blue-600/30 text-white text-sm font-semibold text-left">Batch Time</th>
              <th className="px-3 py-3 border-b border-blue-600/30 text-white text-sm font-semibold text-left">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-600/20">
            {list.map((batch, idx) => (
              <tr key={idx} className="hover:bg-blue-800/30 transition duration-200">
                <td className="px-3 py-3 text-white text-sm">{batch.subject || "N/A"}</td>
                <td className="px-3 py-3 text-white text-sm">{batch.batchno || batch.batchname || "N/A"}</td>
                <td className="px-3 py-3 text-blue-200 text-sm hidden md:table-cell">{getFacultyName(batch.facultyid || batch.faculty)}</td>
                <td className="px-3 py-3 text-blue-200 text-sm hidden lg:table-cell">{formatDate(batch.startdate || batch.date)}</td>
                <td className="px-3 py-3 text-blue-200 text-sm hidden lg:table-cell">{formatDate(batch.ExceptedEnddate || batch.endate)}</td>
                <td className="px-3 py-3 text-blue-200 text-sm">{batch.batch_time || "N/A"}</td>
                <td className="px-3 py-3">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      fetchAttendance(batch);
                    }}
                    className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm transition duration-200"
                  >
                    View Attendance
                  </motion.button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  const renderPendingList = () => {
    if (loading) return <p className="text-blue-200 text-center py-4">Loading pending batches...</p>;
    if (error) return <p className="text-red-400 text-center py-4">Error: {error}</p>;
    if (!batches.pending.length) return <p className="text-gray-300 text-center py-4">No pending batches found.</p>;

    return (
      <div className="overflow-x-auto rounded-lg border border-blue-600/30">
        <table className="min-w-full bg-blue-900/20 backdrop-blur-sm">
          <thead className="bg-blue-800/50">
            <tr>
              <th className="px-4 py-3 border-b border-blue-600/30 text-white text-sm font-semibold text-left">Subject Name</th>
              <th className="px-4 py-3 border-b border-blue-600/30 text-white text-sm font-semibold text-left">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-blue-600/20">
            {batches.pending.map((subject, idx) => (
              <tr key={idx} className="hover:bg-blue-800/30 transition duration-200">
                <td className="px-4 py-3 text-white">{subject.subjectname || subject.subject || "N/A"}</td>
                <td className="px-4 py-3">
                  <span className="px-3 py-1 bg-yellow-500/20 text-yellow-300 rounded-full text-xs font-medium border border-yellow-500/30">
                    Pending
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-6xl mx-auto w-full"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Batch Details</h2>
          <p className="text-gray-300">Track your batch progress and attendance</p>
        </motion.div>

        {/* Course Selection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <div className="w-full md:w-2/3 lg:w-1/2">
            <label htmlFor="course" className="block text-white text-sm font-semibold mb-2 text-center">
              Select Your Course
            </label>
            <select
              id="course"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-3 border border-blue-600 rounded-lg bg-blue-900/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
              <option value="" className="bg-gray-800">-- Select a course --</option>
              {courses.filter(course => course).map((course, idx) => (
                <option key={idx} value={course} className="bg-gray-800">{course}</option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Main Content */}
        {selectedCourse && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="bg-blue-800/20 backdrop-blur-sm rounded-xl p-6 border border-blue-600/30"
          >
            {/* Course Info */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center mb-6"
            >
              <h3 className="text-xl font-semibold text-white mb-2">
                Currently Viewing: <span className="text-blue-300">{selectedCourse}</span>
              </h3>
            </motion.div>

            {/* Tabs */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex flex-wrap gap-2 mb-6 justify-center"
            >
              {["Persuing", "Completed", "Pending"].map(tab => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 rounded-lg font-semibold border transition duration-200 min-w-[120px] ${
                    activeTab === tab 
                      ? "bg-blue-600 text-white border-blue-500 shadow-lg" 
                      : "bg-blue-900/50 text-blue-200 border-blue-700 hover:bg-blue-800/70"
                  }`}
                >
                  {tab}
                </motion.button>
              ))}
            </motion.div>

            {/* Batch Content */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
            >
              <h3 className="font-bold text-xl mb-4 text-center text-white">
                {activeTab} Batches
                <span className="block text-sm font-normal text-gray-300 mt-1">
                  ({batches[activeTab.toLowerCase()]?.length || 0} batches)
                </span>
              </h3>
              <div className="min-h-[200px]">
                {activeTab === "Pending" ? renderPendingList() : renderBatchTable()}
              </div>
            </motion.div>
          </motion.div>
        )}

        {/* Loading Overlay */}
        {loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 bg-black/50 flex items-center justify-center backdrop-blur-sm z-50"
          >
            <div className="bg-blue-900 p-6 rounded-lg shadow-xl border border-blue-600">
              <div className="flex items-center space-x-3">
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-6 h-6 border-2 border-blue-300 border-t-transparent rounded-full"
                />
                <span className="text-white">Loading batches...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Attendance Modal */}
        {showAttendanceModal && selectedBatch && (
          <Attendance
            attendance={attendance}
            selectedBatch={selectedBatch}
            formatDate={formatDate}
            onClose={() => setShowAttendanceModal(false)}
          />
        )}
      </motion.div>
    </div>
  );
}