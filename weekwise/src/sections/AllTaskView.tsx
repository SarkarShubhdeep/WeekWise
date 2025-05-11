"use client";

import { useEffect, useState } from "react";
import TaskCard from "@/components/TaskCard";
import { supabase } from "@/lib/supabaseClient";

interface Task {
    id: string;
    title: string;
    description?: string;
    date?: string;
    time?: string;
    is_completed: boolean;
}

interface AllTaskViewProps {
    tasks: Task[];
    showDescriptions: boolean;
    showCompleted: boolean;
    sortBy: "date-asc" | "date-desc" | "title-asc";
    onToggleComplete: (id: string, newStatus: boolean) => void;
}

export default function AllTaskView({
    tasks,
    showDescriptions,
    showCompleted,
    sortBy,
    onToggleComplete,
}: AllTaskViewProps) {
    const sortedFilteredTasks = tasks
        .filter((task) => showCompleted || !task.is_completed)
        .sort((a, b) => {
            if (sortBy === "title-asc") {
                return a.title.localeCompare(b.title);
            } else if (sortBy === "date-desc") {
                return (b.date || "").localeCompare(a.date || "");
            }
            // default: date-asc
            return (a.date || "").localeCompare(b.date || "");
        });

    if (!sortedFilteredTasks.length) {
        return (
            <div className="text-sm text-gray-500 px-4 py-2">
                No tasks to show.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1 w-full scroll-auto overflow-visible bg-white/20 p-2">
            {sortedFilteredTasks.map((task) => (
                <TaskCard
                    className="max-w-[400px]"
                    key={task.id}
                    title={task.title}
                    date={task.date}
                    time={task.time}
                    description={
                        showDescriptions ? task.description : undefined
                    }
                    isCompleted={task.is_completed}
                    showCheckbox={true}
                    onCheckboxToggle={() =>
                        onToggleComplete(task.id, !task.is_completed)
                    }
                    onClick={() => alert("Open task dialog here")}
                />
            ))}
        </div>
    );
}
