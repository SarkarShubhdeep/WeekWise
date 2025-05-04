import type { Config } from "tailwindcss";

const config: Config = {
    darkMode: "class", // Enables class-based dark mode
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            // You can extend your theme here
            colors: {
                lineGlow: "#CEF17B",
            },
        },
    },
    plugins: [],
};

export default config;
