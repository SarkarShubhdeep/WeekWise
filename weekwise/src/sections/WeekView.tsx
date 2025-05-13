"use client";

import React, { useMemo, useState } from "react";
import TaskCard from "@/components/TaskCard";
import { motion, AnimatePresence } from "framer-motion";
import NewTaskCardInput from "@/components/NewTaskCardInput";

interface Task {
    id: string;
    title: string;
    date?: string;
    time?: string;
    description?: string;
    is_completed: boolean;
}

interface WeekViewProps {
    weekOffset: number;
    direction: "forward" | "backward";
    tasks: Task[];
    onToggleComplete: (id: string, newStatus: boolean) => void;
    onExpand: (task: Task, rect: DOMRect) => void;
    isAdding: boolean;
    newTaskText: string;
    setNewTaskText: React.Dispatch<React.SetStateAction<string>>;
    onAddTask: (data: { title: string; date?: string; time?: string }) => void;
    handleCancel: () => void;
    sortBy: "none" | "time-asc" | "time-desc" | "title-asc";
}

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const getTodayISOInCurrentWeek = (weekOffset: number) => {
    const today = new Date();
    const startOfWeek = new Date();
    startOfWeek.setDate(
        today.getDate() - ((today.getDay() + 6) % 7) + weekOffset * 7
    );

    const todayInWeek = new Date(startOfWeek);
    todayInWeek.setDate(startOfWeek.getDate() + ((today.getDay() + 6) % 7));

    return `${todayInWeek.getFullYear()}-${(todayInWeek.getMonth() + 1)
        .toString()
        .padStart(2, "0")}-${todayInWeek
        .getDate()
        .toString()
        .padStart(2, "0")}`;
};

export default function WeekView({
    weekOffset,
    direction,
    tasks,
    onToggleComplete,
    onExpand,
    isAdding,
    onAddTask,
    handleCancel,
    sortBy,
}: WeekViewProps) {
    const [addingDate, setAddingDate] = useState<string | null>(null);

    const today = new Date();

    const startOfWeek = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + weekOffset * 7);
        d.setHours(0, 0, 0, 0);
        return d;
    }, [weekOffset]);

    const weekDays = useMemo(() => {
        return Array.from({ length: 7 }, (_, i) => {
            const d = new Date(startOfWeek);
            d.setDate(startOfWeek.getDate() + i);
            return {
                name: weekdays[i],
                date: d.getDate(),
                fullDate: d,
            };
        });
    }, [startOfWeek]);

    const tasksByDate = useMemo(() => {
        const grouped: Record<string, Task[]> = {};
        tasks.forEach((task) => {
            if (!task.date) return;
            const key = task.date.split("T")[0];
            grouped[key] = grouped[key] || [];
            grouped[key].push(task);
        });
        return grouped;
    }, [tasks]);

    const isToday = (d: Date) => d.toDateString() === today.toDateString();

    return (
        <section className="w-full  overflow-visible">
            <AnimatePresence mode="wait">
                <motion.div
                    key={weekOffset}
                    initial={{
                        opacity: 0,
                        x: direction === "forward" ? 100 : -100,
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{
                        opacity: 0,
                        x: direction === "forward" ? -100 : 100,
                    }}
                    transition={{ duration: 0.15 }}
                    className="grid grid-cols-7 min-w-[900px] min-h-[75vh]"
                >
                    {weekDays.map((day, idx) => {
                        const key = `${day.fullDate.getFullYear()}-${(
                            day.fullDate.getMonth() + 1
                        )
                            .toString()
                            .padStart(2, "0")}-${day.fullDate
                            .getDate()
                            .toString()
                            .padStart(2, "0")}`;
                        const dayTasks = tasksByDate[key] || [];

                        const sortedTasks = [...dayTasks].sort((a, b) => {
                            if (sortBy === "title-asc") {
                                return a.title.localeCompare(b.title);
                            }
                            if (sortBy === "time-asc") {
                                return (a.time || "").localeCompare(
                                    b.time || ""
                                );
                            }
                            if (sortBy === "time-desc") {
                                return (b.time || "").localeCompare(
                                    a.time || ""
                                );
                            }
                            return 0;
                        });

                        const isCurrentDay =
                            getTodayISOInCurrentWeek(weekOffset) === key;

                        return (
                            <div
                                key={idx}
                                className="flex flex-col gap-2 p-1 py-6 rounded-t-xl hover:bg-gradient-to-b from-primary-100 to-primary-50/0 transition-all duration-100"
                            >
                                <div
                                    className={`flex w-fit items-start gap-2 rounded-full px-2 py-1 text-sm mb-2 ${
                                        isToday(day.fullDate)
                                            ? "bg-amber-600 text-white"
                                            : ""
                                    }`}
                                >
                                    <span className="font-semibold">
                                        {day.name}
                                    </span>
                                    <span>{day.date}</span>
                                </div>

                                <div className="flex flex-col gap-1">
                                    {isAdding && isCurrentDay && (
                                        <NewTaskCardInput
                                            onCancel={handleCancel}
                                            onSave={onAddTask}
                                        />
                                    )}
                                    {sortedTasks.map((task) => (
                                        <TaskCard
                                            key={task.id}
                                            title={task.title}
                                            date={task.date}
                                            time={task.time}
                                            description={task.description}
                                            isCompleted={task.is_completed}
                                            onCheckboxToggle={() =>
                                                onToggleComplete(
                                                    task.id,
                                                    !task.is_completed
                                                )
                                            }
                                            showCheckbox={true}
                                            onExpand={(rect) =>
                                                onExpand(task, rect)
                                            }
                                        />
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            </AnimatePresence>
        </section>
    );
}
