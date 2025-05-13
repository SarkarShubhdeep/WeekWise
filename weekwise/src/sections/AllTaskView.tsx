// AllTaskView.tsx

"use client";

import NewTaskCardInput from "@/components/NewTaskCardInput";
import TaskCard from "@/components/TaskCard";
import { useEffect, useRef, useState } from "react";

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
    sortBy: "none" | "date-asc" | "date-desc" | "title-asc";
    onToggleComplete: (id: string, newStatus: boolean) => void;
    onExpand?: (task: Task, rect: DOMRect) => void;
    isAdding: boolean;
    newTaskText: string;
    setNewTaskText: (text: string) => void;
    onAddTask: (task: { title: string; date?: string; time?: string }) => void;
    handleCancel: () => void;
}

export default function AllTaskView({
    tasks,
    showDescriptions,
    showCompleted,
    sortBy,
    onToggleComplete,
    onExpand,
    isAdding,
    newTaskText,
    setNewTaskText,
    onAddTask,
    handleCancel,
}: AllTaskViewProps) {
    const sortedFilteredTasks = tasks
        .filter((task) => showCompleted || !task.is_completed)
        .sort((a, b) => {
            if (sortBy === "title-asc") {
                return a.title.localeCompare(b.title);
            } else if (sortBy === "date-desc") {
                return (b.date || "").localeCompare(a.date || "");
            }
            return (a.date || "").localeCompare(b.date || "");
        });

    if (!sortedFilteredTasks.length) {
        return (
            <div className="text-sm text-gray-500 px-4 py-2">
                No tasks to show.
            </div>
        );
    }

    const newTaskInputRef = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (isAdding) newTaskInputRef.current?.focus();
    }, [isAdding]);

    return (
        <div className="flex flex-col gap-1 w-full scroll-auto overflow-visible bg-white/20 p-2">
            {isAdding && (
                <NewTaskCardInput
                    onCancel={handleCancel}
                    onSave={(parsedTask) => {
                        onAddTask(parsedTask); // Make sure this prop is wired
                    }}
                />
            )}
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
                    onExpand={(rect) => onExpand?.(task, rect)}
                />
            ))}
        </div>
    );
}
