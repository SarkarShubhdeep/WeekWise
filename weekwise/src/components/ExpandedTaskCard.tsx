"use client";

import React, { useState, useEffect, FC } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import TextField from "@/components/TextField";
import Button from "@/components/Button";

interface ExpandedTaskCardProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: {
        title: string;
        date?: string;
        time?: string;
        description: string;
        is_completed: boolean;
    }) => void;
    initialData: {
        title: string;
        date?: string;
        time?: string;
        description: string;
        is_completed: boolean;
    };
    anchorRect: DOMRect;
}

const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.95, y: 10 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.95, y: 10 },
};

const ExpandedTaskCard: FC<ExpandedTaskCardProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
    anchorRect,
}) => {
    const [title, setTitle] = useState(initialData.title);
    const [date, setDate] = useState(initialData.date || "");
    const [time, setTime] = useState(initialData.time || "");
    const [description, setDescription] = useState(initialData.description);
    const [completed, setCompleted] = useState(initialData.is_completed);

    useEffect(() => {
        if (isOpen) {
            setTitle(initialData.title);
            setDate(initialData.date || "");
            setTime(initialData.time || "");
            setDescription(initialData.description);
            setCompleted(initialData.is_completed);
        }
    }, [isOpen, initialData]);

    const handleSave = () => {
        onSave({ title, date, time, description, is_completed: completed });
        onClose();
    };

    const cardWidth = 300;
    const cardHeight = 380;

    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const fitsRight = anchorRect.right + cardWidth + 12 < viewportWidth;
    const fitsLeft = anchorRect.left - cardWidth - 12 > 0;

    const left = fitsRight
        ? anchorRect.right + 12
        : fitsLeft
        ? anchorRect.left - cardWidth - 12
        : (viewportWidth - cardWidth) / 2;

    let top = anchorRect.top;
    const buffer = 100;

    if (top + cardHeight + buffer > viewportHeight) {
        top = viewportHeight - cardHeight - buffer;
    }
    if (top < buffer) {
        top = buffer;
    }
    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed z-50 bg-white shadow-lg rounded-xl border p-4 w-[300px] max-h-[90vh] overflow-y-auto"
                    style={{ top, left }}
                    variants={modalVariants}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    transition={{ duration: 0.2 }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <h2 className="mb-4 text-xl font-semibold">Edit Task</h2>

                    <div className="space-y-4">
                        <TextField
                            className="w-full"
                            placeholder="Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                        />

                        <div className="flex gap-2">
                            <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">
                                    Date
                                </label>
                                <input
                                    type="date"
                                    className="w-full border rounded-xl p-2"
                                    value={date}
                                    onChange={(e) => setDate(e.target.value)}
                                />
                            </div>
                            <div className="flex-1">
                                <label className="block text-sm text-gray-600 mb-1">
                                    Time
                                </label>
                                <input
                                    type="time"
                                    className="w-full border rounded-xl p-2"
                                    value={time}
                                    onChange={(e) => setTime(e.target.value)}
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-600 mb-1">
                                Description
                            </label>
                            <textarea
                                className="w-full border rounded-xl p-2 h-24 resize-none"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                            />
                        </div>

                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={completed}
                                onChange={() => setCompleted((c) => !c)}
                                className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-400"
                            />
                            <span className="text-sm text-gray-700">
                                Completed
                            </span>
                        </label>
                    </div>

                    <div className="mt-6 flex justify-end gap-2">
                        <button
                            className="bg-transparent p-2 text-gray-800 hover:bg-gray-200 rounded-xl"
                            onClick={onClose}
                        >
                            Cancel
                        </button>
                        <Button onClick={handleSave}>Save</Button>
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ExpandedTaskCard;
