import Button from "@/components/Button";
import TextField from "@/components/TextField";
import React from "react";
import * as Icon from "react-feather";

export default function HomePage() {
    return (
        <div className="flex flex-col m-auto w-11/12 lg:w-9/12 md:w-10/12 sm:w-11/12 h-full mt-20">
            <div className="relative w-full">
                <div className="absolute bottom-1 w-full">
                    <span className="bg-red-200 lg:hidden md:hidden sm:hidden xl:block">
                        xl or greater
                    </span>
                    <span className="bg-red-200 lg:block md:hidden sm:hidden xl:hidden">
                        lg
                    </span>
                    <span className="bg-red-200 lg:hidden md:block sm:hidden xl:hidden">
                        md
                    </span>
                    <span className="bg-red-200 lg:hidden md:hidden sm:block xl:hidden">
                        sm
                    </span>
                </div>
            </div>

            {/* //? --------TOP NAV--------- */}
            <nav className="flex items-center w-full justify-between ">
                {/* //? Today's day 
                // todo: on click will switch view to current week 
                */}
                <div className="flex flex-col gap-2 w-fit">
                    <div className="flex items-center text-2xl font-bold gap-2">
                        Wednesday
                        <div className="h-5 w-5 bg-amber-600 rounded-full"></div>
                    </div>
                </div>

                <div className="flex flex-col gap-2">
                    <div className="h-16 w-16 bg-red-200 border-1 border-gray-300 rounded-full"></div>
                </div>
            </nav>

            {/* //? --------ADD NEW TASK BAR & TASK OPTIONS--------- */}
            <div className="flex items-center justify-between w-full h-10  mt-5 ">
                <div className="flex gap-2">
                    {/* // todo: will open up a small dialog box to add task  */}
                    <button className="flex items-center ps-2 py-2 pe-3 gap-1 bg-primary-500 hover:bg-primary-700 text-white rounded-full transition-colors duration-100">
                        <Icon.Plus height={20} />
                        Add task
                    </button>

                    {/* // todo: expands open an input to search */}
                    <div className="">
                        <button className="border-1 border-gray-700 rounded-full p-2 hover:bg-gray-700 hover:text-white transition-colors duration-100">
                            <Icon.Search height={20} />
                        </button>
                    </div>
                </div>
                <div className="flex gap-2">
                    {/* // todo: show completed task bg toggle  */}
                    <button className="flex items-center px-3 py-2 bg-gray-200 rounded-full text-sm gap-1 transition-all duration-100">
                        Show completed
                    </button>

                    {/* // todo: create sorting otpions dropdown menu */}
                    <button className="flex items-center pe-3 py-2 ps-2 bg-gray-200 rounded-full text-sm gap-1 transition-all duration-100">
                        <Icon.ChevronDown height={20} />
                        Sort: Acs
                    </button>

                    {/* // todo: week switcher */}
                    <div className="flex items-center gap-0 bg-gray-200 rounded-full text-sm hover:gap-2 transition-all duration-100">
                        <button className="hover:bg-gray-700  hover:text-white  p-2 rounded-full transition-colors duration-100">
                            <Icon.ChevronLeft height={20} />
                        </button>
                        may 5 - sun 11
                        <button className="hover:bg-gray-700 hover:text-white p-2 rounded-full transition-colors duration-100">
                            <Icon.ChevronRight height={20} />
                        </button>
                    </div>
                </div>
            </div>

            {/* //? --------WEEK / DAYS (min 3 days, max 7 days) TASKS SECTION--------- */}
            <div className="w-full h-10 bg-red-100 mt-5">
                {/* 7-day (view switchable to 7, 6, 5, 4, 3 days)  */}
            </div>
        </div>
    );
}
