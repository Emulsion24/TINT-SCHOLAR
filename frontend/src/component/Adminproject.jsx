import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Select from "react-select";
import { useAuthStore } from "../store/authStore";

const AdminProject = ({loggedInUserId }) => {
  const projects = useAuthStore((state) => state.projects) || [];
  const teachers = useAuthStore((state) => state.teachers) || [];
  const students = useAuthStore((state) => state.users) || [];
  const loggedInteacherId = useAuthStore((state) => state.teacherId);
  const fetchTeachers = useAuthStore((state) => state.fetchTeacher);
  const fetchStudents = useAuthStore((state) => state.fetchStudent);
  const fetchProjects = useAuthStore((state) => state.fetchProjects);
  const uploadProject = useAuthStore((state) => state.uploadProject);
  const deleteProject = useAuthStore((state) => state.deleteProject);
  const setFilteredProjectsCount = useAuthStore((state) => state.setFilteredProjectsCount);

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [newProject, setNewProject] = useState({
    projectName: "",
    description: "",
    techStack: "",
    duration: "",
    link: "",
    contributors: [],
    mentorId: "",
    pdfFile: null,
  });

  const [filteredProjects, setFilteredProjects] = useState([]);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const loadData = async () => {
      console.log("Fetching data...");
      await fetchTeachers();
      await fetchStudents();
      await fetchProjects();
      setProjectsLoaded(true);
      setIsLoading(false);
      console.log("Data fetched, setting projectsLoaded to true.");
    };
    loadData();
  }, [fetchTeachers, fetchStudents, fetchProjects]);

  // Filter projects based on logged-in user
  useEffect(() => {
    if (projectsLoaded) {
      if (projects.length > 0 && (loggedInUserId || loggedInteacherId)) {
        const filtered = projects.filter((project) => {
          const isMentor = project.mentor?._id === loggedInteacherId;
          const isContributor = project.contributors?.some(
            (contributor) => contributor._id === loggedInUserId
          );
          return isMentor || isContributor;
        });
        setFilteredProjects(filtered);
        setFilteredProjectsCount(filtered.length);
      } else {
        setFilteredProjects([]);
        console.log("No projects matching the criteria.");
      }
    }
  }, [projects, loggedInUserId, loggedInteacherId, projectsLoaded]);

  const handleUploadProject = async () => {
    try {
      setIsUploading(true);
      if (!newProject.projectName || !newProject.pdfFile) {
        alert("Please fill in all required fields and select a file.");
        setIsUploading(false);
        return;
      }

      const { pdfFile, ...restProjectData } = newProject;
      await uploadProject(pdfFile, { ...restProjectData, contributor: newProject.contributors });

      setNewProject({
        projectName: "",
        description: "",
        techStack: "",
        duration: "",
        link: "",
        contributors: [],
        mentorId: "",
        pdfFile: null,
      });
      setShowUploadModal(false);
      await fetchProjects();
    } catch (error) {
      console.error("Error uploading project:", error);
      alert("Failed to upload the project. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    try {
      setIsDeleting(true);
      await deleteProject(id);
      await fetchProjects();
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete the project. Please try again.");
    } finally {
      setIsDeleting(false);
    }
  };

  const handleMentorSelect = (selectedOption) => {
    setNewProject({ ...newProject, mentorId: selectedOption ? selectedOption.value : "" });
  };

  const handleContributorsSelect = (selectedOptions) => {
    const contributors = selectedOptions ? selectedOptions.map((option) => option.value) : [];
    setNewProject({ ...newProject, contributors });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h3 className="text-3xl font-bold text-gradient mb-4">Projects</h3>
      <p className="text-gray-500 text-lg">
        Manage your projects: upload, view, delete them below.
      </p>

      {isLoading ? (
        <div className="flex justify-center items-center py-4">
          <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 border-t-4 border-teal-500 rounded-full"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project) => (
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
                <p className="text-black">
                  <span className="font-medium">Mentor: </span>
                  {project.mentor ? project.mentor.name : "Unknown"}
                </p>
                <p className="text-black">
                  <span className="font-medium">Contributors: </span>
                  {project.contributors
                    .map((contributor) => contributor.name || "Unknown")
                    .join(", ")}
                </p>
                <a
                  href={project.pdfLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-green-400 underline mr-4 hover:text-green-600 cursor-pointer"
                >
                  View Pdf
                </a>
                {isDeleting ? (
                  <div className="flex justify-center py-2">
                    <div className="spinner-border animate-spin inline-block w-6 h-6 border-4 border-t-4 border-teal-500 rounded-full"></div>
                  </div>
                ) : (
                  <button
                    onClick={() => handleDeleteProject(project._id)}
                    className="mt-4 px-6 py-3 bg-red-600 text-white rounded-lg"
                  >
                    Delete
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-white text-center col-span-3">
              No projects found matching your criteria.
            </p>
          )}
        </div>
      )}

      <button
        onClick={() => setShowUploadModal(true)}
        className="px-6 py-3 bg-gradient-to-r from-purple-600 via-indigo-500 to-blue-600 text-white rounded-lg"
      >
        Upload New Project
      </button>

      {showUploadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
          <div className="bg-gray-900 p-8 rounded-lg shadow-xl w-96 space-y-6">
            <h3 className="text-xl font-semibold text-teal-500">Upload Project</h3>
            <input
              type="text"
              placeholder="Project Name"
              value={newProject.projectName}
              onChange={(e) => setNewProject({ ...newProject, projectName: e.target.value })}
              className="w-full p-3 bg-gray-800 text-white rounded-lg"
            />
            <textarea
              placeholder="Description"
              value={newProject.description}
              onChange={(e) => setNewProject({ ...newProject, description: e.target.value })}
              className="w-full p-3 bg-gray-800 text-white rounded-lg"
            />
            <input
              type="text"
              placeholder="Tech Stack"
              value={newProject.techStack}
              onChange={(e) => setNewProject({ ...newProject, techStack: e.target.value })}
              className="w-full p-3 bg-gray-800 text-white rounded-lg"
            />
            <input
              type="text"
              placeholder="Duration"
              value={newProject.duration}
              onChange={(e) => setNewProject({ ...newProject, duration: e.target.value })}
              className="w-full p-3 bg-gray-800 text-white rounded-lg"
            />
            <input
              type="url"
              placeholder="Project Link"
              value={newProject.link}
              onChange={(e) => setNewProject({ ...newProject, link: e.target.value })}
              className="w-full p-3 bg-gray-800 text-white rounded-lg"
            />
            <Select
              placeholder="Select Mentor"
              options={teachers.map((teacher) => ({
                value: teacher._id,
                label: teacher.name,
              }))}
              onChange={handleMentorSelect}
              className="text-black"
            />
            <Select
              placeholder="Select Contributors"
              isMulti
              options={students.map((student) => ({
                value: student._id,
                label: student.name,
              }))}
              onChange={handleContributorsSelect}
              className="text-black"
            />
            <input
              type="file"
              onChange={(e) => setNewProject({ ...newProject, pdfFile: e.target.files[0] })}
              className="text-gray-300"
            />
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowUploadModal(false)}
                className="px-6 py-3 bg-gray-700 text-white rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={handleUploadProject}
                className="px-6 py-3 bg-teal-600 text-white rounded-lg"
              >
                {isUploading ? "Uploading..." : "Upload"}
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default AdminProject;
