"use client";

import React from "react";

interface TaskCardProps {
    title: string;
    date?: string;
    time?: string;
    description?: string;
    isCompleted?: boolean;
    showCheckbox?: boolean;
    onClick?: () => void;
    onDoubleClick?: () => void;
    onCheckboxToggle?: () => void;
    className?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
    title,
    date,
    time,
    description,
    isCompleted,
    showCheckbox = false,
    onClick,
    onDoubleClick,
    onCheckboxToggle,
    className = "",
}) => {
    return (
        <div
            className={`${className} bg-white border-1 border-gray-100 px-3 py-2 rounded-md hover:shadow-md 
                hover:-translate-y-0.5 hover:border-transparent transition-all duration-100 
                cursor-pointer flex gap-3 items-start `}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
        >
            {showCheckbox && (
                <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={onCheckboxToggle}
                    onClick={(e) => e.stopPropagation()} // prevent parent click
                    className="mt-1 h-4 w-4 text-primary-500"
                />
            )}

            <div
                className={`flex-1 ${
                    isCompleted
                        ? "opacity-60 line-through text-gray-500"
                        : "opacity-100"
                }`}
            >
                <div className=" font-medium">{title}</div>

                {(date || time) && (
                    <div className="text-xs text-blue-600 mt-1">
                        {[date, time].filter(Boolean).join(" • ")}
                    </div>
                )}

                {description && (
                    <div className="text-xs text-gray-400 mt-1 line-clamp-2">
                        {description}
                    </div>
                )}
            </div>
        </div>
    );
};

export default TaskCard;
