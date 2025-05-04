"use client";
import React, { useState } from "react";
import * as Icon from "react-feather";
import Image from "next/image";

export default function AuthPage() {
    const [isSignUpPasswordVisible, setIsSignUpPasswordVisible] =
        useState(false);

    const [isSignInPasswordVisible, setIsSignInPasswordVisible] =
        useState(false);

    return (
        <div className="m-auto bg-center h-dvh  flex flex-col justify-between md:w-9/12 lg:w-7/12">
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
                    {/* //? Sign up / sign in container */}
                    <div className="space-y-2 bg-white border-gray-200 border-1 flex-1 rounded-3xl p-5 min-w-[400]">
                        <div className="text-xl mb-6">
                            Sign into your account
                        </div>

                        <input
                            className="rounded-xl p-2 border-1 border-gray-200 w-full"
                            placeholder="Email"
                            type="email"
                        />
                        <div className="flex items-center gap-2">
                            <input
                                className="rounded-xl p-2 border-1 border-gray-200 w-full"
                                placeholder="Password"
                                type={`${
                                    isSignInPasswordVisible
                                        ? "text"
                                        : "password"
                                }`}
                            />
                            <button
                                className={`flex items-center justify-center w-11 h-10 rounded-xl cursor-pointer ${
                                    isSignInPasswordVisible
                                        ? " bg-[#0a0a0a] text-white"
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

                        <button className="w-full bg-[#4E6813] hover:bg-[#4E6813]/90 cursor-pointer text-white font-semibold p-2 rounded-xl  transition-colors duration-50">
                            Sign In
                        </button>
                    </div>

                    {/* // ? Sign Up container */}
                    <div className="space-y-2 bg-white border-gray-200 border-1 flex-1 rounded-3xl p-5 min-w-[400]">
                        <div className="text-xl mb-6">Or create an account</div>

                        <input
                            className="rounded-xl p-2 border-1 border-gray-200 w-full"
                            placeholder="Email"
                            type="email"
                        />
                        <input
                            className="rounded-xl p-2 border-1 border-gray-200 w-full"
                            placeholder="Your name"
                            type="text"
                        />
                        <div className="flex items-center gap-2">
                            <input
                                className="rounded-xl p-2 border-1 border-gray-200 w-full"
                                placeholder="Set a password"
                                type={`${
                                    isSignUpPasswordVisible
                                        ? "text"
                                        : "password"
                                }`}
                            />
                            <button
                                className={`flex items-center justify-center w-11 h-10 rounded-xl cursor-pointer ${
                                    isSignUpPasswordVisible
                                        ? " bg-[#0a0a0a] text-white"
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

                        <button className="w-full mt-2 bg-gray-800 hover:bg-gray-800/90 cursor-pointer text-white font-semibold p-2 rounded-xl  transition-colors duration-50">
                            Sign up
                        </button>
                    </div>
                </div>
            </div>

            <div className="h-10 w-10 bg-red-300/50"></div>
        </div>
    );
}
