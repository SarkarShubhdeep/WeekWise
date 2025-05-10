"use client";

import React from "react";

interface TaskCardProps {
    title: string;
    datetime: string; // or use `Date` if needed
    onClick?: () => void;
    onDoubleClick?: () => void;
    className?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
    title,
    datetime,
    onClick,
    onDoubleClick,
    className = "",
}) => {
    return (
        <div
            className={`bg-white border border-gray-100 px-2 py-2 text-gray-900 rounded-md hover:shadow-md hover:-translate-y-0.5 hover:border-transparent transition-all duration-100 ${className}`}
            onClick={onClick}
            onDoubleClick={onDoubleClick}
        >
            <div className="leading-5">{title}</div>
            <div className="text-xs text-blue-600 mt-1">{datetime}</div>
        </div>
    );
};

export default TaskCard;
