"use client";
import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from "react";
import { supabase } from "@/lib/supabaseClient";

interface UserProfile {
    id: string;
    email: string | null;
    full_name: string;
}

interface UserContextValue {
    profile: UserProfile | null;
    loading: boolean;
}

const UserContext = createContext<UserContextValue>({
    profile: null,
    loading: true,
});

export function UserProvider({ children }: { children: ReactNode }) {
    const [profile, setProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        let mounted = true;

        const loadProfile = async () => {
            // 1) get supabase auth user
            const {
                data: { user },
            } = await supabase.auth.getUser();
            if (!user) {
                setProfile(null);
                setLoading(false);
                return;
            }

            // 2) get `full_name` from public.users (or metadata fallback)
            const { data: p } = await supabase
                .from("users")
                .select("full_name")
                .eq("id", user.id)
                .single();

            if (!mounted) return;
            setProfile({
                id: user.id,
                email: user.email ?? "",
                full_name:
                    p?.full_name ||
                    (user.user_metadata as any)?.full_name ||
                    "",
            });
            setLoading(false);
        };

        loadProfile();

        // update on auth changes (e.g. after login)
        const { data: sub } = supabase.auth.onAuthStateChange(
            (_event, sess) => {
                if (sess?.user && !profile) {
                    loadProfile();
                }
                if (!sess) {
                    setProfile(null);
                    setLoading(false);
                }
            }
        );

        return () => {
            mounted = false;
            sub.subscription.unsubscribe();
        };
    }, []);

    return (
        <UserContext.Provider value={{ profile, loading }}>
            {children}
        </UserContext.Provider>
    );
}

export const useUser = () => useContext(UserContext);
