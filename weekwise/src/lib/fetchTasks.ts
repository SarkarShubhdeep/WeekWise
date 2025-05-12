// A simple function to fetch all the tasks from the Supabase.
// We use this anywhere we like then to get the tasks

import { supabase } from "@/lib/supabaseClient";

export async function fetchAllTasks() {
    const { data, error } = await supabase
        .from("tasks")
        .select("*")
        .order("date", { ascending: true });

    if (error) {
        console.error("Failed to fetch tasks:", error);
        return [];
    }

    return data;
}
