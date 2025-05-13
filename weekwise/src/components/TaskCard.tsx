"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";

interface TaskCardProps {
    id: string;
    title: string;
    date?: string;
    time?: string;
    description?: string;
    isCompleted?: boolean;
    showCheckbox?: boolean;
    onDoubleClick?: () => void;
    onCheckboxToggle?: () => void;
    onExpand?: (rect: DOMRect) => void;
    className?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({
    id,
    title,
    date,
    time,
    description,
    isCompleted,
    showCheckbox = false,
    onDoubleClick,
    onCheckboxToggle,
    onExpand,
    className = "",
}) => {
    const cardRef = React.useRef<HTMLDivElement | null>(null);

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (onExpand && cardRef.current) {
            const rect = cardRef.current.getBoundingClientRect();
            onExpand(rect);
        }
    };

    return (
        <motion.div
            layoutId={`task-${id}`}
            className="your-task-card-wrapper-class"
            onClick={(e) => {
                const rect = e.currentTarget.getBoundingClientRect();
                onExpand?.(rect);
            }}
        >
            <div
                ref={cardRef}
                className={`${className} bg-white border-1 border-gray-100 px-3 py-2 rounded-md hover:shadow-md 
                hover:-translate-y-0.5 hover:border-transparent transition-all duration-100 
                cursor-pointer flex gap-3 items-start`}
                onClick={handleClick}
                onDoubleClick={onDoubleClick}
            >
                <input
                    type="checkbox"
                    checked={isCompleted}
                    onChange={onCheckboxToggle}
                    onClick={(e) => e.stopPropagation()}
                    className="mt-1 h-4 w-4 text-primary-500"
                />

                <div
                    className={`flex-1 space-y-2 ${
                        isCompleted
                            ? "opacity-60 line-through text-gray-500"
                            : "opacity-100"
                    }`}
                >
                    <div className="font-medium">{title}</div>
                    <div className="space-y-1 text-blue-600">
                        <div className="text-xs">{time}</div>
                        <div className="text-xs">{date}</div>
                    </div>

                    {description && (
                        <div className="text-xs text-gray-700 mt-1">
                            {description}
                        </div>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default TaskCard;
