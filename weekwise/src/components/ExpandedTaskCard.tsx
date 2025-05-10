"use client";

import React, { useState, useEffect, FC } from "react";
import { AnimatePresence, motion, Variants } from "framer-motion";
import TextField from "@/components/TextField";
import Button from "@/components/Button";

import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export interface ExpandedTaskCardProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: {
        title: string;
        datetime: string;
        description: string;
        is_completed: boolean;
    }) => void;
    initialData: {
        title: string;
        datetime: string;
        description: string;
        is_completed: boolean;
    };
}

const backdropVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
};

const modalVariants: Variants = {
    hidden: { opacity: 0, scale: 0.8, y: 20 },
    visible: { opacity: 1, scale: 1, y: 0 },
    exit: { opacity: 0, scale: 0.8, y: 20 },
};

const ExpandedTaskCard: FC<ExpandedTaskCardProps> = ({
    isOpen,
    onClose,
    onSave,
    initialData,
}) => {
    const [title, setTitle] = useState(initialData.title);
    const [datetime, setDatetime] = useState(initialData.datetime);
    const [description, setDescription] = useState(initialData.description);
    const [completed, setCompleted] = useState(initialData.is_completed);

    // Only reset when the modal opens
    useEffect(() => {
        if (isOpen) {
            setTitle(initialData.title);
            setDatetime(initialData.datetime);
            setDescription(initialData.description);
            setCompleted(initialData.is_completed);
        }
    }, [isOpen]);

    const handleSave = () => {
        onSave({ title, datetime, description, is_completed: completed });
        onClose();
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
                    variants={backdropVariants}
                    initial="hidden"
                    animate="visible"
                    exit="hidden"
                    onClick={onClose}
                >
                    <motion.div
                        className="relative w-full max-w-md rounded-3xl bg-white p-6 shadow-xl"
                        variants={modalVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        transition={{ duration: 0.2 }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h2 className="mb-4 text-xl font-semibold">
                            Edit Task
                        </h2>

                        <div className="space-y-4">
                            <TextField
                                className="w-full"
                                placeholder="Title"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />

                            <div>
                                <label className="mb-1 block text-sm text-gray-600">
                                    Date &amp; Time
                                </label>
                                <input
                                    type="datetime-local"
                                    className="w-full rounded-xl border border-gray-200 p-2"
                                    value={datetime}
                                    onChange={(e) =>
                                        setDatetime(e.target.value)
                                    }
                                />
                            </div>

                            <div>
                                <label className="mb-1 block text-sm text-gray-600">
                                    Description
                                </label>
                                <textarea
                                    className="w-full rounded-xl border-gray-200 border p-2 h-24 resize-none"
                                    value={description}
                                    onChange={(e) =>
                                        setDescription(e.target.value)
                                    }
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
                </motion.div>
            )}
        </AnimatePresence>
    );
};

export default ExpandedTaskCard;
