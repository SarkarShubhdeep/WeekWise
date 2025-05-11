"use client";

import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import TaskCard from "@/components/TaskCard";
import ExpandedTaskCard from "@/components/ExpandedTaskCard";
import { motion, AnimatePresence } from "framer-motion";

interface WeekViewProps {
    weekOffset: number;
    direction: "forward" | "backward";
}

interface Task {
    id: string;
    title: string;
    date: string;
    description?: string;
    is_completed: boolean;
}

const weekdays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export default function WeekView({ weekOffset, direction }: WeekViewProps) {
    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [expandedTask, setExpandedTask] = useState<Task | null>(null);

    const today = new Date();

    // Compute Monday of the current view
    const startOfWeek = useMemo(() => {
        const d = new Date();
        d.setDate(d.getDate() - ((d.getDay() + 6) % 7) + weekOffset * 7);
        d.setHours(0, 0, 0, 0);
        return d;
    }, [weekOffset]);

    // Build the 7-day array
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

    // Group all tasks by date
    const tasksByDate = useMemo(() => {
        const grouped: Record<string, Task[]> = {};
        allTasks.forEach((task) => {
            const key = task.date.split("T")[0];
            grouped[key] = grouped[key] || [];
            grouped[key].push(task);
        });
        return grouped;
    }, [allTasks]);

    // Fetch all tasks once on mount
    useEffect(() => {
        const fetchAllTasks = async () => {
            const { data, error } = await supabase
                .from("tasks")
                .select("*")
                .order("date", { ascending: true });

            if (error) {
                console.error("Failed to fetch tasks", error);
                return;
            }

            setAllTasks(data);
        };

        fetchAllTasks();
    }, []);

    const isToday = (d: Date) => d.toDateString() === today.toDateString();

    return (
        <section className="w-full overflow-visible">
            {/* Expanded Task Modal */}
            {expandedTask && (
                <ExpandedTaskCard
                    isOpen
                    onClose={() => setExpandedTask(null)}
                    initialData={{
                        title: expandedTask.title,
                        datetime: expandedTask.date,
                        description: expandedTask.description ?? "",
                        is_completed: expandedTask.is_completed,
                    }}
                    onSave={async (updates) => {
                        const { error } = await supabase
                            .from("tasks")
                            .update({
                                title: updates.title,
                                date: updates.datetime,
                                description: updates.description,
                                is_completed: updates.is_completed,
                            })
                            .eq("id", expandedTask.id);

                        if (error) {
                            console.error("Update failed", error);
                        } else {
                            // Re-fetch all tasks so sorting/date grouping updates correctly
                            const { data, error: refetchError } = await supabase
                                .from("tasks")
                                .select("*")
                                .order("date", { ascending: true });

                            if (refetchError) {
                                console.error("Refetch failed", refetchError);
                            } else {
                                setAllTasks(data);
                            }
                        }

                        setExpandedTask(null);
                    }}
                />
            )}

            {/* Week Grid */}

            <AnimatePresence mode="wait">
                <motion.div
                    key={weekOffset}
                    initial={{
                        opacity: 0,
                        x: direction === "forward" ? 100 : -100, // coming in
                    }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{
                        opacity: 0,
                        x: direction === "forward" ? -100 : 100, // going out
                    }}
                    transition={{ duration: 0.15 }}
                    className="grid grid-cols-7 min-w-[900px]"
                >
                    {weekDays.map((day, idx) => {
                        const key = day.fullDate.toISOString().split("T")[0];
                        const tasks = tasksByDate[key] || [];

                        return (
                            <div
                                key={idx}
                                className="flex flex-col gap-2 p-1 py-6 rounded-t-xl 
                            hover:bg-gradient-to-b from-primary-100 to-primary-50/0 
                            transition-all duration-100"
                                onDoubleClick={() => alert("double clicked!")}
                            >
                                <div
                                    className={`flex w-fit items-start gap-2 rounded-full 
                                px-2 py-1 text-sm mb-2 ${
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
                                    {tasks.map((task) => {
                                        const time = task.date.includes("T")
                                            ? new Date(
                                                  task.date
                                              ).toLocaleTimeString([], {
                                                  hour: "2-digit",
                                                  minute: "2-digit",
                                              })
                                            : undefined;

                                        return (
                                            <TaskCard
                                                key={task.id}
                                                title={task.title}
                                                datetime={time}
                                                isCompleted={task.is_completed}
                                                onClick={() =>
                                                    setExpandedTask(task)
                                                }
                                            />
                                        );
                                    })}
                                </div>
                            </div>
                        );
                    })}
                </motion.div>
            </AnimatePresence>
        </section>
    );
}
