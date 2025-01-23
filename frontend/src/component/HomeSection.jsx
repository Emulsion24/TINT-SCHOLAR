import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Line } from "react-chartjs-2";
import ResumeBuilderModal from './ResumeBuilderModal';

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import { useAuthStore } from "../store/authStore";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const HomeSection = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const projects = useAuthStore((state) => state.projects) || [];
  const filteredProjectsCount = useAuthStore((state) => state.filteredProjectsCount);
  const setFilteredProjectsCount = useAuthStore((state) => state.setFilteredProjectsCount);
  const fetchProjects = useAuthStore((state) => state.fetchProjects);
  const hackathons = useAuthStore((state) => state.hackathons);
  const fetchHackathons = useAuthStore((state) => state.fetchHackathon);
  const loggedInUserId = useAuthStore((state) => state.userId);
  const loggedInteacherId = useAuthStore((state) => state.teacherId);
  const [projectsLoaded, setProjectsLoaded] = useState(false);
  const [hackathonsLoaded, setHackathonsLoaded] = useState(false);
  const { user } = useAuthStore((state) => ({
    user: state.user,
  }));

  const [stats, setStats] = useState({
    certificates: 0,
    backlogs: 0,
    projects: 0,
    averageCgpa: 0,
    semester: [],
  });

  const [semMarks, setSemMarks] = useState([]);
  const [resume, setResume] = useState(null); // State to store resume

  useEffect(() => {
    const loadData = async () => {
      console.log("Fetching data...");

      await fetchProjects();
      await fetchHackathons();

      console.log("Data fetched, setting projectsLoaded and hackathonsLoaded to true.");

      setProjectsLoaded(true);
      setHackathonsLoaded(true);
    };

    loadData();
  }, [fetchProjects, fetchHackathons]);

  useEffect(() => {
    if (projectsLoaded) {
     
      if (projects.length > 0 && (loggedInUserId || loggedInteacherId)) {
        const filtered = projects.filter((project) => {
          const isMentor = project.mentor._id === loggedInteacherId;
          const isContributor = project.contributors.some(
            (contributor) => contributor._id === loggedInUserId
          );

          return isMentor || isContributor;
        });

        setFilteredProjectsCount(filtered.length);
      } else {
        setFilteredProjectsCount(0);
        console.log("No projects matching the criteria.");
      }
    }
  }, [projects, loggedInUserId, loggedInteacherId, projectsLoaded]);

  useEffect(() => {
    if (user && user.results) {
      const { results, hackathons, certificates, backlogs } = user;
      const cgpaArray = results.map((result) => parseFloat(result.averageCGPA));
      const semesterArray = results.map((result) => result.semester);

      const semesterData = semesterArray.map((semester, index) => ({
        semester,
        cgpa: cgpaArray[index],
      }));

      semesterData.sort((a, b) => a.semester - b.semester);

      const sortedSemesters = semesterData.map((data) => data.semester);
      const sortedCgpas = semesterData.map((data) => data.cgpa);

      setSemMarks(sortedCgpas);
      setStats({
        certificates: certificates || 0,
        backlogs: backlogs || 0,
        projects: filteredProjectsCount || 0,
        averageCgpa: sortedCgpas.reduce((sum, cgpa) => sum + cgpa, 0) / sortedCgpas.length,
        semester: sortedSemesters,
      });
    }
  }, [user, filteredProjectsCount]);

  const chartData = {
    labels: semMarks.map((_, index) => `Sem ${stats.semester[index]}`),
    datasets: [
      {
        label: "Semester CGPA",
        data: semMarks,
        borderColor: "rgba(72, 187, 120, 1)",
        backgroundColor: "rgba(72, 187, 120, 0.2)",
        borderWidth: 2,
        tension: 0.3,
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
        },
      },
    },
  };

  // Handle resume view (replace this logic with actual resume view or URL)
  const handleResumeClick = () => {
    setIsModalOpen(true);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col min-h-screen"
    >
      <div className="flex-grow space-y-6 px-4">
        <p className="text-gray-400 text-center">
          Here's an overview of your academic and extracurricular activities.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700 text-center">
            <h4 className="text-green-400 font-bold text-lg">Total Hackathons</h4>
            {/* Show spinner while loading hackathons */}
            {!hackathonsLoaded ? (
              <div className="flex justify-center items-center space-x-2">
                <div className="w-12 h-12 border-t-4 border-green-400 border-solid rounded-full animate-spin"></div>
                <p className="text-gray-300">Loading Hackathons...</p>
              </div>
            ) : (
              <p className="text-gray-300 text-2xl">{hackathons.length}</p>
            )}
          </div>
          <div className="p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700 text-center">
            <h4 className="text-green-400 font-bold text-lg">Total Certificates</h4>
            <p className="text-gray-300 text-2xl">{stats.certificates}</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700 text-center">
            <h4 className="text-green-400 font-bold text-lg">Active Backlogs</h4>
            <p className="text-gray-300 text-2xl">{stats.backlogs}</p>
          </div>
          <div className="p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700 text-center">
            <h4 className="text-green-400 font-bold text-lg">Total Projects</h4>
            {/* Show spinner while loading projects */}
            {!projectsLoaded ? (
              <div className="flex justify-center items-center space-x-2">
                <div className="w-12 h-12 border-t-4 border-green-400 border-solid rounded-full animate-spin"></div>
                <p className="text-gray-300">Loading Projects...</p>
              </div>
            ) : (
              <p className="text-gray-300 text-2xl">{filteredProjectsCount}</p>
            )}
          </div>
           <div className="p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700 text-center col-span-2 lg:col-span-2">
            <h4 className="text-green-400 font-bold text-lg">Average CGPA</h4>
            <p className="text-gray-300 text-3xl">{stats.averageCgpa.toFixed(2)}</p>
            </div>
            <div className="p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700 text-center col-span-2 lg:col-span-2">
            <h4 className="text-green-400 font-bold text-lg">Resume</h4>
            <div className="mt-4">
            <button
              onClick={handleResumeClick}
              className="text-gray-300 bg-green-500 hover:bg-green-600 py-2 px-4 rounded-lg"
            >
              Build Resume
            </button>
          </div>
         </div>

           {/* Resume Section with Button */}
          
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700 space-y-4">
            <h4 className="text-green-400 font-bold text-lg">Semester Marks</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {semMarks.map((mark, index) => (
                <div
                  key={index}
                  className="p-3 bg-gray-900 rounded-md text-center border border-gray-700"
                >
                  <p className="text-gray-400 font-semibold">Sem {stats.semester[index]}</p>
                  <p className="text-green-300 text-lg">{mark}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 bg-gray-800 rounded-lg shadow-md border border-gray-700">
            <h4 className="text-green-400 font-bold text-lg mb-4">
              CGPA Trend Over Semesters
            </h4>
            <div className="h-48">
              <Line data={chartData} options={chartOptions} />
            </div>
          </div>
        </div>
      </div>
      <ResumeBuilderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)} // Close the modal
        projects={projects}
        semMarks={semMarks}
        stats={stats}
        user={user}
      />
    </motion.div>
  );
};

export default HomeSection;
