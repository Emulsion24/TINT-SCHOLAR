import React, { useState } from "react";
import { motion } from "framer-motion";
import HomeSectionTeacher from "../component/HomeSectionteacher.jsx";
import TeacherProfileSection from "../component/TeacherProfileSection.jsx";
import PublicationSection from "../component/PublicationSection.jsx";
import FdpWorkshopSection from "../component/FdpWorkshopSection.jsx";
import AchievementsSection from "../component/AchievementsSection.jsx";
import OrganizeEventsSection from "../component/OrganizeEventsSection.jsx";
import { useAuthStore } from "../store/authStore.js";
import ProjectsSection from "../component/ProjectSection.jsx";
import Allprojects from "../component/AllProjects.jsx";

// Import icons from lucide/react
import { Home as HomeIcon, User as ProfileIcon, FileText as PublicationIcon, Award as WorkshopIcon, Trophy as AchievementsIcon, Calendar as EventsIcon, Code as ProjectsIcon, Folder as AllProjectsIcon, LogOut as LogOutIcon, Plus } from "lucide-react";
import MarksUpload from "../component/MarksUpload.jsx";
import AttendanceUpload from "../component/AttandenceUpload.jsx";

const TeacherDashboard = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { user, logout } = useAuthStore();
  const handelLogout = () => {
    logout();
  };

  const renderSectionContent = () => {
    switch (activeSection) {
      case "home":
        return <HomeSectionTeacher />;
      case "profile":
        return <TeacherProfileSection />;
      case "publication":
        return <PublicationSection />;
      case "workshop":
        return <FdpWorkshopSection />;
      case "achievements":
        return <AchievementsSection />;
      case "events":
        return <OrganizeEventsSection />;
      case "myprojects":
        return <ProjectsSection />;
      case "allprojects":
        return <Allprojects />;
      case "uploadmarks":
        return <MarksUpload/>;
      case "uploadattandance":
        return <AttendanceUpload />;
      default:
        return null;
    }
  };

  const sections = [
    { name: "Home", icon: <HomeIcon className="w-6 h-6" /> },
    { name: "Profile", icon: <ProfileIcon className="w-6 h-6" /> },
    { name: "Publication", icon: <PublicationIcon className="w-6 h-6" /> },
    { name: "Workshop", icon: <WorkshopIcon className="w-6 h-6" /> },
    { name: "Achievements", icon: <AchievementsIcon className="w-6 h-6" /> },
    { name: "Events", icon: <EventsIcon className="w-6 h-6" /> },
    { name: "My Projects", icon: <ProjectsIcon className="w-6 h-6" /> },
    { name: "All Projects", icon: <AllProjectsIcon className="w-6 h-6" /> },
     { name: "Upload Marks", icon: <Plus className="w-6 h-6" /> },
      { name: "Upload Attandance", icon: <Plus className="w-6 h-6" /> },
  ];

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
            className={`text-2xl font-bold bg-gradient-to-r from-blue-400 to-indigo-600 text-transparent bg-clip-text ${
              isSidebarOpen ? "" : "hidden"
            }`}
          >
            Teacher Dashboard
          </h2>
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-white focus:outline-none p-2 rounded-full hover:bg-gray-700"
          >
            {isSidebarOpen ? "◀" : "▶"}
          </button>
        </div>

        <nav className="flex-grow mt-4 space-y-2">
          {sections.map(({ name, icon }) => (
            <button
              key={name}
              onClick={() => setActiveSection(name.toLowerCase().replace(/\s+/g, ""))}
              className={`flex items-center space-x-4 w-full px-4 py-3 rounded-lg text-left transition-all duration-300 ${
                activeSection === name.toLowerCase().replace(/\s+/g, "")
                  ? "bg-gradient-to-r from-blue-500 to-indigo-600 shadow-lg"
                  : "hover:bg-gray-700"
              }`}
            >
              <span
                className={`text-xl ${
                  activeSection === name.toLowerCase().replace(/\s+/g, "")
                    ? "text-white"
                    : "text-blue-400"
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
              onClick={handelLogout}
              className="flex items-center space-x-4 w-full px-4 py-3 rounded-lg bg-red-500 hover:bg-red-600 transition-all duration-300"
            >
              <LogOutIcon className="w-6 h-6 text-white" />
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

export default TeacherDashboard;
