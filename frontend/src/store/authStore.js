import { create } from "zustand";
import axios from "axios";
import { persist } from "zustand/middleware";
import { Navigate } from "react-router-dom";
import { User, Users } from "lucide-react";



axios.defaults.withCredentials = true;

 export  const useAuthStore = create(
	
	(set) => ({
	user: null,
	CAresults:[],
	users:[],
	isAuthenticated: false,
	error: null,
	isLoading: false,
	isCheckingAuth: true,
	publications: [],
	message: null,
	teacher:null,
	teachers:[],
	studentProjects:[],
	project:null,
	projects:[],
	filteredProjectsCount:0,
	Allpublications:[],
	AllHackathons:[],
	hackathons: [],
    setHackathons: (newHackathons) => set({ hackathons: newHackathons }),
	userId: null,
	teacherId: null, // Ensure this is initialized properly
  

	signup: async ( email, password, name,rollnumber,branch,phnumber) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`https://tint-scholar.onrender.com/api/auth/signup`, { email, password, name,rollnumber,branch,phnumber });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},
	setFilteredProjectsCount: (count) =>{ 
		set({ filteredProjectsCount: count });	
  
	   
},
	
login: async (email, password) => {
    set({ isLoading: true, error: null });
    try {
        const response = await axios.post(`https://tint-scholar.onrender.com/api/auth/login`, { email, password });
        
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
			await axios.post(`https://tint-scholar.onrender.com/api/auth/logout`);
			set({ user: null, isAuthenticated: false, error: null, isLoading: false });
		} catch (error) {
			set({ error: "Error logging out", isLoading: false });
			throw error;
		}
	},
	verifyEmail: async (code) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`https://tint-scholar.onrender.com/api/auth/verifyEmail`, { code });
			set({ user: response.data.user, isAuthenticated: true, isLoading: false,  });
			return response.data;
		} catch (error) {
			set({ error: error.response.data.message || "Error verifying email", isLoading: false });
			throw error;
		}
	},
	checkAuth: async () => {
		set({ isCheckingAuth: true, error: null });
		try {
			const response = await axios.get(`https://tint-scholar.onrender.com/api/auth/check-auth`);
			set({ user: response.data.user, isAuthenticated: true, isCheckingAuth: false,teacher:response.data.teacher ,userId: response.data.user?._id,teacherId: response.data.teacher?._id});
		  
		} catch (error) {
			set({ error: null, isCheckingAuth: false, isAuthenticated: false });
		}
	
	},
	forgotPassword: async (email) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`https://tint-scholar.onrender.com/api/auth/forgot-password`, { email });
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
			const response = await axios.post(`https://tint-scholar.onrender.com/api/auth/reset-password/${token}`, { password });
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
  set({ isLoading: true, error: null });
  try {
    const response = await axios.get('https://tint-scholar.onrender.com/api/admin/users');
    set({ users: response.data.users, isLoading: false });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || 'Failed to fetch users';
    set({ error: errorMessage, isLoading: false });
    throw new Error(errorMessage); // Optional: only if you want to handle upstream
  }
},

fetchTeachers: async () => {
  set({ isLoading: true, error: null });
  try {
    const response = await axios.get('https://tint-scholar.onrender.com/api/admin/teachers');
    set({ teachers: response.data.teachers, isLoading: false });
  } catch (error) {
    const errorMessage =
      error.response?.data?.message || error.message || 'Failed to fetch teachers';
    set({ error: errorMessage, isLoading: false });
    throw new Error(errorMessage); // Optional
  }
},
	  uploadProfilePhoto: async (file) => {
		set({ isLoading: true, error: null });
		
		try {
		  // Create FormData to send the file
		  const formData = new FormData();
		  formData.append('profilePhoto', file);
	      
		  // Send request to the server to upload the photo to Cloudinary
		  const response = await axios.post('https://tint-scholar.onrender.com/api/students/upload-profile-photo', formData, {
			
			headers: {
			  'Content-Type': 'multipart/form-data',
			  
			},
			withCredentials: true, 
		  });
	
		  // Update user profile with the new photo URL
		  set((state) => ({
			user: { ...state.user, profilePhoto: response.data.profilePhoto }, // Update with the new photo URL
			isLoading: false,
		  }));
	
		  return response.data;  // Response should return the URL or success message
		} catch (error) {
		  set({ error: error.response?.data?.message || "Error uploading profile photo", isLoading: false });
		  throw error;
		}
	  },
	  addSemesterResult: async (file,newResult) => {
		try {
			const formData = new FormData();
			
			// Append the file to formData
			formData.append('pdfFile', file); // Assuming the backend expects 'file' key for the uploaded file
		
			// Append additional result data
			formData.append('semester', newResult.semester); 
			console.log(newResult.semester)// Assuming newResult contains 'semester'
			formData.append('averageCGPA', newResult.averageCGPA); // Assuming newResult contains 'averageCGPA'
		
			// Make the API request to upload the result
			const response = await axios.post("https://tint-scholar.onrender.com/api/students/upload-results", formData, {
			  headers: {
				'Content-Type': 'multipart/form-data',
			  },
			  withCredentials: true,
			});
		
			// Check the response and update the local state
			if (response.data.success) {
			  // Add the result to the local state after it's successfully uploaded
			  set((state) => ({
				user: { ...state.user, results: [...state.user.results, newResult] },
			  }));
			} else {
			  // Handle error if the API doesn't return success
			  console.error("Failed to upload result:", response.data.message);
			}
		  } catch (error) {
			console.error("Error uploading result:", error);
		  }
		},
		deleteSemesterResult: async (semester) => {
			try {
				console.log(`Sending DELETE request for semester: ${semester}`);
				
				// Send a DELETE request to remove the result from the database
				const response = await axios.delete(
					`https://tint-scholar.onrender.com/api/students/delete-results/${semester}`,
					{
						withCredentials: true, // Include credentials for authentication
					}
				);
		
		
				// Check if the response indicates success
				if (response.data.success) {
					// Update the local state (or global store) to remove the deleted semester
					set((state) => ({
						user: {
							...state.user,
							results: state.user.results.filter(
								(result) => result.semester !== semester
							),
						},
					}));
					console.log(`Successfully deleted the results for semester: ${semester}`);
				} else {
					console.error("Failed to delete result:", response.data.message);
				}
			} catch (error) {
				// Log detailed error information
				if (error.response) {
					console.error("Server responded with an error:", error.response.data);
				} else if (error.request) {
					console.error("No response received from server:", error.request);
				} else {
					console.error("Error setting up the request:", error.message);
				}
			}
		},
		uploadProject: async (file, projectData) => {
			try {
			  console.log("File:", file); // Log the file
			  console.log("Project Data:", projectData); // Log the project data
		  
			  if (!projectData || typeof projectData !== "object") {
				throw new Error("Invalid project data.");
			  }
		   console.log(projectData)
			  const formData = new FormData();
			  formData.append("projectName", projectData.projectName||"");
			  formData.append("description", projectData.description || "");
			  formData.append("techStack", projectData.techStack);
			  formData.append("duration", projectData.duration);
			  formData.append("link", projectData.link);
			  formData.append('contributors',projectData.contributors);
			  formData.append("mentorId", projectData.mentorId);
		      
			  if (file) {
				formData.append("pdfFile", file);
			  }
		  
			  // Send POST request
			  const response = await axios.post(
				"http://localhost:5000/api/students/upload-project",
				formData,
				{
				  headers: {
					"Content-Type": "multipart/form-data",
				  },
				  withCredentials: true,
				}
			  );
		  
			  console.log("Upload successful:", response.data);
			  set({ projects: response.data });
			  return response.data;
			} catch (error) {
			  console.error("Error uploading project:", error.response?.data || error.message);
			  throw error;
			}
		  },
		  uploadHackathon : async (file, projectData) => {
			try {
			  console.log("File:", file); // Log the file
			  console.log("Project Data:", projectData); // Log the project data
	  
			  if (!projectData || typeof projectData !== "object") {
				throw new Error("Invalid project data.");
			  }
	  
			  const formData = new FormData();
			  formData.append("name", projectData.name || "");
			  formData.append("organizer", projectData.organizer || "");
			  formData.append("dates", projectData.dates || "");
			  formData.append("location", projectData.location || "");
			  formData.append("theme", projectData.theme || "");
			  formData.append("teamName", projectData.teamName || "");
			  formData.append("teamMembers", projectData.teamMembers || "");
			  formData.append("problemStatement", projectData.problemStatement || "");
			  formData.append("solutionConcept", projectData.solutionConcept || "");
			  formData.append("technologiesUsed", projectData.technologiesUsed || "");
			  formData.append("role", projectData.role || "");
			  formData.append("outcome", projectData.outcome || "");
			  formData.append("awards", projectData.awards || "");
	  
			  if (file) {
				formData.append("pdfFile", file);
			  }
	  
			  // Send POST request
			  const response = await axios.post(
				"http://localhost:5000/api/students/upload-hackathon",
				formData,
				{
				  headers: {
					"Content-Type": "multipart/form-data",
				  },
				  withCredentials: true,
				}
			  );
	  
			  console.log("Upload successful:", response.data);
			  return response.data;
			  
			} catch (error) {
			  console.error("Error uploading project:", error.response?.data || error.message);
			  throw error;
			}
		  },
		  
		  
		  // Function to delete project
		  deleteProject: async (projectId) => {
			try {
			  console.log(`Sending DELETE request for project: ${projectId}`);
			  
			  // Send a DELETE request to remove the project from the database
			  const response = await axios.delete(
				`http://localhost:5000/api/students/delete-projects/${projectId}`,
				{
				  withCredentials: true, // Include credentials for authentication
				}
			  );
			  if (response.status === 200) {
				set((state) => ({
				  projects: state.projects.filter((project) => project._id !== projectId),
				}
			  // Check if the response indicates success
			));
				console.log(`Successfully deleted the project with ID: ${projectId}`);
			  } else {
				console.error("Failed to delete project:", response.data.message);
			  }
			} catch (error) {
			  // Log detailed error information
			  if (error.response) {
				console.error("Server responded with an error:", error.response.data);
			  } else if (error.request) {
				console.error("No response received from server:", error.request);
			  } else {
				console.error("Error setting up the request:", error.message);
			  }
			}
		  },
		  

	addTeacher: async ( email, password, name, department,employeeId ) => {
		set({ isLoading: true, error: null });
		try {
			const response = await axios.post(`http://localhost:5000/api/admin/addTeacher`, { email, password, name, department,employeeId  });
			set({ teachers: response.data.user, isAuthenticated: true, isLoading: false });
		} catch (error) {
			set({ error: error.response.data.message || "Error signing up", isLoading: false });
			throw error;
		}
	},

	
	addStudent: async (email, password, name, branch, rollnumber, phnumber) => {
  set({ isLoading: true, error: null });
  try {
    const token = localStorage.getItem("authToken"); // Fetch token from localStorage or context
    const response = await axios.post(
      `http://localhost:5000/api/admin/addStudent`,
      { email, password, name, branch, rollnumber, phnumber },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    set({ users: response.data.user, isAuthenticated: true, isLoading: false });
  } catch (error) {
    set({
      error: error.response?.data?.message || "Error adding student",
      isLoading: false,
    });
    throw error;
  }
},

		  fetchTeacher: async () => {
			try {
			  const response = await axios.get("http://localhost:5000/api/teachers/getteacher");
			  set({ teachers: response.data });
			} catch (error) {
			  console.error("Error fetching teachers:", error);
			}
		  },
		
		  fetchStudent: async () => {
			try {addStudent
			  const response = await axios.get("http://localhost:5000/api/students/users");
			  set({ users: response.data });
			} catch (error) {
			  console.error("Error fetching students:", error);
			}
		  },
		  fetchProjects: async () => {
			try {
			  const response = await axios.get("http://localhost:5000/api/students/projects"); // Replace with your actual API endpoint
			  set({ projects: response.data });
			} catch (error) {
			  console.error("Failed to fetch projects:", error);
			}
		  },
		  fetchHackathon: async () => {
			try {
				
			  const response = await axios.get("http://localhost:5000/api/students/hackathon",{
			
				withCredentials: true,  // Proper placement inside the options object
			  });
			  set({ hackathons: response.data });  // Update the hackathons state with the fetched data
			} catch (error) {
			  console.error("Error fetching Hackathons:", error);
			}
		  },
		   
		  deleteHackathon: async (id) => {
			try {
			  console.log(`Sending DELETE request for project: ${id}`);
			  
			  // Send a DELETE request to remove the project from the database
			  const response = await axios.delete(
				`http://localhost:5000/api/students/delete-hackathon/${id}`,
				{
				  withCredentials: true, // Include credentials for authentication
				}
			  );
			  if (response.status === 200) {
				set((state) => ({
				  hackathons: state.hackathons,
				}
			  // Check if the response indicates success
			));
				console.log(`Successfully deleted the project with ID: ${projectId}`);
			  } else {
				console.error("Failed to delete project:", response.data.message);
			  }
			} catch (error) {
			  // Log detailed error information
			  if (error.response) {
				console.error("Server responded with an error:", error.response.data);
			  } else if (error.request) {
				console.error("No response received from server:", error.request);
			  } else {
				console.error("Error setting up the request:", error.message);
			  }
			}
		  },

		  deleteStudnet:async(id)=>{
			try {
				console.log(`Sending DELETE request for project: ${id}`);
				
				// Send a DELETE request to remove the project from the database
				const response = await axios.delete(
				  `http://localhost:5000/api/admin/delete-students/${id}`,
				  {
					withCredentials: true, // Include credentials for authentication
				  }
				);
				if (response.status === 200) {
				  set((state) => ({
					users: state.users,
				  }
				// Check if the response indicates success
			  ));
				  console.log(`Successfully deleted the project with ID: ${id}`);
				} else {
				  console.error("Failed to delete project:", response.data.message);
				}
			  } catch (error) {
				// Log detailed error information
				if (error.response) {
				  console.error("Server responded with an error:", error.response.data);
				} else if (error.request) {
				  console.error("No response received from server:", error.request);
				} else {
				  console.error("Error setting up the request:", error.message);
				}
			  }

		  },

uploadPublication: async (newPublication) => {
  set({ isLoading: true, error: null });

  const { title, journal, year } = newPublication; // ✅ Destructure the values

  try {


    const response = await axios.post(
      `http://localhost:5000/api/teachers/publication/add`,
      { title, journal, year },
      {
		withCredentials: true,
      
      }
    );

    set((state) => ({
      publications: [...(state.publications || []), response.data],
      isLoading: false,
    }));
  } catch (error) {
    set({
      error: error.response?.data?.message || "Error uploading publication",
      isLoading: false,
    });
    throw error;
  }
},



getPublications: async () => {
  set({ isLoading: true, error: null });
  try {
    const response = await axios.get(
      `http://localhost:5000/api/teachers/publication/get`,
      {
		withCredentials: true,
       
      }
    );

    set({
      publications: response.data,
      isLoading: false,
    });
  } catch (error) {
    set({
      error: error.response?.data?.message || "Error fetching publications",
      isLoading: false,
    });
    throw error;
  }
},


deletePublication: async (pubId) => {
  set({ isLoading: true, error: null });
  try {
    
    await axios.delete(
      `http://localhost:5000/api/teachers/delete-publication/${pubId}`,
      {
		withCredentials: true,
       
      }
    );

    // Remove from state
    set((state) => ({
      publications: (state.publications || []).filter((p) => p._id !== pubId),
      isLoading: false,
    }));
  } catch (error) {
    set({
      error: error.response?.data?.message || "Error deleting publication",
      isLoading: false,
    });
    throw error;
  }
},

getAllPublications: async () => {
  set({ isLoading: true, error: null });
  try {
    const response = await axios.get(
      `http://localhost:5000/api/admin/publication/all`,
      {
		withCredentials: true,
       
      }
    );

    set({
      Allpublications: response.data,
      isLoading: false,
    });
  } catch (error) {
    set({
      error: error.response?.data?.message || "Error fetching publications",
      isLoading: false,
    });
    throw error;
  }
},

uploadMarks: async ({ subject, semester, internal, file }) => {
  set({ isLoading: true, error: null });
  try {
    const formData = new FormData();
    formData.append("subject", subject);
    formData.append("semester", semester);
    formData.append("internal", internal);
    formData.append("file", file);

    const response = await axios.post(
      `http://localhost:5000/api/teachers/uploadmarks`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    set({ isLoading: false });
    return response.data; // success response, optionally return it
  } catch (error) {
    set({
      error: error.response?.data?.message || "Upload failed",
      isLoading: false,
    });
    throw error;
  }
},
getResults: async (semester, internalNumber,rollnumber) => {
  set({ isLoading: true, error: null });

  try {
     // Get the user and token from the store

    if ( !rollnumber) {
      set({ error: 'User not logged in or rollNumber missing', isLoading: false });
      return;
    }

    const response = await axios.get(
      `http://localhost:5000/api/students/internal-results`, // Your API endpoint for internal results
      {
        params: {
          rollNumber: rollnumber,  // Send roll number from user object
          semester,  // Semester parameter
          internalNumber: internalNumber, // Remove 'CA' prefix
        },
       
        withCredentials: true,  // Ensure credentials (cookies) are included
      }
    );
    set({
      CAresults: response.data.data || [],
      isLoading: false,
    });
  } catch (error) {
    set({
      error: error.response?.data?.message || 'Error fetching internal results',
      isLoading: false,
    });
    throw error;
  }
},
getProjectsByContributor: async (userId) => {
  set({ isLoading: true, error: null });

  try {
    if (!userId) {
      set({ error: "User ID is missing", isLoading: false });
      return;
    }

    const response = await axios.get(
      `http://localhost:5000/api/admin/projects/byContributor/${userId}`, // Your backend endpoint
      {
        withCredentials: true, // Include credentials if needed
      }
    );

    console.log("Projects fetched:", response.data);

    set({
      studentProjects: response.data || [],
      isLoading: false,
    });
  } catch (error) {
    set({
      error: error.response?.data?.message || "Error fetching projects",
      isLoading: false,
    });
    throw error;
  }
},
getAllHackathon: async () => {
			try {
				
			  const response = await axios.get("http://localhost:5000/api/admin/hackathons",{
			
				withCredentials: true,  // Proper placement inside the options object
			  });
			  set({ AllHackathons: response.data }); 
			  // Update the hackathons state with the fetched data
			} catch (error) {
			  console.error("Error fetching Hackathons:", error);
			}
		  },
		   





		
		  // Add other actions like uploadProject, deleteProject, etc.
		}),
	)
		
	
	
	

	
	

		
