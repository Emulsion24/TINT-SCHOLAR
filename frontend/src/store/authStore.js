import { create } from "zustand";
import axios from "axios";
import { persist } from "zustand/middleware";
import { Navigate } from "react-router-dom";

const API = "https://tint-scholar-2b0b3rrda-kaitis-projects.vercel.app/";  // Updated API URL
axios.defaults.withCredentials = true;

export const useAuthStore = create(
  (set) => ({
    user: null,
    users: [],
    isAuthenticated: false,
    error: null,
    isLoading: false,
    isCheckingAuth: true,
    message: null,
    teacher: null,
    teachers: [],
    project: null,
    projects: [],
    filteredProjectsCount: 0,
    hackathons: [],
    setHackathons: (newHackathons) => set({ hackathons: newHackathons }),
    userId: null,
    teacherId: null, // Ensure this is initialized properly

    signup: async (email, password, name, rollnumber, branch, phnumber) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API}api/auth/signup`, { email, password, name, rollnumber, branch, phnumber });
        set({ user: response.data.user, isAuthenticated: true, isLoading: false });
      } catch (error) {
        set({ error: error.response.data.message || "Error signing up", isLoading: false });
        throw error;
      }
    },
    setFilteredProjectsCount: (count) => {
      set({ filteredProjectsCount: count });
    },

    login: async (email, password) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API}api/auth/login`, { email, password });
        
        // Check if teacher or user data exists and set state accordingly
        const { user, teacher } = response.data;
        set({
          isAuthenticated: true,
          user: user || null,
          teacher: teacher || null, // Set teacher data if available
          error: null,
          isLoading: false,
          userId: (user && user._id) || (teacher && teacher._id) || null
        });
      } catch (error) {
        set({ error: error.response?.data?.message || "Error logging in", isLoading: false });
        throw error;
      }
    },

    logout: async () => {
      set({ isLoading: true, error: null });
      try {
        await axios.post(`${API}api/auth/logout`);
        set({ user: null, isAuthenticated: false, error: null, isLoading: false });
      } catch (error) {
        set({ error: "Error logging out", isLoading: false });
        throw error;
      }
    },

    verifyEmail: async (code) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API}api/auth/verifyEmail`, { code });
        set({ user: response.data.user, isAuthenticated: true, isLoading: false });
        return response.data;
      } catch (error) {
        set({ error: error.response.data.message || "Error verifying email", isLoading: false });
        throw error;
      }
    },

    checkAuth: async () => {
      set({ isCheckingAuth: true, error: null });
      try {
        const response = await axios.get(`${API}api/auth/check-auth`);
        set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false, teacher: response.data.teacher, userId: response.data.user?._id, teacherId: response.data.teacher?._id });
      } catch (error) {
        set({ error: null, isCheckingAuth: false, isAuthenticated: false });
      }
    },

    forgotPassword: async (email) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API}api/auth/forgot-password`, { email });
        set({ message: response.data.message, isLoading: false });
      } catch (error) {
        set({
          isLoading: false,
          error: error.response.data.message || "Error sending reset password email",
        });
        throw error;
      }
    },

    resetPassword: async (token, password) => {
      set({ isLoading: true, error: null });
      try {
        const response = await axios.post(`${API}api/auth/reset-password/${token}`, { password });
        set({ message: response.data.message, isLoading: false });
      } catch (error) {
        set({
          isLoading: false,
          error: error.response.data.message || "Error resetting password",
        });
        throw error;
      }
    },

    fetchUsers: async () => {
      set({ isloading: true, error: null });
      try {
        const response = await axios.get(`${API}api/admin/users`);
        set({ users: response.data.users, Isloading: false });
      } catch (error) {
        set({ error: error.response.data.message || 'Failed to fetch users', loading: false });
      }
      throw error;
    },

    fetchTeachers: async () => {
      set({ isloading: true, error: null });
      try {
        const response = await axios.get(`${API}api/admin/teachers`);
        set({ teachers: response.data.teachers, Isloading: false });
      } catch (error) {
        set({ error: error.response.data.message || 'Failed to fetch teachers', loading: false });
      }
      throw error;
    },

    uploadProfilePhoto: async (file) => {
      set({ isLoading: true, error: null });

      try {
        // Create FormData to send the file
        const formData = new FormData();
        formData.append('profilePhoto', file);
        
        // Send request to the server to upload the photo
        const response = await axios.post(`${API}students/upload-profile-photo`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          withCredentials: true,
        });

        // Update user profile with the new photo URL
        set((state) => ({
          user: { ...state.user, profilePhoto: response.data.profilePhoto },
          isLoading: false,
        }));

        return response.data;  // Response should return the URL or success message
      } catch (error) {
        set({ error: error.response?.data?.message || "Error uploading profile photo", isLoading: false });
        throw error;
      }
    },

    uploadProject: async (file, projectData) => {
      try {
        const formData = new FormData();
        formData.append("projectName", projectData.projectName || "");
        formData.append("description", projectData.description || "");
        formData.append("techStack", projectData.techStack);
        formData.append("duration", projectData.duration);
        formData.append("link", projectData.link);
        formData.append("contributors", projectData.contributors);
        formData.append("mentorId", projectData.mentorId);
        
        if (file) {
          formData.append("pdfFile", file);
        }

        // Send POST request
        const response = await axios.post(`${API}api/students/upload-project`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          withCredentials: true,
        });

        set({ projects: response.data });
        return response.data;
      } catch (error) {
        console.error("Error uploading project:", error.response?.data || error.message);
        throw error;
      }
    },

    fetchProjects: async () => {
      try {
        const response = await axios.get(`${API}api/students/projects`);
        set({ projects: response.data });
      } catch (error) {
        console.error("Failed to fetch projects:", error);
      }
    },

    fetchHackathon: async () => {
      try {
        const response = await axios.get(`${API}api/students/hackathon`, { withCredentials: true });
        set({ hackathons: response.data });
      } catch (error) {
        console.error("Error fetching Hackathons:", error);
      }
    },

    deleteProject: async (projectId) => {
      try {
        const response = await axios.delete(`${API}api/students/delete-projects/${projectId}`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          set((state) => ({
            projects: state.projects.filter((project) => project._id !== projectId),
          }));
          console.log(`Successfully deleted the project with ID: ${projectId}`);
        } else {
          console.error("Failed to delete project:", response.data.message);
        }
      } catch (error) {
        console.error("Error deleting project:", error);
      }
    },

    deleteHackathon: async (id) => {
      try {
        const response = await axios.delete(`${API}api/students/delete-hackathon/${id}`, { withCredentials: true });
        if (response.status === 200) {
          set((state) => ({
            hackathons: state.hackathons.filter((hackathon) => hackathon._id !== id),
          }));
          console.log(`Successfully deleted hackathon with ID: ${id}`);
        } else {
          console.error("Failed to delete hackathon:", response.data.message);
        }
      } catch (error) {
        console.error("Error deleting hackathon:", error);
      }
    },
  })
);
