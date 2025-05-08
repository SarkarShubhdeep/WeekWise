import React from "react";

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
            <nav className="flex items-center w-full justify-between bg-red-50">
                {/* //? Today's day 
                // todo: on click will switch view to current week 
                */}
                <div className="flex flex-col gap-2 w-fit">
                    <div className="flex items-center text-2xl font-bold gap-2">
                        Wednesday
                        <div className="h-5 w-5 bg-amber-600 rounded-full"></div>
                    </div>

                    <div className="flex items-center gap-1 bg-gray-100">
                        <button className="hover:bg-gray-700 hover:text-white p-2 bg-red-200 rounded-full">
                            prev week
                        </button>
                        may 5 - sun 11
                        <button className="hover:bg-gray-700 hover:text-white p-2 bg-red-200 rounded-full">
                            next week
                        </button>
                    </div>
                </div>

                {/* //? Today's day 
                // todo: on click will switch view to current week 
                */}
                <div className="flex flex-col gap-2">
                    <div className="h-16 w-16 bg-red-200 border-1 border-gray-300 rounded-full"></div>
                </div>
            </nav>

            {/* //? --------ADD NEW TASK BAR & TASK OPTIONS--------- */}
            <div className="w-full h-10 bg-red-100 mt-5">
                Add task and task options
            </div>

            {/* //? --------WEEK / DAYS (min 2 days, max 7 days) TASKS SECTION--------- */}
            <div className="w-full h-10 bg-red-100 mt-5">
                Add task and task options
            </div>
        </div>
    );
}
