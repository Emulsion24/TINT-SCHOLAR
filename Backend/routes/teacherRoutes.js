import express from "express";
import { Teacher } from "../models/Teacher.js";
import { verifyToken } from "../middleware/verifyToken.js";
import{projectsDelete} from "../Controler/studentControlar.js"
import { addPublication,getPublications,deletePublication,uploadexcelfile,uploadMarks } from "../Controler/teacherControlar.js";
import { excelfile } from "../middleware/multer.js";

const router=express.Router();

router.get("/getteacher",verifyToken, async (req, res) => {
    try {
      // Fetch only `_id` and `name` from Teacher collection
      const teachers = await Teacher.find({}, "_id name");
      res.status(200).json(teachers);
    } catch (error) {
      console.error("Error fetching teachers:", error);
      res.status(500).json({ message: "Failed to fetch teachers." });
    }
  });
  router.delete('/delete-projects/:projectId',verifyToken,projectsDelete);
  router.post('/publication/add',verifyToken,addPublication);
   router.post('/uploadmarks',verifyToken,uploadexcelfile,uploadMarks);
  router.get('/publication/get',verifyToken,getPublications);
  router.delete('/delete-publication/:pubId',verifyToken,deletePublication);
   

export default router;