"use client";

import React from "react";
import { motion } from "framer-motion";

interface ButtonProps {
  label: string;
  Icon: React.ComponentType<{ className?: string }>;
  onClick: () => void;
}

const Button: React.FC<ButtonProps> = ({ label, Icon, onClick }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="relative flex items-center justify-center w-full md:w-auto max-w-full px-6 py-3 bg-transparent text-white rounded-lg shadow-md transition-transform duration-300 overflow-hidden"
      onClick={onClick}
    >
      <div className="relative z-10 flex items-center justify-center space-x-2 cursor-pointer">
        <Icon className="w-6 h-6" />
        <span>{label}</span>
      </div>
      <motion.div
        className="absolute inset-0 rounded-lg"
        initial={{ borderWidth: 0 }}
        whileHover={{ borderWidth: 2 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        style={{
          borderColor: "white",
          borderStyle: "solid",
          borderImage: "linear-gradient(to right, white 0%, white 100%) 1",
          borderImageSlice: 1,
        }}
      />
    </motion.div>
  );
};

export default Button;