"use client";
import React, { useState } from "react";
import * as Icon from "react-feather";
import Image from "next/image";
import Button from "@/components/Button";
import TextField from "@/components/TextField";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";

export default function AuthPage() {
    // ? next router
    const router = useRouter();

    // ? Sign Up fields
    const [signupEmail, setSignupEmail] = useState("");
    const [signupPassword, setSignupPassword] = useState("");
    const [signupFullName, setSignupFullName] = useState("");
    // ? Sign In fields
    const [signinEmail, setSigninEmail] = useState("");
    const [signinPassword, setSigninPassword] = useState("");

    // ? Status message
    const [statusMsg, setStatusMsg] = useState("");

    // ? Password visibility toggle states
    const [isSignUpPasswordVisible, setIsSignUpPasswordVisible] =
        useState(false);
    const [isSignInPasswordVisible, setIsSignInPasswordVisible] =
        useState(false);

    // ? SIGN UP LOGIC
    const handleSignUp = async () => {
        console.log("testing signup");
        setStatusMsg("");

        const { error } = await supabase.auth.signUp({
            email: signupEmail,
            password: signupPassword,
            options: {
                data: { full_name: signupFullName }, // stores it in auth.users.user_metadata
            },
        });

        if (error) {
            alert(error.message);
        } else {
            setStatusMsg(
                "Check your inbox to confirm your email before logging in."
            );
        }
        const session = await supabase.auth.getSession();
        console.log("Session:", session);
    };

    // ? SIGN IN LOGIC
    const handleSignIn = async () => {
        setStatusMsg("");

        const { error } = await supabase.auth.signInWithPassword({
            email: signinEmail,
            password: signinPassword,
        });

        if (error) {
            alert(error.message);
        } else {
            setStatusMsg("Successfully signed in!");
            router.replace("/home");
        }
    };

    return (
        <div className="m-auto bg-center h-dvh flex flex-col justify-between md:w-9/12 lg:w-7/12">
            <div className="h-10 w-10 bg-red-300/50"></div>
            <div className="flex flex-col gap-8">
                {/* // ? header section */}
                <div className="flex flex-col gap-3 p-5">
                    <Image
                        src="/weekwise-logo-light.svg"
                        width={200}
                        height={100}
                        alt="WeekWise logo"
                    />
                    <div className="w-3/4 text-gray-500">
                        WeekWise is a minimalist weekly task planner that helps
                        users visually organize their to-dos across a 7-day
                        layout.
                    </div>
                </div>

                <div className="flex gap-4 lg:flex-row sm:flex-col items-start">
                    {/* //? Sign in container */}
                    <div className="space-y-2 bg-white border-gray-200 border-1 rounded-3xl p-5 w-[400]">
                        <div className="text-xl mb-6">
                            Sign into your account
                        </div>

                        <TextField
                            placeholder="Email"
                            type="email"
                            value={signinEmail}
                            onChange={(e) => setSigninEmail(e.target.value)}
                        />
                        <div className="flex items-center">
                            <TextField
                                placeholder="Password"
                                type={`${
                                    isSignInPasswordVisible
                                        ? "text"
                                        : "password"
                                }`}
                                value={signinPassword}
                                onChange={(e) =>
                                    setSigninPassword(e.target.value)
                                }
                            />
                            <button
                                className={`flex items-center justify-center w-11 h-10 rounded-xl cursor-pointer ${
                                    isSignInPasswordVisible
                                        ? " bg-gray-800 text-white"
                                        : "bg-transparent text-black"
                                } transition-colors duration-100 `}
                                onClick={() =>
                                    setIsSignInPasswordVisible((prev) => !prev)
                                }
                            >
                                {isSignInPasswordVisible ? (
                                    <Icon.Eye height={20} />
                                ) : (
                                    <Icon.EyeOff height={20} />
                                )}
                            </button>
                        </div>
                        <button className="text-blue-600 bg-limeGlow text-sm flex items-center h-10 justify-center p-2 cursor-pointer">
                            Reset password
                        </button>
                        <Button
                            className="w-full bg-primary-500 hover:bg-primary-700"
                            onClick={handleSignIn}
                        >
                            Sign In
                        </Button>
                    </div>

                    {/* // ? Sign Up container */}
                    <div className="space-y-2 bg-white border-gray-200 border-1 rounded-3xl p-5 w-[400]">
                        <div className="text-xl mb-6">Or create an account</div>

                        <TextField
                            placeholder="Email"
                            type="email"
                            value={signupEmail}
                            onChange={(e) => setSignupEmail(e.target.value)}
                        />
                        <TextField
                            placeholder="Your name"
                            type="text"
                            value={signupFullName}
                            onChange={(e) => setSignupFullName(e.target.value)}
                        />

                        <div className="flex items-center">
                            <TextField
                                placeholder="Set a password"
                                type={`${
                                    isSignUpPasswordVisible
                                        ? "text"
                                        : "password"
                                }`}
                                value={signupPassword}
                                onChange={(e) =>
                                    setSignupPassword(e.target.value)
                                }
                            />
                            <button
                                className={`flex items-center justify-center w-11 h-10 rounded-xl cursor-pointer ${
                                    isSignUpPasswordVisible
                                        ? " bg-gray-800 text-white"
                                        : "bg-transparent text-black"
                                } transition-colors duration-100 `}
                                onClick={() =>
                                    setIsSignUpPasswordVisible((prev) => !prev)
                                }
                            >
                                {isSignUpPasswordVisible ? (
                                    <Icon.Eye height={20} />
                                ) : (
                                    <Icon.EyeOff height={20} />
                                )}
                            </button>
                        </div>

                        <Button className="w-full" onClick={handleSignUp}>
                            Sign Up
                        </Button>
                    </div>
                </div>
                {statusMsg && (
                    <div className="text-sm text-gray-600 mt-2">
                        {statusMsg}
                    </div>
                )}
            </div>

            <div className="h-10 w-10 bg-red-300/50"></div>
        </div>
    );
}
