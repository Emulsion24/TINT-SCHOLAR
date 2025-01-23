import express from 'express';
import { User } from '../models/User.js';
import { isAdmin } from '../middleware/isAdmin.js';
import { getuser,getteacher,addTeacher,deleteStudent } from '../Controler/adminControlar.js';

const router = express.Router();

// Admin route to get all users

    router.get('/users',isAdmin,getuser);
    router.get('/teachers',isAdmin,getteacher);
    router.post('/addTeacher',isAdmin,addTeacher);
    router.delete('/delete-students/:id',isAdmin,deleteStudent);


export default router;
