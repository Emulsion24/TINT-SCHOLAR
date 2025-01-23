import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore.js"; // Assuming this is where your user data comes from
import {
  FileTextIcon, // Lucid icon equivalent of DocumentTextIcon
  AwardIcon, // Lucid icon equivalent of TrophyIcon
  CalendarIcon, // No change needed, Lucid has similar CalendarIcon
  GraduationCapIcon, // Lucid icon equivalent of AcademicCapIcon
} from "lucide-react"; // Importing icons from Lucid

const HomeSectionteacher = () => {
  const { teacher, fetchTeacherData } = useAuthStore(); // Assuming `fetchTeacherData` triggers fetching the teacher
  const [data, setData] = useState({
    published: 0,
    achievements: 0,
    events: 0,
    workshops: 0,
  });
  const [loading, setLoading] = useState(true); // Loading state

  // Simulate fetching data, replace with actual API or state management
  useEffect(() => {
    const initialize = async () => {
      if (!teacher) {
        await fetchTeacherData(); // Fetch teacher data if not already fetched
      }
      setLoading(false); // Stop loading once data is ready
    };

    initialize();
  }, [teacher, fetchTeacherData]);

  // Simulate fetching dashboard stats for the teacher
  useEffect(() => {
    if (teacher) {
      // Replace this with API calls or logic to fetch real data
      setData({
        published: 10,
        achievements: 5,
        events: 3,
        workshops: 2,
      });
    }
  }, [teacher]);

  // Display loading indicator if teacher data is not ready
  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center h-full"
      >
        <h3 className="text-2xl font-semibold text-gray-500">
          Loading your data...
        </h3>
      </motion.div>
    );
  }

  // Handle undefined teacher gracefully
  if (!teacher) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="flex items-center justify-center h-full"
      >
        <h3 className="text-2xl font-semibold text-red-500">
          No teacher data available. Please log in.
        </h3>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h3 className="text-2xl font-semibold text-green-400 mb-4">
        Welcome, {teacher.name}!
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {/* Total Published */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex items-center space-x-4">
          <FileTextIcon className="w-12 h-12 text-green-500" />
          <div>
            <h4 className="text-xl font-semibold text-gray-700">
              Total Published
            </h4>
            <p className="text-3xl font-bold text-green-500">{data.published}</p>
          </div>
        </div>

        {/* Total Achievements */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex items-center space-x-4">
          <AwardIcon className="w-12 h-12 text-yellow-500" />
          <div>
            <h4 className="text-xl font-semibold text-gray-700">
              Total Achievements
            </h4>
            <p className="text-3xl font-bold text-yellow-500">
              {data.achievements}
            </p>
          </div>
        </div>

        {/* Total Events */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex items-center space-x-4">
          <CalendarIcon className="w-12 h-12 text-blue-500" />
          <div>
            <h4 className="text-xl font-semibold text-gray-700">Total Events</h4>
            <p className="text-3xl font-bold text-blue-500">{data.events}</p>
          </div>
        </div>

        {/* Total Workshops */}
        <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition duration-200 flex items-center space-x-4">
          <GraduationCapIcon className="w-12 h-12 text-purple-500" />
          <div>
            <h4 className="text-xl font-semibold text-gray-700">
              Total Workshops
            </h4>
            <p className="text-3xl font-bold text-purple-500">
              {data.workshops}
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default HomeSectionteacher;
