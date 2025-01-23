import express from "express";
import { uploadProfilePhoto,updateProfilePhoto,uploadnypdf, addSemResult, resultDelete, addProject ,projectsDelete,getprojects,addHackathon,hackathonDelete,getHackathon} from "../Controler/studentControlar.js";
import { verifyToken } from "../middleware/verifyToken.js";
import { User } from "../models/User.js";
import { Teacher } from "../models/Teacher.js";
import { Project } from "../models/Projects.js";
import { uploadpdf } from "../middleware/multer.js";

const router = express.Router();

router.post('/upload-profile-photo',verifyToken,uploadProfilePhoto, updateProfilePhoto);
router.post('/upload-results',verifyToken,uploadnypdf,addSemResult);
router.delete('/delete-results/:semester',verifyToken,resultDelete);
router.post('/upload-project',verifyToken,uploadnypdf,addProject);
router.get("/users",verifyToken, async (req, res) => {
    try {
      // Fetch only `_id` and `name` from User collection
      const users = await User.find({}, "_id name");
      res.status(200).json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users." });
    }
  });
  router.get("/projects",verifyToken,getprojects );
router.delete('/delete-projects/:projectId',verifyToken,projectsDelete);


router.post('/upload-hackathon',verifyToken,uploadpdf.single('pdfFile'),addHackathon);
router.get('/hackathon',verifyToken,getHackathon );
router.delete('/delete-hackathon/:id',verifyToken,hackathonDelete);



  



export default router;
