// NewTaskCardInput.tsx

"use client";

import React, { useEffect, useRef, useState } from "react";
import * as chrono from "chrono-node";

interface NewTaskCardInputProps {
    onCancel: () => void;
    onSave: (task: { title: string; date?: string; time?: string }) => void;
}

export default function NewTaskCardInput({
    onCancel,
    onSave,
}: NewTaskCardInputProps) {
    const [input, setInput] = useState("");
    const [parsed, setParsed] = useState<{ date?: string; time?: string }>({});
    const inputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        inputRef.current?.focus();
    }, []);

    // Smart parsing logic
    useEffect(() => {
        const results = chrono.parse(input);
        if (results.length > 0) {
            const parsedDate = results[0].start;
            const dateObj = parsedDate.date();

            const localDate = new Date(
                dateObj.getTime() - dateObj.getTimezoneOffset() * 60000
            );
            const [date, time] = localDate.toISOString().split("T");

            setParsed({
                date,
                time: time.slice(0, 5),
            });
        } else {
            setParsed({});
        }
    }, [input]);

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            const cleanedTitle = input.trim();
            if (!cleanedTitle) return;
            onSave({ title: cleanedTitle, ...parsed });
        } else if (e.key === "Escape") {
            onCancel();
        }
    };

    return (
        <div className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 shadow-sm max-w-[400px]">
            <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="w-full outline-none text-sm"
                placeholder="Type a task with date/time..."
            />
            {parsed.date && (
                <div className="text-xs text-blue-600 mt-1">
                    <strong>
                        {new Date(
                            parsed.date + "T" + parsed.time
                        ).toLocaleString()}
                    </strong>
                </div>
            )}
        </div>
    );
}
