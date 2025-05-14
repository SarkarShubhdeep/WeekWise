"use client";

import TaskCard from "@/components/TaskCard";

interface Task {
    id: string;
    title: string;
    description?: string;
    date?: string;
    time?: string;
    is_completed: boolean;
}

interface SearchViewProps {
    tasks: Task[];
    query: string;
    showDescriptions: boolean;
    showCompleted: boolean;
    sortBy: "none" | "date-asc" | "date-desc" | "title-asc";
    onToggleComplete: (id: string, newStatus: boolean) => void;
    onExpand?: (task: Task, rect: DOMRect) => void;
}

export default function SearchView({
    tasks,
    query,
    showDescriptions,
    showCompleted,
    sortBy,
    onToggleComplete,
    onExpand,
}: SearchViewProps) {
    const filtered = tasks
        .filter((task) => {
            const inTitle = task.title
                .toLowerCase()
                .includes(query.toLowerCase());
            const inDesc = task.description
                ?.toLowerCase()
                .includes(query.toLowerCase());
            return (inTitle || inDesc) && (showCompleted || !task.is_completed);
        })
        .sort((a, b) => {
            if (sortBy === "title-asc") {
                return a.title.localeCompare(b.title);
            } else if (sortBy === "date-desc") {
                return (b.date || "").localeCompare(a.date || "");
            }
            return (a.date || "").localeCompare(b.date || "");
        });

    if (!filtered.length) {
        return (
            <div className="flex justify-center text-2xl h-[calc(100vh-320px)] mt-10 text-gray-400 px-4 py-6 gap-3">
                {/* <span className="text-5xl block">🤔</span> */}
                No tasks matched your search.
            </div>
        );
    }

    return (
        <div className="flex justify-center">
            <div className="flex flex-col gap-1 overflow-y-auto h-[calc(100vh-320px)]  w-[400px]  scroll-auto overflow-visible bg-white/20 p-2">
                {filtered.map((task) => (
                    <TaskCard
                        id={task.id}
                        key={task.id}
                        className="min-w-[300px]"
                        title={task.title}
                        date={task.date}
                        time={task.time}
                        description={
                            showDescriptions ? task.description : undefined
                        }
                        isCompleted={task.is_completed}
                        showCheckbox
                        onCheckboxToggle={() =>
                            onToggleComplete(task.id, !task.is_completed)
                        }
                        onExpand={(rect) => onExpand?.(task, rect)}
                    />
                ))}
            </div>
        </div>
    );
}
