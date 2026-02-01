/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#0f172a",
                foreground: "#f8fafc",
                primary: {
                    DEFAULT: "#6366f1",
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#1e293b",
                    foreground: "#94a3b8",
                },
                muted: {
                    DEFAULT: "#334155",
                    foreground: "#94a3b8",
                },
                accent: {
                    DEFAULT: "#818cf8",
                    foreground: "#ffffff",
                },
                destructive: {
                    DEFAULT: "#ef4444",
                    foreground: "#ffffff",
                },
                border: "#1e293b",
                input: "#0f172a",
                card: "#1e293b",
                "status-open": "#22c55e",
                "status-active": "#3b82f6",
                "status-archived": "#94a3b8",
                "message-own": "#6366f1",
                "message-other": "#334155",
                "message-ai": "#581c87",
                "reaction-helpful": "#22c55e",
                "reaction-clear": "#ef4444",
                "reaction-smart": "#f59e0b",
            },
        },
    },
    plugins: [],
}
