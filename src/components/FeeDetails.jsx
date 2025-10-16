import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  FaArrowLeft,
  FaRupeeSign,
  FaReceipt,
  FaUser,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { BASE_URL } from "../../config";

export default function FeeDetails() {
  const location = useLocation();
  const navigate = useNavigate();
  const user = location.state?.user;

  const [paymentData, setPaymentData] = useState([]);
  const [processedPaymentData, setProcessedPaymentData] = useState([]);
  const [summary, setSummary] = useState({
    totalAmount: 0,
    totalPaid: 0,
    totalDue: 0,
    totalPayments: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchPaymentDetails();
  }, [user, navigate]);

  const fetchPaymentDetails = async () => {
    try {
      setLoading(true);
      setError(null);

      const params = new URLSearchParams();
      if (user.name_contactid) params.append("name", user.name_contactid);
      if (user.contact) params.append("contactId", user.contact);

      const response = await fetch(`${BASE_URL}/api/feedetails?${params.toString()}`);
      const result = await response.json();

      if (result.success) {
        const payments = result.data.payments || [];
        
        // Process payments to calculate correct running balance (oldest first for calculation)
        const processedPayments = calculateRunningBalance(payments);
        
        // Sort processed payments by date descending (newest first) for display
        const sortedProcessedPayments = [...processedPayments].sort((a, b) => 
          new Date(b.Dates) - new Date(a.Dates)
        );
        
        const totalPaid = payments.reduce((sum, p) => sum + parseFloat(p.Paid || 0), 0);
        const courseFees = payments[0]?.courseFees || 0;
        const totalAmount = courseFees;
        const totalDue = Math.max(totalAmount - totalPaid, 0);

        setPaymentData(payments);
        setProcessedPaymentData(sortedProcessedPayments);
        setSummary({
          totalAmount,
          totalPaid,
          totalDue,
          totalPayments: payments.length,
        });
      } else {
        setError(result.message || "Failed to fetch payment details");
      }
    } catch (err) {
      console.error("Error fetching payment details:", err);
      setError("Network error: Unable to fetch payment details");
    } finally {
      setLoading(false);
    }
  };

  // Function to calculate correct running balance
  const calculateRunningBalance = (payments) => {
    if (!payments.length) return [];
    
    // Sort payments by date (oldest first) for correct balance calculation
    const sortedPayments = [...payments].sort((a, b) => new Date(a.Dates) - new Date(b.Dates));
    
    const totalAmount = parseFloat(sortedPayments[0]?.courseFees || 0);
    let runningBalance = totalAmount;
    
    return sortedPayments.map((payment, index) => {
      const paidAmount = parseFloat(payment.Paid || 0);
      
      // Calculate running balance
      runningBalance = runningBalance - paidAmount;
      
      return {
        ...payment,
        calculatedBalance: Math.max(runningBalance, 0), // Ensure no negative balance
        runningBalance: runningBalance
      };
    });
  };

  if (!user) return null;

  const formatCurrency = (amt) =>
    parseFloat(amt || 0).toLocaleString("en-IN", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });

  const formatDate = (d) =>
    d ? new Date(d).toLocaleDateString("en-IN") : "N/A";

  const getStatusText = (p) => {
    const balance = p.calculatedBalance || parseFloat(p.Balance || 0);
    const paid = parseFloat(p.Paid || 0);
    const totalAmount = parseFloat(p.courseFees || 0);
    
    if (balance === 0 && paid > 0) return "Paid";
    if (paid === 0 && balance === totalAmount) return "Pending";
    if (paid > 0 && balance > 0) return "Partial";
    return "Unknown";
  };

  const getStatusColor = (p) => {
    const balance = p.calculatedBalance || parseFloat(p.Balance || 0);
    const paid = parseFloat(p.Paid || 0);
    const totalAmount = parseFloat(p.courseFees || 0);
    
    if (balance === 0 && paid > 0) return "bg-green-500/30 text-green-300";
    if (paid === 0 && balance === totalAmount) return "bg-red-500/30 text-red-300";
    if (paid > 0 && balance > 0) return "bg-yellow-500/30 text-yellow-300";
    return "bg-gray-500/30 text-gray-300";
  };

  // Use the LATEST calculated balance for total balance (first item in the sorted array)
  const totalBalance = processedPaymentData.length > 0 
    ? processedPaymentData[0]?.calculatedBalance  // First item is the latest payment
    : 0;

  return (
    <div className="flex flex-col items-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto w-full"
      >
        {/* Header */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4"
        >
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/dashboard", { state: { user } })}
              className="flex items-center gap-2 text-blue-300 hover:text-white px-4 py-2 rounded-lg border border-blue-600 hover:bg-blue-700/40 transition duration-200"
            >
              <FaArrowLeft />
              <span>Back</span>
            </button>
            <h1 className="text-3xl font-bold text-white">Fee Details</h1>
          </div>
          <button
            onClick={fetchPaymentDetails}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
          >
            Refresh
          </button>
        </motion.div>

        {/* Student Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="bg-blue-800/20 backdrop-blur-sm border border-blue-600/30 rounded-xl p-6 text-white mb-8"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Student Name */}
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-700/40 rounded-full">
                <FaUser className="text-blue-300" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Student Name</p>
                <p className="text-lg font-semibold">{user.name || "N/A"}</p>
              </div>
            </div>

            {/* Course Name */}
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-700/40 rounded-full">
                <FaReceipt className="text-green-300" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Course Name</p>
                <p className="text-lg font-semibold">
                  {paymentData[0]?.course || "N/A"}
                </p>
              </div>
            </div>

            {/* Course Fees */}
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-700/40 rounded-full">
                <FaRupeeSign className="text-purple-300" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Course Fees</p>
                <p className="text-lg font-semibold text-purple-300">
                  ₹{formatCurrency(paymentData[0]?.courseFees || 0)}
                </p>
              </div>
            </div>

            {/* Total Balance - Now shows latest balance (₹44,900.00) */}
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-red-700/40 rounded-full">
                <FaRupeeSign className="text-red-300" />
              </div>
              <div>
                <p className="text-sm text-gray-300">Total Balance</p>
                <p className="text-lg font-semibold text-red-400">
                  ₹{formatCurrency(totalBalance)}
                </p>
                {processedPaymentData.length > 0 && (
                  <p className="text-xs text-gray-400">
                    As of {formatDate(processedPaymentData[0]?.Dates)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </motion.div>

        {/* Error */}
        {error && (
          <div className="bg-red-800/40 border border-red-600/40 text-red-200 px-4 py-3 rounded mb-6 text-center">
            {error}
          </div>
        )}

        {/* Payment Table */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="bg-blue-800/20 border border-blue-600/30 backdrop-blur-sm rounded-xl overflow-hidden"
        >
          <div className="px-6 py-4 border-b border-blue-600/30">
            <h2 className="text-xl font-semibold text-white flex items-center">
              <FaReceipt className="mr-2 text-blue-300" />
              Payment History (Newest First)
            </h2>
          </div>

          {loading ? (
            <div className="p-8 text-center text-gray-300">
              <div className="w-10 h-10 border-4 border-blue-400 border-t-transparent rounded-full animate-spin mx-auto"></div>
              <p className="mt-4">Loading payment details...</p>
            </div>
          ) : processedPaymentData.length === 0 ? (
            <div className="p-8 text-center text-gray-300">
              No payment records found.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-white">
                <thead className="bg-blue-900/40">
                  <tr>
                    {[
                      "Receipt No",
                      "Course",
                      "Total Amount",
                      "Paid",
                      "Due",
                      "Date",
                      "Status",
                    ].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left font-semibold text-blue-300 uppercase tracking-wider"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {processedPaymentData.map((p, i) => (
                    <motion.tr
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="border-t border-blue-600/20 hover:bg-blue-700/30 transition"
                    >
                      <td className="px-6 py-3">{p.Receipt || "N/A"}</td>
                      <td className="px-6 py-3">{p.course || "N/A"}</td>
                      <td className="px-6 py-3 text-blue-300">
                        ₹{formatCurrency(p.courseFees)}
                      </td>
                      <td className="px-6 py-3 text-green-300">
                        ₹{formatCurrency(p.Paid)}
                      </td>
                      <td className="px-6 py-3 text-red-300">
                        ₹{formatCurrency(p.calculatedBalance)}
                      </td>
                      <td className="px-6 py-3">
                        <div className="flex flex-col">
                          <span>{formatDate(p.Dates)}</span>
                          {i === 0 && (
                            <span className="text-xs text-green-400 font-medium">
                              (Latest)
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-3">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            p
                          )}`}
                        >
                          {getStatusText(p)}
                        </span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </motion.div>

        {/* Summary */}
        {!loading && processedPaymentData.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8"
          >
            <div className="bg-green-700/30 p-6 rounded-lg border border-green-500/40 text-white text-center">
              <h3 className="text-lg font-semibold text-green-300 mb-2">
                Total Paid
              </h3>
              <p className="text-2xl font-bold flex justify-center items-center text-green-200">
                <FaRupeeSign className="mr-1" />
                {formatCurrency(summary.totalPaid)}
              </p>
            </div>
            <div className="bg-red-700/30 p-6 rounded-lg border border-red-500/40 text-white text-center">
              <h3 className="text-lg font-semibold text-red-300 mb-2">
                Total Due
              </h3>
              <p className="text-2xl font-bold flex justify-center items-center text-red-200">
                <FaRupeeSign className="mr-1" />
                {formatCurrency(summary.totalDue)}
              </p>
            </div>
            <div className="bg-blue-700/30 p-6 rounded-lg border border-blue-500/40 text-white text-center">
              <h3 className="text-lg font-semibold text-blue-300 mb-2">
                Total Amount
              </h3>
              <p className="text-2xl font-bold flex justify-center items-center text-blue-200">
                <FaRupeeSign className="mr-1" />
                {formatCurrency(summary.totalAmount)}
              </p>
            </div>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}