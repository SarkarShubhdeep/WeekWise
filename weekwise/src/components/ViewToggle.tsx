"use client";

import { motion } from "framer-motion";
import React from "react";

interface ViewToggleProps {
    current: "week" | "all";
    onToggle: (view: "week" | "all") => void;
}

export default function ViewToggle({ current, onToggle }: ViewToggleProps) {
    return (
        <div className="relative w-50 py-2 flex rounded-full bg-gray-200 text-sm font-medium overflow-hidden">
            {["all", "week"].map((view) => (
                <button
                    key={view}
                    onClick={() => onToggle(view as "week" | "all")}
                    className={`w-full z-10 transition-colors duration-150 ${
                        current === view ? "text-white" : "text-gray-800"
                    }`}
                >
                    {view === "week" ? "Week View" : "All Tasks"}
                </button>
            ))}

            <motion.div
                layout
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className="absolute top-0 bottom-0 w-1/2 bg-primary-500 rounded-full"
                style={{
                    left: current === "all" ? "0%" : "50%",
                }}
            />
        </div>
    );
}
