

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

// Background image for the landing page
import backgroundImage from "../assets/academic-background.jpg";

function Landing() {
  const [hover, setHover] = useState(false);

  return (
    <div
      className="w-full h-screen bg-cover bg-center relative flex flex-col items-center justify-center"
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        height: "100vh",
      }}
    >
      {/* Adding a dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>

      <motion.h1
        className="text-white text-6xl sm:text-7xl font-extrabold z-10"
        initial={{ opacity: 0, scale: 1.2 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.8 }}
      >
        TINT SCHOLAR
      </motion.h1>

      <motion.div
        className="flex flex-col md:flex-row space-y-6 md:space-y-0 md:space-x-8 z-10 mt-12"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4, duration: 0.6 }}
      >
        {/* Login Button */}
        <motion.div
          className="w-44 h-14 bg-gradient-to-r from-blue-500 to-green-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl flex justify-center items-center cursor-pointer"
          whileHover={{ scale: 1.05, rotate: 5 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/login">Login</Link>
        </motion.div>

        {/* New User Button */}
        <motion.div
          className="w-44 h-14 bg-gradient-to-r from-purple-500 to-pink-500 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl flex justify-center items-center cursor-pointer"
          whileHover={{ scale: 1.05, rotate: -5 }}
          transition={{ duration: 0.3 }}
        >
          <Link to="/signup">New User</Link>
        </motion.div>
      </motion.div>

      {/* 3D Background animation */}
      <div className="absolute inset-0 z-0">
        <motion.div
          className="absolute w-24 h-24 bg-gradient-to-r from-green-400 to-blue-500 rounded-full opacity-50"
          animate={{
            x: ["-30vw", "30vw", "-30vw"],
            y: ["-30vh", "30vh", "-30vh"],
            scale: [1, 1.5, 1],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 6,
            ease: "easeInOut",
          }}
        ></motion.div>
        <motion.div
          className="absolute w-20 h-20 bg-gradient-to-r from-yellow-500 to-red-500 rounded-full opacity-30"
          animate={{
            x: ["-20vw", "20vw", "-20vw"],
            y: ["-20vh", "20vh", "-20vh"],
            scale: [1, 2, 1],
          }}
          transition={{
            repeat: Infinity,
            repeatType: "reverse",
            duration: 5,
            ease: "easeInOut",
          }}
        ></motion.div>
      </div>
    </div>
  );
}

export default Landing;
