import express from "express";
import { Teacher } from "../models/Teacher.js";
import { verifyToken } from "../middleware/verifyToken.js";
import{projectsDelete} from "../Controler/studentControlar.js"

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
   

export default router;