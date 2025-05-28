import React, { useState } from "react";
import { motion } from "framer-motion";
import { useAuthStore } from "../store/authStore.js"; // Make sure this store has the uploadProfilePhoto method
import { formatDate } from "../utils/date.js";

const AdminProfile = ({user}) => {
  const { uploadProfilePhoto } = useAuthStore();
  const [photo, setPhoto] = useState(null);
  const [profilePhoto, setProfilePhoto] = useState(user?.profilePhoto || "https://via.placeholder.com/150");
  const [isUploading, setIsUploading] = useState(false); // To handle loading state

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      // Preview the selected photo
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhoto(selectedFile); // Store the file for upload
        setProfilePhoto(reader.result); // Preview the selected photo
      };
      reader.readAsDataURL(selectedFile);
    }
  };

  const handleUpload = async () => {
    if (photo) {
      setIsUploading(true);
      try {
        // Upload the profile photo and update the user profile
        const response = await uploadProfilePhoto(photo);
        setProfilePhoto(response.profilePhoto); // Assuming the backend returns the URL
        setIsUploading(false);
      } catch (error) {
        console.error("Upload failed:", error);
        setIsUploading(false);
      }
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="space-y-6"
    >
      <h3 className="text-3xl font-semibold text-teal-600 mb-6">Profile Information</h3>

      {/* Profile Photo Section */}
      <div className="flex flex-col items-center space-y-6 bg-gray-800 p-6 rounded-lg shadow-lg">
        <div className="relative">
          <img
            src={profilePhoto}
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-teal-500 shadow-xl"
          />
          <label
            htmlFor="profilePhotoInput"
            className="absolute bottom-0 right-0 bg-teal-500 text-white p-2 rounded-full cursor-pointer hover:bg-teal-600 transition duration-300"
          >
            ✏️
          </label>
          <input
            id="profilePhotoInput"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={handleFileChange}
          />
        </div>
        <p className="text-gray-400 text-sm">Click on the pencil icon to update your profile photo</p>
      </div>

      {/* Upload Button */}
      <div className="flex justify-center mt-4">
        <button
          onClick={handleUpload}
          disabled={isUploading}
          className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300"
        >
          {isUploading ? "Uploading..." : "Upload Photo"}
        </button>
      </div>

      {/* User Info Section */}
      <div className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4">
        <div className="space-y-2">
          <p className="text-gray-300">
            <span className="font-semibold text-teal-500">Name: </span>
            {user.name}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-teal-500">Email: </span>
            {user.email}
          </p>
         
          <p className="text-gray-300">
            <span className="font-semibold text-teal-500">Ph.no: </span>
            {user.phnumber}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-teal-500">Roll.no: </span>
            {user.rollnumber}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-teal-500">Branch: </span>
            {user.branch}
          </p>
          <p className="text-gray-300">
            <span className="font-semibold text-teal-500">Joined: </span>
            {formatDate(user.createdAt)}
          </p>
        </div>
      </div>

      {/* Edit & Delete Buttons */}
      <div className="flex justify-center space-x-6 mt-6">
        <button className="px-6 py-3 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition duration-300 w-full sm:w-auto">
          Edit Profile
        </button>
        <button className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300 w-full sm:w-auto">
          Delete Account
        </button>
      </div>
    </motion.div>
  );
};

export default AdminProfile;
