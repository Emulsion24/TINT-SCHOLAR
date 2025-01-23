import mongoose from "mongoose";

const resultSchema = new mongoose.Schema({
    semester: {
      type: Number,
      required: true,
      enum: [1, 2, 3, 4, 5, 6, 7, 8], 
    },
    averageCGPA: {
      type: Number,
      required: true,
      min: 0,
      max: 10, 
    },
    pdflink: {
      type: String, 
      required: true,
    },
  });
 
  



const userSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true,
    },
    name:{
        type:String,
        required:true,
    },
    rollnumber:{
        type:String,
        required:true,
        unique:true,
    },
    branch:{
        type:String,
        required:true,
    },
    phnumber:{
        type:String,
        required:true,
        unique:true,
    },
    profilePhoto:{
         type:String,
         
    },
    results: [resultSchema],
    role:{
        type:String,
        enum:["student","teacher","admin"],
        default:"student",
    },
    hackathons: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Hackathon", // Reference to the Hackathon model
        },
      ],
    
    lastlogin:{
        type:Date,
        default:Date.now,
    },
    isVerified:{
        type:Boolean,
        default:false,
    },
        resetPasswordToken: String,
		resetPasswordExpiresAt: Date,
		verificationToken: String,
		verificationTokenExpiresAt: Date,

},{timestamps:true});
export const User=mongoose.model('User',userSchema);
