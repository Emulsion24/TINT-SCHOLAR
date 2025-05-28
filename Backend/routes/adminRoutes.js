import express from 'express';
import { User } from '../models/User.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { getuser,getteacher,addTeacher,deleteStudent,addStudent,getAllPublications,getstudentProjects,getAllHackathon } from '../Controler/adminControlar.js';

const router = express.Router();

// Admin route to get all users

    router.get('/users',isAdmin,getuser);
    router.get('/teachers',isAdmin,getteacher);
    router.post('/addTeacher',isAdmin,addTeacher);
    router.post('/addStudent',isAdmin,addStudent);
    router.delete('/delete-students/:id',isAdmin,deleteStudent);
 router.get('/publication/all',isAdmin,getAllPublications);
 router.get("/projects/byContributor/:userId/",isAdmin,getstudentProjects);
  router.get('/hackathons',isAdmin,getAllHackathon);

export default router;
