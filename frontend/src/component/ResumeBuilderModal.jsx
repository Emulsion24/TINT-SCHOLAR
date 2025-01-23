import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/authStore'; // Adjust this path based on your file structure

const ResumeBuilderModal = ({ isOpen, onClose }) => {
  const { user } = useAuthStore();
  const [name, setName] = useState(''); // Define name state
  const [email, setEmail] = useState(''); // Define email state
  const [selectedProjects, setSelectedProjects] = useState([]); 
  const [selectedSems, setSelectedSems] = useState([]); 
  const [selectedHackathons, setSelectedHackathons] = useState([]); 
  const [selectedTechnologies, setSelectedTechnologies] = useState([]); 
  const [isProjectsOpen, setIsProjectsOpen] = useState(false); 
  const [isSemsOpen, setIsSemsOpen] = useState(false);
  const [isHackathonsOpen, setIsHackathonsOpen] = useState(false);
  const [isTechnologiesOpen, setIsTechnologiesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Sample data for projects, hackathons, and technologies
  const projects = [
    { _id: '1', name: 'Project A' },
    { _id: '2', name: 'Project B' },
    { _id: '3', name: 'Project C' }
  ];
  const semMarks = [8.5, 8.7, 9.0, 8.8];
  const stats = { semester: [1, 2, 3, 4], averageCgpa: 8.75 };
  const hackathons = [
    { _id: '1', name: 'Hackathon X' },
    { _id: '2', name: 'Hackathon Y' },
    { _id: '3', name: 'Hackathon Z' }
  ];
  const technologies = ['React', 'Node.js', 'Python', 'MongoDB', 'JavaScript', 'CSS'];

  const handleSubmit = () => {
    const resumeData = {
      name,
      email,
      selectedProjects,
      selectedSems,
      selectedHackathons, 
      selectedTechnologies,
      averageCgpa: stats.averageCgpa,
    };
    console.log('Resume Data:', resumeData);
    onClose(); // Close the modal after submission
  };

  // Handle selection changes for multiple selections
  const handleProjectChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedProjects(selectedOptions);
  };

  const handleSemChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedSems(selectedOptions);
  };

  const handleHackathonChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedHackathons(selectedOptions);
  };

  const handleTechnologyChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setSelectedTechnologies(selectedOptions);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value.toLowerCase());
  };

  // Filter data based on search query
  const filterData = (data) => {
    return data.filter(item => item.name.toLowerCase().includes(searchQuery));
  };

  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-lg w-full">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold text-center text-gray-700">Build Your Resume</h2>
          <button onClick={onClose} className="text-gray-500 text-xl">&times;</button>
        </div>

        {/* Name Field */}
        <div className="mb-4">
          <label className="block text-black mb-2 text-sm sm:text-base">Name:</label>
          <p className="border border-gray-300 rounded-lg p-2 sm:p-3 w-full text-sm sm:text-base">{name}</p>
        </div>

        {/* Email Field */}
        <div className="mb-4">
          <label className="block text-black mb-2 text-sm sm:text-base">Email:</label>
          <p className="border border-gray-300 rounded-lg p-2 sm:p-3 w-full text-sm sm:text-base">{email}</p>
        </div>

        {/* Project Selection */}
        <div className="mb-6 relative">
          <label className="block text-black mb-2 text-sm sm:text-base">Select Projects:</label>
          <div
            className="cursor-pointer border border-gray-300 rounded-lg p-3 w-full flex flex-wrap relative"
            onClick={() => setIsProjectsOpen(!isProjectsOpen)}
          >
            {selectedProjects.length > 0 ? (
              <div className="flex flex-wrap">
                {selectedProjects.map((project, idx) => (
                  <span key={idx} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full m-1">
                    {project} <button type="button" onClick={() => setSelectedProjects(selectedProjects.filter(item => item !== project))} className="text-red-500">x</button>
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-500">Select projects</span>
            )}
          </div>

          {isProjectsOpen && (
            <div className="absolute z-10 left-0 right-0 mt-1 bg-white shadow-lg rounded-lg border border-gray-300 max-h-60 overflow-auto">
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="border-b border-gray-300 px-4 py-2 w-full"
              />
              <select
                value={selectedProjects}
                onChange={handleProjectChange}
                multiple
                className="p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              >
                {filterData(projects).map((project) => (
                  <option key={project._id} value={project.name}>
                    {project.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Semester Selection */}
        <div className="mb-6 relative">
          <label className="block text-black mb-2 text-sm sm:text-base">Select Semesters:</label>
          <div
            className="cursor-pointer border border-gray-300 rounded-lg p-3 w-full flex flex-wrap relative"
            onClick={() => setIsSemsOpen(!isSemsOpen)}
          >
            {selectedSems.length > 0 ? (
              <div className="flex flex-wrap">
                {selectedSems.map((sem, idx) => (
                  <span key={idx} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full m-1">
                    {`Sem ${sem}`} <button type="button" onClick={() => setSelectedSems(selectedSems.filter(item => item !== sem))} className="text-red-500">x</button>
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-500">Select semesters</span>
            )}
          </div>

          {isSemsOpen && (
            <div className="absolute z-10 left-0 right-0 mt-1 bg-white shadow-lg rounded-lg border border-gray-300 max-h-60 overflow-auto">
              <input
                type="text"
                placeholder="Search semesters..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="border-b border-gray-300 px-4 py-2 w-full"
              />
              <select
                value={selectedSems}
                onChange={handleSemChange}
                multiple
                className="p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              >
                {semMarks.map((sem, idx) => (
                  <option key={idx} value={sem}>
                    {`Sem ${sem}`}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Hackathons Selection */}
        <div className="mb-6 relative">
          <label className="block text-black mb-2 text-sm sm:text-base">Select Hackathons:</label>
          <div
            className="cursor-pointer border border-gray-300 rounded-lg p-3 w-full flex flex-wrap relative"
            onClick={() => setIsHackathonsOpen(!isHackathonsOpen)}
          >
            {selectedHackathons.length > 0 ? (
              <div className="flex flex-wrap">
                {selectedHackathons.map((hackathon, idx) => (
                  <span key={idx} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full m-1">
                    {hackathon} <button type="button" onClick={() => setSelectedHackathons(selectedHackathons.filter(item => item !== hackathon))} className="text-red-500">x</button>
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-500">Select hackathons</span>
            )}
          </div>

          {isHackathonsOpen && (
            <div className="absolute z-10 left-0 right-0 mt-1 bg-white shadow-lg rounded-lg border border-gray-300 max-h-60 overflow-auto">
              <input
                type="text"
                placeholder="Search hackathons..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="border-b border-gray-300 px-4 py-2 w-full"
              />
              <select
                value={selectedHackathons}
                onChange={handleHackathonChange}
                multiple
                className="p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              >
                {filterData(hackathons).map((hackathon) => (
                  <option key={hackathon._id} value={hackathon.name}>
                    {hackathon.name}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Technologies Selection */}
        <div className="mb-6 relative">
          <label className="block text-black mb-2 text-sm sm:text-base">Select Technologies:</label>
          <div
            className="cursor-pointer border border-gray-300 rounded-lg p-3 w-full flex flex-wrap relative"
            onClick={() => setIsTechnologiesOpen(!isTechnologiesOpen)}
          >
            {selectedTechnologies.length > 0 ? (
              <div className="flex flex-wrap">
                {selectedTechnologies.map((tech, idx) => (
                  <span key={idx} className="bg-gray-200 text-gray-700 px-3 py-1 rounded-full m-1">
                    {tech} <button type="button" onClick={() => setSelectedTechnologies(selectedTechnologies.filter(item => item !== tech))} className="text-red-500">x</button>
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-gray-500">Select technologies</span>
            )}
          </div>

          {isTechnologiesOpen && (
            <div className="absolute z-10 left-0 right-0 mt-1 bg-white shadow-lg rounded-lg border border-gray-300 max-h-60 overflow-auto">
              <input
                type="text"
                placeholder="Search technologies..."
                value={searchQuery}
                onChange={handleSearchChange}
                className="border-b border-gray-300 px-4 py-2 w-full"
              />
              <select
                value={selectedTechnologies}
                onChange={handleTechnologyChange}
                multiple
                className="p-3 w-full focus:outline-none focus:ring-2 focus:ring-blue-400 text-black"
              >
                {technologies.map((tech, idx) => (
                  <option key={idx} value={tech}>
                    {tech}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSubmit}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 focus:outline-none"
          >
            Generate Resume
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilderModal;
