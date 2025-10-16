import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { BASE_URL } from "../../config";
import { motion } from "framer-motion";

export default function Course() {
  const location = useLocation();
  const user = location.state?.user;
  const [selectedCourse, setSelectedCourse] = useState("");
  const [subjects, setSubjects] = useState({
    persuingSubjects: [],
    completedSubjects: [],
    pendingSubjects: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("Persuing");

  if (!user) return <p className="text-white text-center p-6">User data missing. Please login again.</p>;

  // Convert user.course to array if single value
  const courses = Array.isArray(user.course) ? user.course : [user.course];

  // Fetch subjects for selected course
  useEffect(() => {
    if (!selectedCourse) return;

    const fetchSubjects = async () => {
      setLoading(true);
      setError(null);

      try {
        const res = await fetch(
          `${BASE_URL}/api/courses/details?name_contactid=${user.name_contactid}&course=${encodeURIComponent(selectedCourse)}`
        );

        if (!res.ok) {
          const errorText = await res.text();
          console.error("Server response:", errorText);
          throw new Error(`Server error: ${res.status}`);
        }

        const data = await res.json();
        if (!data.success)
          throw new Error(data.message || "Error fetching data");

        setSubjects({
          persuingSubjects: data.data.persuingSubjects || [],
          completedSubjects: data.data.completedSubjects || [],
          pendingSubjects: data.data.pendingSubjects || [],
        });
      } catch (err) {
        setError(err.message);
        console.error("Fetch error:", err);
        setSubjects({
          persuingSubjects: [],
          completedSubjects: [],
          pendingSubjects: [],
        });
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [selectedCourse, user.name_contactid]);

  const renderSubjects = () => {
    let list = [];
    switch (activeTab) {
      case "Persuing":
        list = subjects.persuingSubjects;
        break;
      case "Completed":
        list = subjects.completedSubjects;
        break;
      case "Pending":
        list = subjects.pendingSubjects;
        break;
      default:
        list = [];
    }

    if (loading) return <p className="text-blue-200 text-center">Loading subjects...</p>;
    if (error) return <p className="text-red-400 text-center">Error: {error}</p>;

    if (!list || list.length === 0)
      return <p className="text-gray-300 text-center">No {activeTab.toLowerCase()} subjects found.</p>;

    return (
      <motion.ul 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-2 max-h-60 overflow-y-auto"
      >
        {list.map((s, i) => (
          <motion.li
            key={i}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-blue-800/50 text-white p-3 rounded-lg border border-blue-600/30 hover:bg-blue-700/50 transition duration-200"
          >
            {s.subjectname || s.subject}
          </motion.li>
        ))}
      </motion.ul>
    );
  };

  return (
    <div className="flex flex-col items-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-4xl mx-auto w-full"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold text-white mb-2">Course Details</h2>
          <p className="text-gray-300">Track your course progress and subjects</p>
        </motion.div>

        {/* Course Selection */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex justify-center mb-8"
        >
          <div className="w-full md:w-2/3 lg:w-1/2">
            <label htmlFor="course-select" className="block text-white text-sm font-semibold mb-2 text-center">
              Select Your Course
            </label>
            <select
              id="course-select"
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="w-full p-3 border border-blue-600 rounded-lg bg-blue-900/50 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition duration-200"
            >
              <option value="" className="bg-gray-800">-- Select a course --</option>
              {courses.map((course) => (
                <option key={course} value={course} className="bg-gray-800">
                  {course}
                </option>
              ))}
            </select>
          </div>
        </motion.div>

        {/* Tabs and Content */}
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
              {["Persuing", "Completed", "Pending"].map((tab) => (
                <motion.button
                  key={tab}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-3 rounded-lg font-semibold border transition duration-200 min-w-[100px] ${
                    activeTab === tab
                      ? "bg-blue-600 text-white border-blue-500 shadow-lg"
                      : "bg-blue-900/50 text-blue-200 border-blue-700 hover:bg-blue-800/70"
                  }`}
                >
                  {tab}
                </motion.button>
              ))}
            </motion.div>

            {/* Subjects List */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="w-full max-w-2xl mx-auto"
            >
              <h3 className="font-bold text-xl mb-4 text-center text-white">
                {activeTab} Subjects
                <span className="block text-sm font-normal text-gray-300 mt-1">
                  ({subjects[`${activeTab.toLowerCase()}Subjects`]?.length || 0} subjects)
                </span>
              </h3>
              <div className="min-h-[200px]">
                {renderSubjects()}
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
                <span className="text-white">Loading subjects...</span>
              </div>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}