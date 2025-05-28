import React, { useState, useEffect, useMemo, Suspense } from "react";
import { motion } from "framer-motion";
import { debounce } from "lodash";
import { User, BookOpen, LogOut, PlusIcon } from "lucide-react";
import { useAuthStore } from "../store/authStore.js";
import AddTeacher from "./AddTeacher.jsx";
import AdminAllPublications from "./AdminAllPublications.jsx";
import AdminAllHackathons from "./AdminAllHackathons.jsx";
import PasswordChange from "./PasswordChange.jsx";

const AddStudent = React.lazy(() => import("./AddStudent.jsx"));
const AdminAllProjects = React.lazy(() => import("./AdminAllProjects"));
const AdminStudentDashboard = React.lazy(() => import("./AdminStudentDashboard.jsx"));
const AdminTeacherDashboard = React.lazy(() => import("./AdminTeacherDashboard.jsx"));

const PAGE_SIZE = 10;

const Adminstuden = () => {
  const {
    users: allUsers,
    teachers: allTeachers,
    fetchUsers,
    fetchTeachers,
    fetchProjects,
    fetchHackathon,
    logout,
    deleteStudnet,
    currentUser,
  } = useAuthStore();

  const [activeSection, setActiveSection] = useState("students");
  const [search, setSearch] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [successPopup, setSuccessPopup] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredList, setFilteredList] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchTeachers();
    fetchProjects();
  }, []);

  const debouncedSearch = useMemo(
    () =>
      debounce((query) => {
        const list = activeSection === "students" ? allUsers : allTeachers;
        const result = list.filter((item) => {
          const name = item?.name?.toLowerCase() || "";
          const identifier =
            activeSection === "students"
              ? item?.rollnumber?.toLowerCase() || ""
              : item?.email?.toLowerCase() || "";
          return name.includes(query) || identifier.includes(query);
        });
        setFilteredList(result);
        setCurrentPage(1);
      }, 300),
    [allUsers, allTeachers, activeSection]
  );

  useEffect(() => {
    debouncedSearch(search.toLowerCase());
  }, [search, allUsers, allTeachers, activeSection]);

  const paginatedUsers = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE;
    return filteredList.slice(start, start + PAGE_SIZE);
  }, [filteredList, currentPage]);

  const totalPages = Math.ceil(filteredList.length / PAGE_SIZE);

  // Open popup on user click instead of directly showing details
  const handleUserClick = (user) => {
    setSelectedUser(user);
    setIsPopupOpen(true);
  };

  const handleDeleteUser = async () => {
    try {
      setIsDeleting(true);
      await deleteStudnet(selectedUser._id);
      setIsPopupOpen(false);
      setSuccessPopup(true);
      fetchUsers();
    } catch (err) {
      console.error("Delete error:", err);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShowDetails = () => {
    if (selectedUser) {
      setActiveSection(activeSection === "students" ? "studentDetails" : "teacherDetails");
      setIsPopupOpen(false);
    }
  };

  const handleBackToAdminPanel = () => {
    setActiveSection("students");
  };

  const renderUserTable = (type) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={`p-8 rounded-xl shadow-xl h-full overflow-auto ${
        type === "students"
          ? "bg-gradient-to-r from-green-500 to-emerald-600"
          : "bg-gradient-to-r from-blue-600 to-cyan-600"
      } text-white font-bold`}
    >
      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder={`Search ${type === "students" ? "Students" : "Teachers"}...`}
        className="mb-6 w-full p-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-400"
      />
      <h2 className="text-3xl font-bold mb-5">{type === "students" ? "Students" : "Teachers"}</h2>
      <table className="w-full text-left">
        <thead className="bg-gray-800 text-gray-300">
          <tr>
            <th className="p-4">Name</th>
            <th className="p-4">{type === "students" ? "Roll No" : "Email"}</th>
            <th className="p-4">{type === "students" ? "Branch" : "Department"}</th>
            {type === "students" && <th className="p-4">Year</th>}
          </tr>
        </thead>
        <tbody>
          {paginatedUsers.length > 0 ? (
            paginatedUsers.map((user, idx) => (
              <tr
                key={idx}
                className="hover:bg-gray-700 border-b border-gray-700 cursor-pointer"
                onClick={() => handleUserClick(user)}
              >
                <td className="p-4">{user.name}</td>
                <td className="p-4">{type === "students" ? user.rollnumber : user.email}</td>
                <td className="p-4">{type === "students" ? user.branch : user.department}</td>
                {type === "students" && <td className="p-4">{user.year}</td>}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={type === "students" ? 4 : 3} className="p-4 text-center text-gray-300">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="flex justify-between mt-4">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
        >
          Prev
        </button>
        <span>
          Page {currentPage} of {totalPages}
        </span>
        <button
          disabled={currentPage === totalPages}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-4 py-2 bg-white text-black rounded hover:bg-gray-200"
        >
          Next
        </button>
      </div>
    </motion.div>
  );

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-950 text-white">
      <aside className="w-1/5 h-screen shadow-lg p-5 flex flex-col">
        <h2 className="text-3xl font-bold mb-8 text-center">Dashboard</h2>
        <nav className="space-y-4">
          {[{ key: "students", label: "Students", icon: User },
           { key: "teachers", label: "Teachers", icon: BookOpen }, 
           { key: "Addteacher", label: "Add Teachers", icon: PlusIcon }, 
           { key: "Addstudent", label: "Add Students", icon: PlusIcon }, 
           { key: "password", label: "Change Password", icon: BookOpen },
           { key: "hackathons", label: "All Hackathons", icon: BookOpen },
           { key: "allpublications", label: "All Publications", icon: BookOpen },
           { key: "projects", label: "All Projects", icon: BookOpen }].map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setActiveSection(key)} className={`flex items-center gap-3 w-full p-4 rounded-lg text-lg font-semibold ${activeSection === key ? "bg-blue-600" : "hover:bg-gray-800"}`}>
              <Icon className="w-6 h-6" />
              {label}
            </button>
          ))}
        </nav>
        <button onClick={logout} className="mt-auto flex items-center justify-center gap-2 p-4 bg-red-600 rounded-lg hover:bg-red-700 text-lg font-semibold">
          <LogOut className="w-6 h-6" />
          Logout
        </button>
      </aside>

      <main className="flex-1 h-full overflow-hidden p-10">
        <Suspense fallback={<div>Loading...</div>}>
          {activeSection === "students" && renderUserTable("students")}
          {activeSection === "teachers" && renderUserTable("teachers")}
          {activeSection === "Addteacher" && <AddTeacher />}
          {activeSection === "Addstudent" && <AddStudent />}
          {activeSection === "password" && <PasswordChange />}
          {activeSection === "projects" && <AdminAllProjects />}
          {activeSection === "allpublications" && <AdminAllPublications />}
          {activeSection === "hackathons" && <AdminAllHackathons />}
          {activeSection === "studentDetails" && (
            <AdminStudentDashboard user={selectedUser} onBack={() => setActiveSection("students")} />
          )}
          {activeSection === "teacherDetails" && (
            <AdminTeacherDashboard user={selectedUser} onBack={() => setActiveSection("teachers")} />
          )}
        </Suspense>
      </main>

      {/* Popup for user actions */}
      {isPopupOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className="bg-white text-black p-6 rounded-lg w-96 shadow-xl"
          >
            <h3 className="text-xl font-bold mb-4">{selectedUser?.name}</h3>

            <button
              onClick={handleShowDetails}
              className="w-full mb-3 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
>
Show Details
</button>
        <button
          onClick={handleDeleteUser}
          disabled={isDeleting}
          className={`w-full mb-3 py-2 rounded ${
            isDeleting ? "bg-gray-400 text-gray-700" : "bg-red-500 hover:bg-red-600 text-white"
          }`}
        >
          {isDeleting ? "Deleting..." : "Delete User"}
        </button>

        <button
          onClick={() => setIsPopupOpen(false)}
          className="w-full bg-gray-300 hover:bg-gray-400 text-black py-2 rounded"
        >
          Cancel
        </button>
      </motion.div>
    </div>
  )}

  {/* Success popup */}
  {successPopup && (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-green-600 text-white p-6 rounded-lg"
        onClick={() => setSuccessPopup(false)}
      >
        User deleted successfully.
      </motion.div>
    </div>
  )}
</div>
);
};

export default Adminstuden;
