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
    sortBy: "date-asc" | "date-desc" | "title-asc";
    onToggleComplete: (id: string, newStatus: boolean) => void;
}

export default function SearchView({
    tasks,
    query,
    showDescriptions,
    showCompleted,
    sortBy,
    onToggleComplete,
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
            <div className="text-sm text-gray-500 px-4 py-2">
                No tasks matched your search.
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-1 w-full scroll-auto overflow-visible bg-white/20 p-2">
            {filtered.map((task) => (
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
