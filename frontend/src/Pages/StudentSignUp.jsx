import React, { useState } from 'react'
import { motion } from "framer-motion";
import Input from '../component/Input.jsx';
import PasswordStrengthMeter from '../component/PasswordStrengthMeter';
import {Loader,Contact, Lock, Mail, University, User} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import{useAuthStore} from "../store/authStore";

function StudentSignUp() {
    const [name,setName]=useState('');
    const [phnumber,setPhnumber]=useState('');
    const [rollnumber,setRollnumber]=useState('');
    const [email,setEmail]=useState('');
    const [branch,setBranch]=useState('');
    const [password,setPassword]=useState('');
    const { signup, error, isLoading } = useAuthStore();
    const navigate=useNavigate();
    const handleSignup=async(e)=> {
      e.preventDefault();
    
		try {
			await signup(email, password,name,rollnumber,branch,phnumber);
       
			navigate("/verify-email");
		} catch (error) {
			console.log(error);
		}
	};


  return (
    <motion.div initial={{ opacity: 0, y: 10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
    className=' mt-24 max-w-fit w-full bg-gray-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl 
    overflow-hidden flex flex-col  '
    >
               <div className='p-8' >
               <h2 className='text-3xl font-bold mb-6 text-center bg-gradient-to-r from-green-400 to-emerald-500 text-transparent bg-clip-text'>
					Create Account
				</h2>
 <form  className='grid grid-cols-2 gap-4'>
                    <Input
                    icon={User}
                    type='text'
                    placeholder='Full Name'
                    value={name}
                    onChange={(e)=>setName(e.target.value)}/>
                    <Input
                    icon={Mail}
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}/>
                    
                    <Input
                    icon={Lock}
                    type='password'
                    placeholder='password'
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}/>

                  
                      <Input
                    icon={University}
                    type='text'
                    placeholder='University Roll No.'
                    value={rollnumber}
                    onChange={(e)=>setRollnumber(e.target.value)}/>
                     <Input
                    icon={Contact}
                    type='text'
                    placeholder='Mobile No.'
                    value={phnumber}
                    
                    onChange={(e)=>setPhnumber(e.target.value)}/>
                    
                    
                      <div className="relative mb-4">
                        <select
                            value={branch}
                            onChange={(e) =>
                              
                              setBranch(e.target.value)}
                        className='w-full pl-10 pr-3 py-2 bg-gray-800 bg-opacity-50 rounded-lg border border-gray-700 focus:border-green-500 focus:ring-2 focus:ring-green-500 text-white placeholder-gray-400 transition duration-200'

                        >
                            <option value="" disabled>Select Branch</option>
                            <option value="CSE">Computer Science</option>
                            <option value="ECE">Electronics & Communication</option>
                            <option value="EEE">Electrical & Electronics</option>
                            <option value="MECH">Mechanical Engineering</option>
                            <option value="CIVIL">Civil Engineering</option>
                            <option value="CSBS">CSBS</option>
                            <option value="AIML">AIML</option>
                            <option value="DDS">DATA Science</option>

                            
                        </select>
                    </div>
 </form>

                
 <motion.button
  className='mt-5 w-full py-3 px-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white 
  font-bold rounded-lg shadow-lg hover:from-green-600
  hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2
  focus:ring-offset-gray-900 transition duration-200'
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  type='submit'
  disabled={isLoading}
  onClick={handleSignup}
>
  {isLoading ? <Loader className='animate-spin mx-auto' size={24} /> : 'Sign Up'}
</motion.button>
                
  </div> 

				
                {error && <p className='text-red-500 front-semibold mt-2'>{error}</p>}
            <PasswordStrengthMeter password={password} />
            <div className='px-8 py-4 bg-gray-900 bg-opacity-50 flex justify-center'>
				<p className='text-sm text-gray-400'>
					Already have an account?{" "}
					<Link to={"/login"} className='text-green-400 hover:underline'>
						Login
					</Link>
				</p>
	  </div>
				


</motion.div>

    

    
  )
}

export default StudentSignUp;
