import type { Config } from "tailwindcss";
const config: Config = { content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"], theme: { extend: { colors: { ink:"#292943", muted:"#9290a5", brand:"#7464c8", lavender:"#f0edff", canvas:"#f6f5fb" }, boxShadow:{soft:"0 12px 35px rgba(51,43,91,.06)"} } }, plugins: [] };
export default config;