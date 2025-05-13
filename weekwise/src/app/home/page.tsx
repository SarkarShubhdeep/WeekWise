// home/page.tsx

"use client";

import ViewToggle from "@/components/ViewToggle";
import { supabase } from "@/lib/supabaseClient";
import AllTaskView from "@/sections/AllTaskView";
import WeekView from "@/sections/WeekView";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import * as Icon from "react-feather";
import { fetchAllTasks } from "@/lib/fetchTasks";
import SearchView from "@/sections/SearchView";
import ExpandedTaskCard from "@/components/ExpandedTaskCard";

import { getTodayISOInCurrentWeek } from "@/sections/WeekView";

interface Task {
    id: string;
    title: string;
    description?: string;
    date?: string;
    time?: string;
    is_completed: boolean;
}

export default function HomePage() {
    const router = useRouter();

    // ? Adding new task
    const [isAddingTask, setIsAddingTask] = useState(false);
    const [newTaskText, setNewTaskText] = useState("");

    const getTodayLocalISO = () => new Date().toLocaleDateString("sv-SE");

    // ? ADDING NEW TASK LOGIC
    const handleAddTask = async ({
        title,
        date,
        time,
    }: {
        title: string;
        date?: string;
        time?: string;
    }) => {
        const user = await supabase.auth.getUser();
        const user_id = user.data.user?.id;
        if (!user_id || !title.trim()) return;

        const newTask: any = {
            title: title.trim(),
            user_id,
            is_completed: false,
        };

        // Use parsed date/time if available
        if (date) newTask.date = date;
        if (time) newTask.time = time;

        // If in week view but no parsed date, use today within current week

        if (currentView === "week" && !date) {
            newTask.date = new Date().toLocaleDateString("sv-SE");
        }

        const { data, error } = await supabase
            .from("tasks")
            .insert([newTask])
            .select()
            .single();

        if (error) {
            console.error("Insert failed", error);
            return;
        }

        setAllTasks((prev) => [data, ...prev]);
        setIsAddingTask(false);
        setNewTaskText("");
    };

    // ? View toggle: week | all
    const [currentView, setCurrentView] = useState<"week" | "all">("week");

    // ? Week offset for week switcher
    const [weekOffset, setWeekOffset] = useState(0);
    const [direction, setDirection] = useState<"forward" | "backward">(
        "forward"
    );
    const prevOffset = useRef(0);

    // ? HANDLING WEEK CHANGE
    const handleWeekChange = (newOffset: number) => {
        setDirection(newOffset > prevOffset.current ? "forward" : "backward");
        prevOffset.current = newOffset;
        setWeekOffset(newOffset);
    };

    // Auth & session check
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const checkSession = async () => {
            const { data } = await supabase.auth.getSession();
            if (!data.session) {
                router.replace("/auth");
            } else {
                setLoading(false);
            }
        };
        checkSession();
    }, [router]);

    // Task data
    const [allTasks, setAllTasks] = useState<Task[]>([]);

    useEffect(() => {
        const loadTasks = async () => {
            const data = await fetchAllTasks();
            setAllTasks(data);
        };
        loadTasks();
    }, []);

    // ? Filtering/searching/sorting
    const [sortBy, setSortBy] = useState<
        "none" | "date-asc" | "date-desc" | "title-asc"
    >("date-asc");
    const [showCompleted, setShowCompleted] = useState(true);
    const [showDescriptions, setShowDescriptions] = useState(true);

    const [isSearchActive, setIsSearchActive] = useState(false);
    const [active, setActive] = useState(false);

    const [isExpanded, setIsExpanded] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const searchInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (isExpanded && searchInputRef.current) {
            searchInputRef.current.focus();
        }
    }, [isExpanded]);

    const handleBlurIfEmpty = () => {
        if (searchQuery.trim() === "") {
            setIsExpanded(false);
        }
    };

    const clearAndCollapse = () => {
        setSearchQuery("");
        setIsExpanded(false);
    };

    const toggleExpansion = () => {
        if (!isExpanded) setIsExpanded(true);
        else if (searchQuery.trim() === "") setIsExpanded(false);
    };

    // Ensure WeekView only receives allowed sortBy values
    const weekSort: "none" | "time-asc" | "time-desc" | "title-asc" =
        sortBy === "title-asc" || sortBy === "none"
            ? sortBy
            : sortBy === "date-desc"
            ? "time-desc"
            : "time-asc"; // fallback for "date-asc"

    const filteredTasks = allTasks
        .filter((task) => {
            const matchesSearch = task.title
                .toLowerCase()
                .includes(searchQuery.toLowerCase());
            const matchesCompleted = showCompleted || !task.is_completed;
            return matchesSearch && matchesCompleted;
        })
        .sort((a, b) => {
            switch (sortBy) {
                case "title-asc":
                    return a.title.localeCompare(b.title);
                case "date-desc":
                    return (b.date || "").localeCompare(a.date || "");
                case "date-asc":
                    return (a.date || "").localeCompare(b.date || "");
                case "none":
                default:
                    return 0;
            }
        });

    // ? SHORTCUT: CMD + K - SEARCH BAR
    useEffect(() => {
        const handleKeyShortcut = (e: KeyboardEvent) => {
            const isMac = navigator.platform.toUpperCase().indexOf("MAC") >= 0;
            if (
                (isMac && e.metaKey && e.key === "k") ||
                (!isMac && e.ctrlKey && e.key === "k")
            ) {
                e.preventDefault(); // prevent browser default
                setIsExpanded(true);
            }
        };

        window.addEventListener("keydown", handleKeyShortcut);
        return () => window.removeEventListener("keydown", handleKeyShortcut);
    }, []);
    // ? SHORTCUT: N - ADD NEW TASK
    useEffect(() => {
        const handleAddTaskShortcut = (e: KeyboardEvent) => {
            if (
                document.activeElement?.tagName !== "INPUT" && // don't trigger inside input
                document.activeElement?.tagName !== "TEXTAREA" &&
                e.key.toLowerCase() === "n"
            ) {
                e.preventDefault();
                setIsAddingTask(true);
            }
        };

        window.addEventListener("keydown", handleAddTaskShortcut);
        return () =>
            window.removeEventListener("keydown", handleAddTaskShortcut);
    }, []);

    // ? Expanded task card
    const [expandedTask, setExpandedTask] = useState<Task | null>(null);
    const [anchorRect, setAnchorRect] = useState<DOMRect | null>(null);

    const handleExpandTask = (task: Task, rect: DOMRect) => {
        setExpandedTask(task);
        setAnchorRect(rect);
    };

    // ? View options
    const [showTime, setShowTime] = useState(true);
    const [showDate, setShowDate] = useState(true);
    const [showDescription, setShowDescription] = useState(true);

    const today = new Date();
    const todayLabel = today.toLocaleDateString("default", {
        weekday: "long",
        month: "short",
        day: "numeric",
    });

    // ? HANDLEONCOMPLETE FOR TASKCARD IN ALLTASKVIEW
    const handleToggleComplete = async (id: string, newStatus: boolean) => {
        const { error } = await supabase
            .from("tasks")
            .update({ is_completed: newStatus })
            .eq("id", id);

        if (error) {
            console.error("Failed to update task", error);
            return;
        }

        setAllTasks((prev) =>
            prev.map((task) =>
                task.id === id ? { ...task, is_completed: newStatus } : task
            )
        );
    };

    // Week label
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

    if (loading) return <div className="p-4">Loading...</div>;
    return (
        <main className="animate-fade-in min-h-screen p-6">
            <div className="flex flex-col m-auto w-11/12 lg:w-9/12 md:w-10/12 sm:w-11/12 h-full mt-20 ">
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
                        <button
                            className="flex text-sm items-center ps-2 py-2 pe-3 gap-1 bg-primary-500 hover:bg-primary-700 text-white rounded-full transition-colors duration-100"
                            onClick={() => setIsAddingTask(true)}
                        >
                            <Icon.Plus height={20} />
                            Add task
                        </button>

                        {/* // todo: expands open an input to search */}

                        <motion.div
                            className="flex items-center justify-center border-1 border-gray-700 rounded-full bg-white overflow-hidden"
                            animate={{ width: isExpanded ? 280 : 38 }}
                            transition={{
                                type: "spring",
                                stiffness: 300,
                                damping: 20,
                            }}
                        >
                            <input
                                ref={searchInputRef}
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                onBlur={handleBlurIfEmpty}
                                placeholder="Search tasks..."
                                className={`flex-1 text-sm outline-none h-full ${
                                    isExpanded ? "ps-3" : "p-0"
                                }`}
                                style={{
                                    opacity: isExpanded ? 1 : 0,
                                    width: isExpanded ? "100%" : 0,
                                    transition: "opacity 0.2s ease",
                                }}
                                onKeyDown={(e) => {
                                    if (e.key === "Escape") {
                                        setIsExpanded(false);
                                        setSearchQuery("");
                                    }
                                }}
                            />
                            {isExpanded && searchQuery ? (
                                <button
                                    onClick={clearAndCollapse}
                                    className="p-2 rounded-full text-gray-700 hover:bg-gray-200"
                                    type="button"
                                >
                                    <Icon.X size={18} />
                                </button>
                            ) : (
                                <button
                                    className="p-2 rounded-full text-gray-700 hover:bg-gray-200"
                                    onClick={toggleExpansion}
                                    type="button"
                                >
                                    <Icon.Search size={18} />
                                </button>
                            )}
                        </motion.div>
                        {isExpanded ? (
                            ""
                        ) : (
                            <div className="text-xs italic  flex items-center opacity-50">
                                <span className="font-mono pe-2 font-semibold">
                                    cmd + k
                                </span>{" "}
                                to search your tasks
                            </div>
                        )}
                    </div>
                    <div className="flex gap-2">
                        {/* // todo: week switcher */}

                        {currentView === "week" && (
                            <div className="flex w-fit items-center gap-0 bg-gray-200 rounded-full text-sm hover:gap-2 transition-all duration-100 ">
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
                            </div>
                        )}
                        <button
                            className={`flex items-center py-2 ps-3  rounded-full text-sm gap-1 transition-all duration-100 ${
                                sortBy === "none"
                                    ? "bg-gray-200 pe-3"
                                    : "bg-gray-700 text-white pe-2"
                            }`}
                            onClick={() => {
                                setSortBy((prev) => {
                                    if (prev === "none") return "date-asc";
                                    if (prev === "date-asc") return "date-desc";
                                    if (prev === "date-desc")
                                        return "title-asc";
                                    return "none";
                                });
                            }}
                        >
                            {sortBy === "none" && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs opacity-70">
                                        Sort
                                    </span>
                                    None
                                </div>
                            )}
                            {sortBy === "date-asc" && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs opacity-70">
                                        Sort
                                    </span>
                                    Date
                                    <Icon.ArrowUp height={16} />
                                </div>
                            )}
                            {sortBy === "date-desc" && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs opacity-70">
                                        Sort
                                    </span>
                                    Date
                                    <Icon.ArrowDown height={16} />
                                </div>
                            )}
                            {sortBy === "title-asc" && (
                                <div className="flex items-center gap-2">
                                    <span className="text-xs opacity-70">
                                        Sort
                                    </span>
                                    Title
                                    <Icon.ArrowUp height={16} />
                                </div>
                            )}
                        </button>

                        <ViewToggle
                            current={currentView}
                            onToggle={setCurrentView}
                        />
                    </div>
                </div>

                <div className="flex border-t-1 mt-4 gap-2 border-gray-200 pt-4"></div>

                {/* //? --------WEEK VIEW | ALL TASKS SECTION | SEARCH VIEW --------- */}
                <div className="max-h-[75vh] overflow-y-auto overflow-visible mt-4">
                    {/* <div className="text-2xl font-semibold">View Title</div> */}
                    {searchQuery.trim() ? (
                        <SearchView
                            query={searchQuery}
                            tasks={allTasks}
                            showCompleted={showCompleted}
                            showDescriptions={showDescriptions}
                            sortBy={sortBy}
                            onToggleComplete={handleToggleComplete}
                            onExpand={handleExpandTask}
                        />
                    ) : currentView === "week" ? (
                        <WeekView
                            weekOffset={weekOffset}
                            direction={direction}
                            tasks={allTasks}
                            onToggleComplete={handleToggleComplete}
                            onExpand={handleExpandTask}
                            isAdding={isAddingTask}
                            newTaskText={newTaskText}
                            setNewTaskText={setNewTaskText}
                            onAddTask={handleAddTask}
                            handleCancel={() => setIsAddingTask(false)}
                            sortBy={weekSort}
                        />
                    ) : (
                        <AllTaskView
                            tasks={allTasks}
                            showCompleted={showCompleted}
                            showDescriptions={showDescriptions}
                            sortBy={sortBy}
                            onToggleComplete={handleToggleComplete}
                            onExpand={handleExpandTask}
                            isAdding={isAddingTask}
                            newTaskText={newTaskText}
                            setNewTaskText={setNewTaskText}
                            onAddTask={handleAddTask}
                            handleCancel={() => setIsAddingTask(false)}
                        />
                    )}
                </div>
            </div>
            {expandedTask && anchorRect && (
                <ExpandedTaskCard
                    isOpen
                    anchorRect={anchorRect}
                    onClose={() => setExpandedTask(null)}
                    initialData={{
                        title: expandedTask.title,
                        date: expandedTask.date,
                        time: expandedTask.time,
                        description: expandedTask.description ?? "",
                        is_completed: expandedTask.is_completed,
                    }}
                    onSave={async (updates) => {
                        console.log("Saving updates:", updates);
                        const id = expandedTask.id;

                        // Convert empty strings to null for valid DB input
                        const cleanUpdates = {
                            ...updates,
                            date:
                                updates.date?.trim() === ""
                                    ? null
                                    : updates.date,
                            time:
                                updates.time?.trim() === ""
                                    ? null
                                    : updates.time,
                        };

                        const user = await supabase.auth.getUser();
                        const user_id = user.data.user?.id;

                        const { error } = await supabase
                            .from("tasks")
                            .update(cleanUpdates)
                            .eq("id", id)
                            .eq("user_id", user_id);

                        console.log("Trying to update task:", {
                            id,
                            user_id,
                            cleanUpdates,
                        });

                        if (error) {
                            console.error("Update failed:", error);
                        } else {
                            setAllTasks((prev) =>
                                prev.map((task) =>
                                    task.id === id
                                        ? {
                                              ...task,
                                              ...(cleanUpdates as Partial<Task>),
                                          }
                                        : task
                                )
                            );
                        }
                        setExpandedTask(null);
                    }}
                />
            )}
        </main>
    );
}
