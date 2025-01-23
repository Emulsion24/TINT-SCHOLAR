import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore.js";
import ProfileSection from "../component/ProfileSection.jsx";
import ResultSection from "../component/ResultSection.jsx";
import ProjectsSection from "../component/ProjectSection.jsx";
import HackathonSection from "../component/HackathonSection.jsx";
import MoocsSection from "../component/MoocsSection.jsx";
import HomeSection from "../component/HomeSection.jsx";
import AllProjects from "../component/AllProjects.jsx";

const StudentDashboard = () => {
  const { user, logout } = useAuthStore();
  const [activeSection, setActiveSection] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const stats = {
    hackathons: 5,
    certificates: 10,
    backlogs: 0,
    projects: 4,
    averageCgpa: 9.3,
  };

  const semMarks = [9.5, 9.2, 8.8, 9.0, 9.4, 9.3];

  const handleLogout = () => {
    logout();
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case "home":
        return <HomeSection stats={stats} semMarks={semMarks} />;
      case "profile":
        return <ProfileSection />;
      case "results":
        return <ResultSection />;
      case "myprojects":
        return <ProjectsSection />;
      case "allprojects":
          return <AllProjects />;
      case "hackathons":
        return <HackathonSection />;
      case "moocs":
        return <MoocsSection />;
       
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-gray-950 text-white">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "w-64" : "w-20"
        } bg-gradient-to-b from-gray-800 to-gray-900 text-white shadow-lg fixed h-full transition-all duration-300 flex flex-col overflow-hidden`}
      >
        <div className="p-4 flex items-center justify-between border-b border-gray-700">
          <h2
            className={`text-2xl font-bold bg-gradient-to-r from-green-400 to-emerald-600 text-transparent bg-clip-text ${
              isSidebarOpen ? "" : "hidden"
            }`}
          >
            Dashboard
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white focus:outline-none p-2 rounded-full hover:bg-gray-700"
          >
            {isSidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="flex-grow mt-4 space-y-2">
          {[
            { name: "Home", icon: "🏠" },
            { name: "Profile", icon: "👤" },
            { name: "Results", icon: "📊" },
            { name: "MyProjects", icon: "📁" },
            { name: "AllProjects", icon: "📁" },
            { name: "Hackathons", icon: "🚀" },
            { name: "MOOCs", icon: "📚" },
          ].map(({ name, icon }) => (
            <button
              key={name}
              onClick={() => setActiveSection(name.toLowerCase())}
              className={`flex items-center space-x-4 w-full px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                activeSection === name.toLowerCase()
                  ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg"
                  : "hover:bg-gray-700"
              }`}
            >
              <span
                className={`text-xl ${
                  activeSection === name.toLowerCase() ? "text-white" : "text-green-400"
                }`}
              >
                {icon}
              </span>
              <span
                className={`text-md font-medium ${
                  isSidebarOpen ? "block" : "hidden"
                } text-gray-300`}
              >
                {name}
              </span>
            </button>
          ))}

          <div className="mt-auto p-4">
            <button
              onClick={handleLogout}
              className="flex items-center space-x-4 w-full px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 transition-all duration-300"
            >
              <span className="text-xl text-white">🚪</span>
              {isSidebarOpen && <span className="text-md font-medium text-white">Logout</span>}
            </button>
          </div>
        </nav>
      </div>

      {/* Main Content */}
      <div
        className={`flex-grow p-6 transition-all duration-300 ${
          isSidebarOpen ? "ml-64" : "ml-20"
        } overflow-hidden`}
      >
        {renderSectionContent()}
      </div>

      {/* Footer */}
      
    </div>
  );
};

export default StudentDashboard;
