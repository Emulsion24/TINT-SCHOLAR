import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore";

const AllProjects = () => {
  const projects = useAuthStore((state) => state.projects) || [];
  const fetchTeachers = useAuthStore((state) => state.fetchTeacher);
  const fetchStudents = useAuthStore((state) => state.fetchStudent);
  const fetchProjects = useAuthStore((state) => state.fetchProjects);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const containerRef = useRef();

  // Fetch data on component mount
  useEffect(() => {
    fetchTeachers();
    fetchStudents();
    fetchProjects();
  }, [fetchTeachers, fetchStudents, fetchProjects]);

  // Search functionality
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setSearchResults([]);
    } else {
      const lowerCaseQuery = searchQuery.toLowerCase();
      const results = projects.filter((project) => {
        const { projectName, techStack, mentor, contributors } = project;

        const matchesProjectName = projectName.toLowerCase().includes(lowerCaseQuery);
        const matchesTechStack = Array.isArray(techStack)
          ? techStack.join(", ").toLowerCase().includes(lowerCaseQuery)
          : techStack.toLowerCase().includes(lowerCaseQuery);
        const matchesMentor = mentor?.name?.toLowerCase().includes(lowerCaseQuery);
        const matchesContributors = contributors.some((contributor) =>
          contributor.name.toLowerCase().includes(lowerCaseQuery)
        );

        return matchesProjectName || matchesTechStack || matchesMentor || matchesContributors;
      });

      setSearchResults(results);
    }
  }, [searchQuery, projects]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
      ref={containerRef}
    >
      <h3 className="text-3xl font-bold text-gradient mb-4">Projects</h3>
      <p className="text-gray-500 text-lg">
        Manage your projects: upload, view, delete, or search them below.
      </p>

      <div className="relative">
        <input
          type="text"
          placeholder="Search by Name, Tech Stack, Mentor, or Contributor"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full p-3 bg-gray-800 text-white rounded-lg"
        />
      </div>

      {/* Display search results */}
      {searchQuery.trim() !== "" && (
        <div className="mt-4 space-y-4">
          {searchResults.length > 0 ? (
            searchResults.map((project) => (
              <div
                key={project._id}
                className="p-6 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 rounded-xl shadow-lg"
              >
                <h4 className="text-white font-semibold text-xl">{project.projectName}</h4>
                <p className="text-gray-200">
                  <span className="font-medium">Description: </span>
                  {project.description}
                </p>
                <p className="text-gray-200">
                  <span className="font-medium">Tech Stack: </span>
                  {Array.isArray(project.techStack)
                    ? project.techStack.join(", ")
                    : project.techStack}
                </p>
                <p className="text-gray-200">
                  <span className="font-medium">Mentor: </span>
                  {project.mentor.name}
                </p>
                <p className="text-gray-200">
                  <span className="font-medium">Contributors: </span>
                  {project.contributors
                    .map((contributor) => contributor.name || "Unknown")
                    .join(", ")}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No projects found matching your criteria.</p>
          )}
        </div>
      )}

      {/* Display all projects if no search query */}
      {searchQuery.trim() === "" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 overflow-auto max-h-[75vh]">
          {projects.map((project) => (
            <div
              key={project._id}
              className="p-6 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 rounded-xl shadow-lg"
            >
              <h4 className="text-white font-semibold text-xl">{project.projectName}</h4>
              <p className="text-gray-200">
                <span className="font-medium">Description: </span>
                {project.description}
              </p>
              <p className="text-gray-200">
                <span className="font-medium">Tech Stack: </span>
                {Array.isArray(project.techStack)
                  ? project.techStack.join(", ")
                  : project.techStack}
              </p>
              <p className="text-gray-200">
                <span className="font-medium">Mentor: </span>
                {project.mentor.name}
              </p>
              <p className="text-gray-200">
                <span className="font-medium">Contributors: </span>
                {project.contributors
                  .map((contributor) => contributor.name || "Unknown")
                  .join(", ")}
              </p>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default AllProjects;
