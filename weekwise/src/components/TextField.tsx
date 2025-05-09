"use client";

import React from "react";

interface TextFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className?: string;
}

const TextField: React.FC<TextFieldProps> = ({ className = "", ...props }) => {
    return (
        <input
            className={`rounded-xl p-2 px-3 border border-gray-200 w-full ${className}`}
            {...props}
        />
    );
};

export default TextField;
