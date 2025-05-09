"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    children: React.ReactNode;
    className?: string;
}

const Button: React.FC<ButtonProps> = ({ children, className }) => {
    return (
        <button
            className={`${className} px-4 py-2 rounded-xl font-medium transition-colors duration-150 bg-gray-800 text-white hover:bg-gray-600 `}
        >
            {children}
        </button>
    );
};

export default Button;
