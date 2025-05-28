import mongoose from 'mongoose';
import fs from 'fs';
import { User } from '../models/User.js';
import{Project} from '../models/Projects.js';
import { Teacher } from '../models/Teacher.js';
import { Hackathon } from '../models/Hackathon.js';
import { uploadphoto,uploadpdf } from '../middleware/multer.js'; 
import cloudinary from '../cloudinaryConfig.js'; 
import InternalResults from '../models/InternalResults.js';
const { ObjectId } = mongoose.Types;


export const uploadProfilePhoto = uploadphoto.single('profilePhoto'); // 'profilePhoto' is the field name in the frontend form
export const uploadnypdf=uploadpdf.single('pdfFile');
// Controller to handle updating the student's profile with the uploaded photo
export const updateProfilePhoto = async (req, res) => {
  try {
    
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    // Upload the file to Cloudinary
    const uploadResult = await cloudinary.uploadCloudinary(req.file.path); // Upload the file to Cloudinary

    if (!uploadResult) {
      return res.status(500).json({ message: 'Error uploading file to Cloudinary' });
    }

    // Get the URL of the uploaded image from Cloudinary
    const photoUrl = uploadResult.secure_url;
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }


    user.profilePhoto = photoUrl;
    console.log('Updated user object:', user);

    
    await user.save();
    fs.unlink(req.file.path, (err) => {
        if (err) {
          console.error('Error deleting file:', err);
        } else {
          console.log('Local file deleted:', req.file.path);
        }
      });

    return res.status(200).json({
        message:"Photo Updated Successfully",
        user: user,
        profilePhoto: user.profilePhoto,
    });
  } catch (error) {
    console.error('Error saving user in MongoDB:', error);
    return res.status(500).json({ message: 'Server error while uploading profile photo' });
  }
};

export const addSemResult= async (req,res)=>{
    try {
        // Check if the file is uploaded
        if (!req.file) {
          return res.status(400).json({ message: 'No file uploaded' });
        }
    
        // Upload the file to Cloudinary
        const uploadResult = await cloudinary.uploadCloudinary(req.file.path,{
          resource_type: "auto",
        }); // Upload the file to Cloudinary
        if (!uploadResult) {
          return res.status(500).json({ message: 'Error uploading file to Cloudinary' });
        }
    
        // Get the URL of the uploaded image from Cloudinary
        const pdfUrl = uploadResult.secure_url;
        
        // Extract semester and CGPA from the request body
        const { semester, averageCGPA } = req.body;
    
        // Validate required fields
        if (!semester || !averageCGPA) {
          return res.status(400).json({ message: 'Semester and Average CGPA are required' });
        }
    
        // Find the user by userId (make sure userId is part of the request, e.g. from authentication middleware)
        const user = await User.findById(req.userId);
        if (!user) {
          return res.status(404).json({ message: 'User not found' });
        }
    
        // Ensure the results field is initialized as an array if it's not already
        if (!user.results) {
          user.results = []; // Initialize results array if not present
        }
    
        // Add the new semester result to the user's results array
        user.results.push({
          pdflink: pdfUrl,
          semester: semester,
          averageCGPA: averageCGPA
        });
    
        console.log('Updated user object:', user);
    
        // Save the updated user to the database
        await user.save();
    
        // Send success response before deleting the file
        return res.status(200).json({
          success: true,
          message: "Result Uploded Successfully",
          user: user,
          
        });
    
      } catch (error) {
        console.error('Error saving user in MongoDB:', error);
        return res.status(500).json({ message: 'Server error while uploading Result' });
      } finally {
        // Ensure file is deleted even if there's an error
        if (req.file && req.file.path) {
          fs.unlink(req.file.path, (err) => {
            if (err) {
              console.error('Error deleting file:', err);
            } else {
              console.log('Local file deleted:', req.file.path);
            }
          });
        }
      }
};

export const resultDelete = async (req, res) => {
  const { semester } = req.params;
  const userId = req.userId;

  console.log('User ID from token:', userId); // Debugging log
  console.log('Semester to delete:', semester); // Debugging log

  try {
      const semesterNumber = parseInt(semester, 10); // Ensure data type consistency
      const user = await User.findOneAndUpdate(
          { _id: userId },
          { $pull: { results: { semester: semesterNumber } } }, // Use the correct data type
          { new: true }
      );

      if (!user) {
          console.log('User not found for ID:', userId); // Log if no user found
          return res.status(404).json({ success: false, message: 'User not found.' });
      }

      return res.status(200).json({
          success: true,
          message: `Results for semester ${semesterNumber} have been deleted.`,
          user,
      });
  } catch (error) {
      console.error('Error deleting semester result:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while deleting the result.' });
  }
};


export const addProject = async (req, res) => {
  try {
    const {
      projectName,
      description,
      techStack,
      status = "Active",
      mentorId,
      contributors, // Default to an empty array
      link,
    } = req.body;

    console.log(contributors);
    console.log(typeof contributors);

    // Split contributors string into an array of ObjectIds
    const contributorsArray = contributors.split(',').map(id => new mongoose.Types.ObjectId(id.trim()));

    console.log(contributorsArray);
    console.log(typeof contributorsArray); // Should be an array of ObjectIds

    // Ensure all contributor IDs are valid ObjectIds
    const validContributors = await User.find({
      _id: { $in: contributorsArray },
    });

    if (validContributors.length !== contributorsArray.length) {
      return res.status(400).json({ message: "Invalid contributor IDs provided." });
    }

    // Validate mentor
    const mentor = await Teacher.findById(mentorId);
    if (!mentor) {
      return res.status(404).json({ message: "Mentor not found." });
    }

    // Create new project
    const newProject = new Project({
      projectName,
      description,
      techStack: techStack.split(",").map((tech) => tech.trim()),
      status,
      mentor: mentor._id,
      contributors: contributorsArray, // Use contributorsArray here
      projectLink: link,
    });

    // Handle file upload to Cloudinary
    if (req.file) {
      const uploadResult = await cloudinary.uploadCloudinary(req.file.path, {
        resource_type: "auto",
      });
      newProject.pdfLink = uploadResult.secure_url;
    }

    // Save the project
    await newProject.save();
    fs.unlink(req.file.path, (err) => {
          if (err) {
            console.error('Error deleting file:', err);
          } else {
            console.log('Local file deleted:', req.file.path);
          }
        });
    res.status(201).json({ message: "Project created successfully.", project: newProject });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ message: "Error creating project." });
  }
};
export const projectsDelete = async (req, res) => {
  const {projectId} = req.params;
  

  console.log('User ID from token:',projectId); // Debugging log
   // Debugging log

  try {
      // Ensure data type consistency
      const projects = await Project.deleteOne(
          { _id:projectId },
          
      );

      if (!projects) {
          console.log('User not found for ID:', projectId); // Log if no user found
          return res.status(404).json({ success: false, message: 'User not found.' });
      }

      return res.status(200).json({
          success: true,
          message: `Project have been deleted.`,
          projects,
      });
  } catch (error) {
      console.error('Error deleting semester result:', error);
      return res.status(500).json({ success: false, message: 'An error occurred while deleting the result.' });
  }
};
export const getprojects=async (req, res) => {
    try {
      const projects = await Project.find()
        .populate("mentor", "name _id") // Fetch mentor name and ID
        .populate("contributors", "name _id"); // Fetch contributors' names and IDs
      res.status(200).json(projects);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch projects" });
    }
};

export const addHackathon = async (req, res) => {
  try {
    const {
      name,
      organizer,
      dates,
      location,
      theme,
      teamName,
      teamMembers,
      problemStatement,
      solutionConcept,
      technologiesUsed,
      role,
      outcome,
      awards,
    } = req.body;

    let certificateUrl = ""; // Default value in case no file is uploaded

    // Check if a file is provided
    if (req.file) {
      try {
        const uploadResult = await cloudinary.uploadCloudinary(req.file.path, {
          resource_type: "auto",
        });
        certificateUrl = uploadResult.secure_url; // Set the certificate URL if upload is successful
      } catch (uploadError) {
        console.error("Error uploading file to Cloudinary:", uploadError);
        return res.status(500).json({ message: "File upload failed" });
      }
    }

    // Create new hackathon object with the received data
    const newHackathon = new Hackathon({
      name,
      organizer,
      dates,
      location,
      theme,
      teamName,
      teamMembers,
      problemStatement,
      solutionConcept,
      technologiesUsed,
      role,
      outcome,
      awards,
      certificate: certificateUrl, // Store the certificate URL if uploaded
    });

    // Save the hackathon in the database
    const savedHackathon = await newHackathon.save();

    // Assuming you're associating hackathons with a user
    const user = await User.findById(req.userId); // Assuming the user is authenticated
    if (user) {
      user.hackathons.push(savedHackathon._id);
      await user.save();
    } else {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(201).json(savedHackathon);
  } catch (err) {
    console.error("Error adding hackathon:", err);
    res.status(500).json({ message: err.message });
  }
};
export const getHackathon = async (req, res) => {
  const userId = req.userId;

  try {
    // 1. Validate User ID
    if (!userId) {
      return res.status(400).json({ message: 'User ID is missing or invalid' });
    }

    // 2. Retrieve user and their hackathon IDs in one query
    const user = await User.findById(userId).select('hackathons');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const hackathonIds = user.hackathons;
    if (!hackathonIds || hackathonIds.length === 0) {
      return res.status(404).json({ message: 'No hackathons found for this user' });
    }

    // 3. Fetch hackathon details by IDs
    const hackathons = await Hackathon.find({ '_id': { $in: hackathonIds } });
    if (hackathons.length === 0) {
      return res.status(404).json({ message: 'No hackathons found for the given IDs' });
    }

    // 4. Return hackathon data
    return res.status(200).json(hackathons);

  } catch (err) {
    console.error('Error fetching hackathons:', err);
    return res.status(500).json({ message: 'Server error. Please try again later.' });
  }
};



export const hackathonDelete=async (req, res) => {
  try {
    const hackathon = await Hackathon.findByIdAndDelete(req.params.id);
    if (!hackathon) return res.status(404).json({ message: "Hackathon not found" });

    // Remove the hackathon from the user's list of hackathons
    const user = await User.findById(req.user.id);
    user.hackathons = user.hackathons.filter(
      (hackathonId) => hackathonId.toString() !== req.params.id
    );
    await user.save();

    res.status(200).json({ message: "Hackathon deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getInternalResults = async (req, res) => {
  const { rollNumber, semester, internalNumber } = req.query;

  // Validate required parameters
  if (!rollNumber || !semester || !internalNumber) {
    return res.status(400).json({
      success: false,
      message: "Missing required query parameters: rollNumber, semester, or internalNumber",
    });
  }
console.log(rollNumber);
  try {
    // Query the database for the internal results
    const results = await InternalResults.find({
      rollNumber,
      semester: Number(semester), // Convert to number for consistency
      internalNumber,
    }); // Populating mentor info, assuming mentor is a reference to another model (if required)

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No results found for the given parameters",
      });
    }

    // Respond with the fetched data
    res.status(200).json({
      success: true,
      data: results,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching internal results",
    });
  }
  
};



