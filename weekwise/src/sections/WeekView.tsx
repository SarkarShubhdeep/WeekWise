"use client";

import TaskCard from "@/components/TaskCard";
import React from "react";

interface WeekViewProps {
    weekOffset: number;
}

const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function WeekView({ weekOffset }: WeekViewProps) {
    const today = new Date();
    const start = new Date(today);
    start.setDate(
        today.getDate() - ((today.getDay() + 6) % 7) + weekOffset * 7
    );

    const isToday = (date: Date) => {
        return (
            today.getDate() === date.getDate() &&
            today.getMonth() === date.getMonth() &&
            today.getFullYear() === date.getFullYear()
        );
    };

    const weekDays = Array.from({ length: 7 }, (_, i) => {
        const date = new Date(start);
        date.setDate(start.getDate() + i);
        return {
            name: weekdays[date.getDay()],
            date: date.getDate(),
            fullDate: date, // add this
        };
    });

    const sampleTasks = [
        "Some task",
        "Some task with two lines",
        "Some task with two lines and another line",
        "Some task",
        "Some task with two lines",
    ];

    return (
        <section className="w-full overflow-visible">
            <div className="grid grid-cols-7 min-w-[900px]">
                {weekDays.map((day, index) => (
                    <div
                        key={index}
                        className="flex rounded-t-xl flex-col gap-2 p-1 py-6 hover:bg-gradient-to-b from-primary-100 to-primary-50/0  transition-all duration-100"
                        onDoubleClick={() => alert("double clicked!")}
                    >
                        <div
                            className={`flex text-sm gap-2 w-fit rounded-full items-start mb-2 px-2 py-1 ${
                                isToday(day.fullDate)
                                    ? "bg-amber-600 text-white"
                                    : ""
                            }`}
                        >
                            <span className="font-semibold">{day.name}</span>
                            <span className="">{day.date}</span>
                        </div>
                        <div className="flex flex-col gap-1 ">
                            {sampleTasks.map((task, i) => (
                                <TaskCard
                                    key={i}
                                    title={task}
                                    datetime="10:00 AM"
                                />
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
