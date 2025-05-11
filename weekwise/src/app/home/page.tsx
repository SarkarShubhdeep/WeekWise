"use client";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import ViewToggle from "@/components/ViewToggle";
import { supabase } from "@/lib/supabaseClient";
import WeekView from "@/sections/WeekView";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import * as Icon from "react-feather";

export default function HomePage() {
    // ? State to track the selected view
    const [currentView, setCurrentView] = useState<"week" | "all">("week");
    // ? week switching
    const [weekOffset, setWeekOffset] = useState(0);
    // ? getting the direction of week switching back and forward
    const [direction, setDirection] = useState<"forward" | "backward">(
        "forward"
    );
    const prevOffset = useRef(0);

    const handleWeekChange = (newOffset: number) => {
        setDirection(newOffset > prevOffset.current ? "forward" : "backward");
        prevOffset.current = newOffset;
        setWeekOffset(newOffset);
    };

    const [loading, setLoading] = useState(true);
    // ? next router
    const router = useRouter();

    // ?checking if the user is signed in / persistent session
    useEffect(() => {
        const checkSession = async () => {
            const { data, error } = await supabase.auth.getSession();
            const session = data.session;

            if (!session) {
                router.replace("/auth");
            } else {
                setLoading(false);
            }
        };

        checkSession();
    }, [router]);

    const today = new Date();
    const todayLabel = today.toLocaleString("default", {
        weekday: "long",
        month: "short",
        day: "numeric",
    });

    const getWeekLabel = () => {
        const today = new Date();
        const startOfWeek = new Date(today);
        startOfWeek.setDate(
            today.getDate() - ((today.getDay() + 6) % 7) + weekOffset * 7
        );

        const endOfWeek = new Date(startOfWeek);
        endOfWeek.setDate(startOfWeek.getDate() + 6);

        const format = (d: Date) =>
            d.toLocaleString("default", { month: "short", day: "numeric" });
        return `${format(startOfWeek)} - ${format(endOfWeek)}`;
    };

    // ? Loading while user is fetched
    if (loading) {
        return <div className="p-4">Loading...</div>;
    }

    return (
        <main className="animate-fade-in min-h-screen p-6">
            <div className="flex flex-col m-auto w-11/12 lg:w-9/12 md:w-10/12 sm:w-11/12 h-full mt-20 ">
                {/* <div className="relative w-full">
                    <div className="absolute bottom-1 w-full">
                        <span className="bg-red-200 lg:hidden md:hidden sm:hidden xl:block">
                            xl or greater
                        </span>
                        <span className="bg-red-200 lg:block md:hidden sm:hidden xl:hidden">
                            lg
                        </span>
                        <span className="bg-red-200 lg:hidden md:block sm:hidden xl:hidden">
                            md
                        </span>
                        <span className="bg-red-200 lg:hidden md:hidden sm:block xl:hidden">
                            sm
                        </span>
                    </div>
                </div> */}

                {/* //? --------TOP NAV--------- */}
                <nav className="flex items-center w-full justify-between ">
                    {/* //? Today's day 
                // todo: on click will switch view to current week 
                */}
                    <div
                        className="flex flex-col gap-2 w-fit cursor-pointer "
                        onClick={() => setWeekOffset(0)}
                        title="Go to current week"
                    >
                        <div className="flex items-center text-4xl font-semibold gap-2">
                            {todayLabel}
                            <div className="h-5 w-5 bg-amber-600 rounded-full"></div>
                        </div>
                    </div>

                    <div
                        className="text-xl font-semibold flex justify-center items-center h-14 w-14 rounded-full border-1 hover:ring-3 ring-gray-700 ring-offset-3 hover:scale-90 transition-all duration-100 cursor-pointer"
                        onClick={() => router.push("/userpreferences")}
                    >
                        SS
                    </div>
                </nav>

                {/* //? --------ADD NEW TASK BAR & TASK OPTIONS--------- */}
                <div className="flex items-center justify-between w-full h-10 mt-5">
                    <div className="flex gap-2">
                        {/* // todo: will open up a small dialog box to add task  */}
                        <button className="flex text-sm items-center ps-2 py-2 pe-3 gap-1 bg-primary-500 hover:bg-primary-700 text-white rounded-full transition-colors duration-100">
                            <Icon.Plus height={20} />
                            Add task
                        </button>

                        {/* // todo: expands open an input to search */}
                        <div className="">
                            <button className="border-1 border-gray-700 rounded-full p-2 hover:bg-gray-700 hover:text-white transition-colors duration-100">
                                <Icon.Search height={20} />
                            </button>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {/* // todo: show completed task bg toggle  */}
                        <button className="flex items-center px-3 py-2 bg-gray-200 rounded-full text-sm gap-1 transition-all duration-100">
                            Show completed
                        </button>

                        <button className="flex items-center px-3 py-2 bg-gray-200 rounded-full text-sm gap-1 transition-all duration-100">
                            Show descriptions
                        </button>

                        {/* // todo: create sorting otpions dropdown menu */}
                        <button className="flex items-center pe-3 py-2 ps-2 bg-gray-200 rounded-full text-sm gap-1 transition-all duration-100">
                            <Icon.ChevronDown height={20} />
                            Sort: Acs
                        </button>
                    </div>
                </div>

                <div className="flex border-t-1 mt-4 gap-2 border-gray-200 pt-4">
                    <ViewToggle
                        current={currentView}
                        onToggle={setCurrentView}
                    />
                    {/* // todo: week switcher */}
                    <AnimatePresence mode="wait">
                        {currentView === "week" && (
                            <motion.div
                                key={weekOffset}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.95 }}
                                transition={{
                                    duration: 0.1,
                                    ease: "easeIn",
                                    bounce: 0.2,
                                }}
                                className="flex w-fit items-center gap-0 bg-gray-200 rounded-full text-xs hover:gap-2 transition-all duration-100 h-8"
                            >
                                <button
                                    className="hover:bg-gray-700 hover:text-white p-2 rounded-full"
                                    onClick={() =>
                                        handleWeekChange(weekOffset - 1)
                                    }
                                >
                                    <Icon.ChevronLeft height={18} />
                                </button>

                                {getWeekLabel()}

                                <button
                                    className="hover:bg-gray-700 hover:text-white p-2 rounded-full"
                                    onClick={() =>
                                        handleWeekChange(weekOffset + 1)
                                    }
                                >
                                    <Icon.ChevronRight height={18} />
                                </button>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>

                {/* //? --------WEEK / DAYS (min 3 days, max 7 days) TASKS SECTION--------- */}
                <div className="w-full mt-5">
                    {/* 7-day (view switchable to 7, 6, 5, 4, 3 days)  */}
                    <WeekView weekOffset={weekOffset} direction={direction} />
                </div>
            </div>
        </main>
    );
}
