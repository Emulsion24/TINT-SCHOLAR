import React, { useState } from 'react';

const AchievementsSection = () => {
  const [achievements, setAchievements] = useState([]);
  const [achievement, setAchievement] = useState({
    title: '',
    description: '',
    file: null,
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAchievement({ ...achievement, [name]: value });
  };

  const handleFileChange = (e) => {
    setAchievement({ ...achievement, file: e.target.files[0] });
  };

  const handleAddAchievement = () => {
    if (achievement.title && achievement.description && achievement.file) {
      const newAchievement = {
        ...achievement,
        fileName: achievement.file.name,
        fileUrl: URL.createObjectURL(achievement.file),
      };
      setAchievements([...achievements, newAchievement]);
      setAchievement({ title: '', description: '', file: null });
    } else {
      alert('Please fill in all fields and select a file!');
    }
  };

  const handleDeleteAchievement = (index) => {
    setAchievements(achievements.filter((_, i) => i !== index));
  };

  return (
    <div className="container mx-auto p-6">
      <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white p-5 rounded-lg shadow-xl mb-6">
        <h2 className="text-2xl font-semibold text-center">My Achievements</h2>
      </div>

      <div className="mb-6 flex gap-4">
        <input
          type="text"
          name="title"
          value={achievement.title}
          onChange={handleChange}
          placeholder="Enter Achievement Title"
          className="p-3 rounded-lg shadow-md w-full text-black"
        />
        <input
          type="text"
          name="description"
          value={achievement.description}
          onChange={handleChange}
          placeholder="Enter Achievement Description"
          className="p-3 rounded-lg shadow-md w-full text-black"
        />
        <input
          type="file"
          accept=".pdf,.png"
          onChange={handleFileChange}
          className="p-3 rounded-lg shadow-md w-full"
        />
        <button
          onClick={handleAddAchievement}
          className="bg-green-500 text-white rounded-lg px-6 py-3 shadow-lg hover:bg-green-600"
        >
          Add
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {achievements.map((ach, index) => (
          <div
            key={index}
            className="bg-gradient-to-r from-blue-400 via-teal-500 to-green-400 p-5 rounded-lg shadow-xl"
          >
            <h3 className="text-xl font-semibold text-white">{ach.title}</h3>
            <p className="text-white mt-2">{ach.description}</p>
            <div className="mt-4">
              {ach.file && (
                <a
                  href={ach.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-200 hover:text-blue-300"
                >
                  View Proof ({ach.fileName})
                </a>
              )}
            </div>
            <button
              onClick={() => handleDeleteAchievement(index)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AchievementsSection;
