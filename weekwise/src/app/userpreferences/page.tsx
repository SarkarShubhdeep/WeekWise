"use client";
import React, { useEffect, useState } from "react";
import * as Icon from "react-feather";
import Image from "next/image";
import TextField from "@/components/TextField";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { useUser } from "@/contexts/UserContext";

import { toast } from "sonner";

export default function UserPreferences() {
    // ? next router
    const router = useRouter();
    // ? determines if the page is entereing or exiting
    const [leaving, setLeaving] = useState(false);
    // ? passowrd visibility toggle
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    // ? getting user details via UserContext
    const { profile, loading } = useUser();

    // ? fields for updating password
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [updating, setUpdating] = useState(false);
    const [errorMsg, setErrorMsg] = useState("");

    // ? HANDLING FADE OUT TRANSITION ON EXIT
    const handleBack = () => {
        // start fade‑out
        setLeaving(true);

        // after animation (400ms), navigate
        setTimeout(() => {
            if (window.history.length > 1) {
                router.back();
            } else {
                router.replace("/home");
            }
        }, 150);
    };

    // ? LOGOUT LOGIC
    const handleLogout = async () => {
        const { error } = await supabase.auth.signOut();

        if (error) {
            alert("Error logging out: " + error.message);
        } else {
            router.replace("/auth");
        }
    };

    // ? UPDATE PASSWORD LOGIC
    const handlePasswordUpdate = async () => {
        setErrorMsg("");

        if (!currentPassword || !newPassword || !confirmPassword) {
            setErrorMsg("Please fill out all fields.");
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorMsg("New passwords do not match.");
            return;
        }

        setUpdating(true);

        const { data, error } = await supabase.auth.updateUser({
            password: newPassword,
        });

        if (error) {
            setErrorMsg(error.message);
            toast.error("Error updating password.");
        } else {
            setCurrentPassword("");
            setNewPassword("");
            setConfirmPassword("");
            toast.success("Password updated!");
        }

        setUpdating(false);
    };

    useEffect(() => {
        if (!loading && !profile) {
            // ? a fallback, if the profile is empty rendering of this page will stop and will route will be replaced to auth
            router.replace("/auth");
        }
    }, [loading, profile, router]);

    if (loading) {
        return <div className="p-6 text-center">Loading…</div>;
    }
    if (!profile) {
        return null;
    }

    const initials = profile.full_name
        .split(" ")
        .map((w) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase();

    // While loading or redirecting, show nothing (or a spinner)
    if (loading || !profile) {
        return <div className="p-6 text-center">Loading…</div>;
    }

    return (
        <div
            className={`m-auto w-11/12 bg-center h-dvh flex flex-col justify-center md:w-10/12 lg:w-6/12 max-w-[700] p-6 ${
                leaving ? "animate-fade-out-right" : "animate-fade-in-right"
            }`}
        >
            <div className="text-2xl flex items-center gap-3 py-5">
                <button
                    className="w-14 h-14 rounded-full hover:bg-black/10 flex justify-center items-center"
                    onClick={handleBack}
                >
                    <Icon.ArrowLeft />
                </button>
                User Preferences
            </div>

            {/* // ? Name and user details */}
            <div className="bg-white flex flex-col gap-4 p-5 border-1 border-gray-200 rounded-t-3xl">
                <div className="text-xs w-full uppercase text-gray-500 mb-2">
                    Profile
                </div>
                <div className="flex items-center gap-4 justify-between">
                    <div className="flex items-center gap-4">
                        <div className="text-3xl flex justify-center items-center h-20 w-20 rounded-full border-1 border-green-500">
                            {initials}
                        </div>
                        <div className="space-y-1">
                            <span className="text-xl block text-gray-500">
                                {profile.full_name}
                            </span>
                            <span className="block text-gray-500">
                                {profile.email}
                            </span>
                        </div>
                    </div>
                    <Button
                        className="flex items-center ps-2 bg-red-600 hover:bg-red-700"
                        onClick={handleLogout}
                    >
                        <Icon.LogOut height={20} /> &nbsp; Logout
                    </Button>
                </div>
            </div>

            {/* //? Update password */}
            <div className="bg-white flex flex-col gap-4 p-5 border-1 border-t-0 border-gray-200">
                <div className="text-xs w-full uppercase text-gray-500 mb-2">
                    change password
                </div>
                <div className="flex gap-4 items-start">
                    <div className="flex flex-1">
                        <TextField
                            placeholder="Current password"
                            type={isPasswordVisible ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <TextField
                            placeholder="New password"
                            type={isPasswordVisible ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <TextField
                            placeholder="Confirm password"
                            type={isPasswordVisible ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                    </div>
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={() => setIsPasswordVisible((prev) => !prev)}
                        className="text-blue-600 text-sm flex items-center h-10 justify-center p-2 cursor-pointer"
                    >
                        {isPasswordVisible ? (
                            <>
                                <Icon.Eye height={20} className="mr-1" />
                                Password visible
                            </>
                        ) : (
                            <>
                                <Icon.EyeOff height={20} className="mr-1" />
                                Password hidden
                            </>
                        )}
                    </button>
                    <div className="flex items-center space-x-2">
                        {errorMsg && (
                            <div className="text-sm text-red-600 mt-2 transition-all duration-100 me-2">
                                {errorMsg}
                            </div>
                        )}
                        <Button
                            onClick={handlePasswordUpdate}
                            disabled={updating}
                            className="w-fit"
                        >
                            {updating ? "Updating…" : "Update"}
                        </Button>
                    </div>
                </div>
            </div>

            {/* //? Update password */}
            <div className="bg-white flex flex-col gap-4 p-5 border-1 border-t-0 border-gray-200 rounded-b-3xl">
                <div className="text-xs w-full uppercase text-gray-500 mb-2">
                    next section
                </div>
            </div>
        </div>
    );
}
