import { User } from "../models/User.js";
import { Teacher} from "../models/Teacher.js";
import { generateTokenAndSetCookie } from "../utlis/genarateTokenAndSecretCookie.js";
import { sendVerificationCode,sendRestEmail ,sendWelcomeEmail} from "../mailTrap/emails.js";
import bcryptjs from "bcryptjs";






export const signup = async (req, res) => {
  const { email, password, name, rollnumber,branch, phnumber } = req.body;

  try {
    // Check for missing fields
    if (!email || !password || !name || !phnumber || !branch || !rollnumber) {
      return res.status(600).json({ success: false, message: "All fields are required" });
    }

    // Check if the user already exists
    const userAlreadyExists = await User.findOne({ email });
    if (userAlreadyExists) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    // Hash the password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Generate a verification code
    const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

    // Create a new user instance
    const user = new User({
      email,
      password: hashedPassword,
      name,
      rollnumber,
      branch,
      phnumber,
      verificationToken,
      verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours from now
    });

    // Save the user to the database
    await user.save();

    // Generate a JWT token and set it as a cookie
    generateTokenAndSetCookie(res, user._id);
    sendVerificationCode(user.email,verificationToken);

    // Send a success response
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        ...user._doc,
        password: undefined, // Remove the password from the response
      },
    });
  } catch (error) {
    // Handle any errors
    res.status(400).json({ success: false, message: error.message });
  }
};


export const verifyemail = async (req, res) => {
	const { code } = req.body;
	try {
		const user = await User.findOne({
			verificationToken: code,
			verificationTokenExpiresAt: { $gt: Date.now() },
		});

		if (!user) {
			return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
		}

		user.isVerified = true;
		user.verificationToken = undefined;
		user.verificationTokenExpiresAt = undefined;
		await user.save();

		await sendWelcomeEmail(user.email, user.name);

		res.status(200).json({
			success: true,
			message: "Email verified successfully",
			user: {
				...user._doc,
				password: undefined,
			},
		});
	} catch (error) {
		console.log("error in verifyEmail ", error);
		res.status(500).json({ success: false, message: "Server error" });
	}
};



export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Try finding the user first
        let user = await User.findOne({ email });
        let isPasswordValid = false;

        // If no user is found, check for teacher
        if (!user) {
            user = await Teacher.findOne({ email });
            if (!user) {
                return res.status(400).json({ success: false, message: "Invalid credentials" });
            }
        }

        // Compare the password for the found user (either student or teacher)
        isPasswordValid = await bcryptjs.compare(password, user.password);

        if (!isPasswordValid) {
            return res.status(400).json({ success: false, message: "Invalid credentials" });
        }

        // Check if the user/teacher is verified
        if (!user.isVerified) {
            return res.status(400).json({ success: false, message: "Please verify your email first" });
        }

        // Generate token and set it in cookies
        generateTokenAndSetCookie(res, user._id);

        // Update last login timestamp
        user.lastlogin = new Date();
        await user.save();

        // Check if the logged-in user is a teacher or student
        const isTeacher = user instanceof Teacher; // Check if user is a teacher

        // Return the response with both user and teacher data if it's a teacher, else just user data
        return res.status(200).json({
            success: true,
            message: "Logged in successfully",
            user: {
                ...user._doc,
                password: undefined, // Exclude the password
            },
            teacher: isTeacher ? user : null, // Include teacher data if it's a teacher
        });
    } catch (error) {
        console.log("Error in login:", error);
        return res.status(400).json({ success: false, message: error.message });
    }
};




export const logout=async(req,res)=>{
    res.clearCookie("token"
    );
    res.status(200).json({
      sucess:true,
      message:"Logout Successfully"
    })
};

export const forgotPassword=async(req,res)=>{
const {email}=req.body;
try {
	const user= await User.findOne({email})
	if(!user){
		return res.satus(400).json({
			success:false,
			message:"Email not found"
		})
	
	}
	const resetToken=crypto.randomBytes(25).toLocaleString("hex");
	const resetPasswordExpiresAt=Date.now()+1*60*60*1000; //1 hours
	user.resetPasswordToken=resetToken;
	user.resetPasswordExpiresAt=resetPasswordExpiresAt;
	await user.save();

	sendRestEmail(user.email,`http://5173/reset-password/${resetToken}`);
	res.status(200).json({success:true,message:"Password rest Email Send Successfully"})
} catch (error) {
	console.log("error forgot password",error);
	res.status(400).json({
		success:false,
		message:"error in forgot Password"
	});
}

};

export const resetpassword=async(req,res)=>{
	try {
		const {Token}=req.params;
		const{password}=req.body;
		const user= await User.findOne({
			resetPasswordToken:Token,
			resetPasswordExpiresAt:{$gt:Date.now()},

		})
		if(!user){
			res.status(400).json({
				success:false,
				message:"invalid reset password token",
			})
		}
		const NewPassword=await bcryptjs.hash(password,10);
		user.password=NewPassword;
		user.resetPasswordToken=undefined;
		user.resetPasswordExpiresAt=undefined;
		user.save();

		res.status(200).json({
			success:true,
			message:"Password Rest Successfully"
		})


	} catch (error) {
		console.log("Rest Password Failed",error);
		res.status(400).json({
			success:false,
			message:"reset password failed"
		})
	}
};

export const checkAuth = async (req, res) => {
	try {
	  // Check for the user first
	  const user = await User.findById(req.userId).select("-password");
	  
	  if (user) {
		return res.status(200).json({
		  success: true,
		  user
		});
	  }
  
	  // If no user found, check for the teacher
	  const teacher = await Teacher.findById(req.userId).select("-password");
  
	  if (!teacher) {
		return res.status(400).json({ success: false, message: "No user or teacher found" });
	  }
  
	  return res.status(200).json({
		success: true,
		teacher
	  });
  
	} catch (error) {
	  console.log("auth error", error);
	  return res.status(400).json({ success: false, message: error.message });
	}
  };
