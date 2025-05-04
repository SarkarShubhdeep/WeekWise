"use client";
import React, { useState } from "react";
import * as Icon from "react-feather";
import Image from "next/image";

export default function UserPreferences() {
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    return (
        <div className="m-auto bg-center h-dvh flex flex-col  justify-center md:w-10/12 lg:w-4/12 ">
            {/* <div className="h-10 w-10 bg-red-300/50"></div> */}
            <div className="text-2xl flex items-center gap-3 py-5">
                <button className="w-14 h-14 rounded-full hover:bg-black/10 flex justify-center items-center">
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
                        {/* <Image
                            src="/"
                            width={100}
                            height={100}
                            alt="user avatar"
                            className="bg-red-200 h-20 w-20 rounded-full border-1 border-green-500"
                        /> */}
                        <div className="text-3xl flex justify-center items-center h-20 w-20 rounded-full border-1 border-green-500">
                            SS
                        </div>
                        <div className="space-y-1">
                            <span className="text-xl block text-gray-500">
                                [username]
                            </span>
                            <span className="block text-gray-500">
                                [user@email.com]
                            </span>
                        </div>
                    </div>
                    <button className="flex items-center w-fit ps-2 pe-4 bg-red-500 hover:bg-red-700 cursor-pointer text-white font-semibold p-2 rounded-xl  transition-colors duration-50">
                        <Icon.LogOut height={20} /> &nbsp; Logout
                    </button>
                </div>
            </div>

            {/* //? Update password */}
            <div className="bg-white flex flex-col gap-4 p-5 border-1 border-t-0 border-gray-200">
                <div className="text-xs w-full uppercase text-gray-500 mb-2">
                    change password
                </div>
                <div className="flex gap-4 items-start">
                    <div className="flex flex-1">
                        <input
                            className="rounded-xl p-2 border-1 border-gray-200 w-full"
                            placeholder="Current password"
                            type={isPasswordVisible ? "text" : "password"}
                        />
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <input
                            className="rounded-xl p-2 border-1 border-gray-200 w-full"
                            placeholder="New password"
                            type={isPasswordVisible ? "text" : "password"}
                        />
                        <input
                            className="rounded-xl p-2 border-1 border-gray-200 w-full"
                            placeholder="Confirm password"
                            type={isPasswordVisible ? "text" : "password"}
                        />
                    </div>
                </div>
                <div className="flex justify-between">
                    <button
                        onClick={() => setIsPasswordVisible((prev) => !prev)}
                        className="text-blue-600 bg-limeGlow text-sm flex items-center h-10 justify-center p-2 cursor-pointer"
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
                    <button className="w-fit px-4 bg-gray-800 hover:bg-gray-800/90 cursor-pointer text-white font-semibold p-2 rounded-xl  transition-colors duration-50">
                        Update
                    </button>
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
