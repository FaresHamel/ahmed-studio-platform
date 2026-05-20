import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
        "./sections/**/*.{js,ts,jsx,tsx,mdx}",
    ],

    theme: {
        extend: {
            colors: {
                primary: "#77510A",
                navbarInactive: "#3C3C3C80",
                descriptionBlack: "#000000",
                sectionTitle: "#937052",
                backgroundLight: "#F8F6F2",
                borderColor: "#E7E0D8",
                whiteText: "#FFFFFF",
            },
            fontFamily: {
                body: ["var(--font-poppins)"],
                title: ["var(--font-playfair)"],
            },
        },
    },

    plugins: [],
};

export default config;