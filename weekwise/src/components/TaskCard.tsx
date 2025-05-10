"use client";

import React from "react";

interface TaskCardProps {
    title: string;
    datetime?: string; // or use `Date` if needed
    is_completed?: boolean;
    onClick?: () => void;
    onDoubleClick?: () => void;
    className?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
    title,
    datetime,
    onClick,
    onDoubleClick,
    is_completed,
    className = "",
}) => {
    return (
        <div
            className={`bg-white border-1 border-gray-100 px-2 py-2 rounded-md hover:shadow-md 
                hover:-translate-y-0.5 hover:border-transparent transition-all duration-100 
                cursor-pointer ${
                    is_completed
                        ? "opacity-60 line-through text-gray-500"
                        : "opacity-100"
                }`}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
        >
            <div className="leading-5">{title}</div>
            <div className="text-xs text-blue-600 mt-1">{datetime}</div>
        </div>
    );
};

export default TaskCard;
