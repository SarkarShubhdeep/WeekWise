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
    onClearCompleted: () => void;
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
    onClearCompleted,
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

    const pendingTasks = sortedFilteredTasks.filter(
        (task) => !task.is_completed
    );
    const completedTasks = sortedFilteredTasks.filter(
        (task) => task.is_completed
    );

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
        <div className="flex w-full gap-4 p-4 justify-center">
            <div className="space-y-1 rounded-lg overflow-y-auto h-[calc(100vh-320px)] w-[300px] pb-4">
                <h2 className="text-sm uppercase px-3 py-4 rounded-md bg-primary-200/40 sticky top-0  backdrop-blur z-10 ">
                    Pending
                </h2>
                {isAdding && (
                    <NewTaskCardInput
                        onCancel={handleCancel}
                        onSave={(parsedTask) => onAddTask(parsedTask)}
                    />
                )}
                {pendingTasks.length > 0 ? (
                    pendingTasks.map((task) => (
                        <TaskCard
                            id={task.id}
                            className="min-w-[300px] "
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
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No pending tasks.</p>
                )}
            </div>

            <div className="space-y-1 rounded-lg overflow-y-auto h-[calc(100vh-320px)] w-[300px] pb-4">
                <div className="flex text-sm uppercase justify-between items-center px-3 py-4 rounded-md bg-gray-300/40 sticky top-0 backdrop-blur z-10 ">
                    Completed
                    <button
                        className="text-sm font-normal text-blue-600"
                        onClick={onClearCompleted}
                    >
                        Clear all
                    </button>
                </div>
                {completedTasks.length > 0 ? (
                    completedTasks.map((task) => (
                        <TaskCard
                            id={task.id}
                            className="min-w-[300px] opacity-70"
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
                    ))
                ) : (
                    <p className="text-sm text-gray-500">No completed tasks.</p>
                )}
            </div>
        </div>
    );
}
