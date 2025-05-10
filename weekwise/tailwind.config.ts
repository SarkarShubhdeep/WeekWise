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
                primary: {
                    50: "#f2f8e9",
                    100: "#e3f0c7",
                    200: "#cadf95",
                    300: "#adc861",
                    400: "#8cab3a",
                    500: "#4E6813", // your base primary
                    600: "#405510",
                    700: "#32420d",
                    800: "#232e09",
                    900: "#141a05",
                },
                somecolor: "#4E6813",
            },
        },
    },
    plugins: [],
};

export default config;
