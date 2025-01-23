import express from "express";
import { verifyToken } from "../middleware/verifyToken.js";
import { login, logout, signup,verifyemail,forgotPassword,resetpassword,checkAuth } from "../Controler/controlar.js";
const router=express.Router();

router.get("/check-auth",verifyToken,checkAuth);

router.post("/signup",signup);
router.post("/login",login);
router.post("/logout",logout);
router.post("/verifyEmail",verifyemail);
router.post("/forgot-password",forgotPassword);
router.post("/reset-password/:Token",resetpassword);

export default router;