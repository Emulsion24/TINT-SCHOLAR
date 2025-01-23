import React, { useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";
import { User, BookOpen, LogOut, FileText, PlusIcon } from "lucide-react";
import { useAuthStore } from "../store/authStore.js";
import AddTeacher from "./AddTeacher.jsx";

const Adminstuden = () => {
  const deleteStudnet = useAuthStore((state) => state.deleteStudnet);
  const [activeSection, setActiveSection] = useState("students");
  const [search, setSearch] = useState("");
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false); // Loading state for delete
  const [successPopup, setSuccessPopup] = useState(false); // Success popup state

  const {
    users: allUsers,
    fetchUsers,
    logout,
    fetchTeachers,
    teachers: allTeachers,
  } = useAuthStore();

  useEffect(() => {
    fetchUsers();
    fetchTeachers();
  }, [fetchUsers, fetchTeachers]);

  const students = allUsers;
  const teachers = allTeachers;

  const filteredUsers = useMemo(() => {
    const lowercasedSearch = search.toLowerCase();
    if (activeSection === "students") {
      return students.filter(
        (student) =>
          student.name.toLowerCase().includes(lowercasedSearch) ||
          student.rollnumber.toLowerCase().includes(lowercasedSearch)
      );
    }
    if (activeSection === "teachers") {
      return teachers.filter(
        (teacher) =>
          teacher.name.toLowerCase().includes(lowercasedSearch) ||
          teacher.email.toLowerCase().includes(lowercasedSearch)
      );
    }
    return [];
  }, [search, activeSection, students, teachers]);

  const handleLogout = () => {
    logout();
  };

  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsPopupOpen(true);
  };

  const closePopup = () => {
    setIsPopupOpen(false);
    setSelectedUser(null);
  };

  const closeSuccessPopup = () => {
    setSuccessPopup(false);
  };

  const handleGenerateReport = () => {
    console.log(`Generating report for ${selectedUser.name}`);
  };

  const handleEditDetails = () => {
    console.log(`Editing details for ${selectedUser.name}`);
  };

  const handleDeleteUser = async () => {
    try {
      setIsDeleting(true); // Set loading state
      await deleteStudnet(selectedUser._id); // Call delete function
      setIsDeleting(false); // Clear loading state
      setIsPopupOpen(false); // Close the popup
      setSuccessPopup(true); // Show success popup
      fetchUsers(); // Refresh the users on the frontend
    } catch (error) {
      console.error("Error deleting user:", error);
      setIsDeleting(false); // Clear loading state on error
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950 text-white">
      {/* Sidebar */}
      <aside className="w-1/5 h-screen shadow-lg flex flex-col">
        <div className="p-5">
          <h2 className="text-3xl font-bold mb-8 text-center">Dashboard</h2>
          <nav className="space-y-4">
            <button
              onClick={() => setActiveSection("students")}
              className={`flex items-center gap-3 w-full p-4 rounded-lg text-lg font-semibold ${
                activeSection === "students"
                  ? "bg-green-600 text-white"
                  : "hover:bg-gray-800"
              }`}
            >
              <User className="w-6 h-6" />
              Students
            </button>
            <button
              onClick={() => setActiveSection("teachers")}
              className={`flex items-center gap-3 w-full p-4 rounded-lg text-lg font-semibold ${
                activeSection === "teachers"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800"
              }`}
            >
              <BookOpen className="w-6 h-6" />
              Teachers
            </button>
            <button
              onClick={() => setActiveSection("Addteacher")}
              className={`flex items-center gap-3 w-full p-4 rounded-lg text-lg font-semibold ${
                activeSection === "Addteacher"
                  ? "bg-blue-600 text-white"
                  : "hover:bg-gray-800"
              }`}
            >
              <PlusIcon className="w-6 h-6" />
              Add Teachers
            </button>
          </nav>
        </div>
        <button
          onClick={handleLogout}
          className="m-5 flex items-center justify-center gap-2 p-4 bg-red-600 rounded-lg hover:bg-red-700 text-lg font-semibold"
        >
          <LogOut className="w-6 h-6" />
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main className="flex-1 h-full overflow-hidden p-10">
        <div className="mb-5">
          <input
            type="text"
            placeholder={`Search ${
              activeSection === "students" ? "Students" : "Teachers"
            }...`}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-gray-800 text-white p-4 rounded-lg text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>

        {activeSection === "students" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-bold p-8 rounded-xl shadow-xl h-full overflow-auto"
          >
            <h2 className="text-3xl font-bold mb-5">Students</h2>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-800 text-gray-300">
                  <th className="p-4">Name</th>
                  <th className="p-4">Roll</th>
                  <th className="p-4">Stream</th>
                  <th className="p-4">Year</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((student, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-700 border-b border-gray-700 cursor-pointer"
                      onClick={() => handleUserClick(student)}
                    >
                      <td className="p-4">{student.name}</td>
                      <td className="p-4">{student.rollnumber}</td>
                      <td className="p-4">{student.branch}</td>
                      <td className="p-4">{student.year}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="p-4 text-center text-gray-400">
                      No Students Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        )}

        {activeSection === "teachers" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-8 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-bold rounded-xl shadow-xl h-full overflow-auto"
          >
            <h2 className="text-3xl font-bold mb-5">Teachers</h2>
            <table className="w-full text-left">
              <thead>
                <tr className="bg-gray-800 text-gray-300">
                  <th className="p-4">Name</th>
                  <th className="p-4">Email</th>
                  <th className="p-4">Department</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.length > 0 ? (
                  filteredUsers.map((teacher, index) => (
                    <tr
                      key={index}
                      className="hover:bg-gray-700 border-b border-gray-700 cursor-pointer"
                      onClick={() => handleUserClick(teacher)}
                    >
                      <td className="p-4">{teacher.name}</td>
                      <td className="p-4">{teacher.email}</td>
                      <td className="p-4">{teacher.department}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="3" className="p-4 text-center text-gray-400">
                      No Teachers Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </motion.div>
        )}

        {activeSection === "Addteacher" && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="h-full"
          >
            <AddTeacher />
          </motion.div>
        )}
      </main>

      {/* Popup */}
      {isPopupOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-white text-black rounded-lg shadow-lg w-96 p-6"
          >
            <h3 className="text-xl font-bold mb-4">{selectedUser.name}</h3>
            <button
              onClick={handleGenerateReport}
              className="block w-full p-3 bg-blue-500 text-white rounded-lg mb-3 hover:bg-blue-600"
            >
              Generate Report
            </button>
            <button
              onClick={handleEditDetails}
              className="block w-full p-3 bg-green-500 text-white rounded-lg mb-3 hover:bg-green-600"
            >
              Edit Details
            </button>
            <button
              onClick={handleDeleteUser}
              disabled={isDeleting} // Disable button while deleting
              className={`block w-full p-3 rounded-lg mb-3 ${
                isDeleting
                  ? "bg-gray-400 text-gray-700 cursor-not-allowed"
                  : "bg-red-500 text-white hover:bg-red-600"
              }`}
            >
              {isDeleting ? "Deleting..." : "Delete User"}
            </button>
            <button
              onClick={closePopup}
              className="block w-full p-3 bg-gray-300 text-black rounded-lg hover:bg-gray-400"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}

      {/* Success Popup */}
      {successPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            className="bg-green-500 text-white rounded-lg shadow-lg w-96 p-6"
          >
            <h3 className="text-xl font-bold mb-4">User Deleted Successfully!</h3>
            <button
              onClick={closeSuccessPopup}
              className="block w-full p-3 bg-white text-black rounded-lg hover:bg-gray-200"
            >
              Close
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Adminstuden;
