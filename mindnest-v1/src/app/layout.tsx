import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title:"MINDNEST — Your personal growth space", description:"A private space to understand your emotions, untangle thoughts and grow at your own pace." };
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="vi"><body>{children}</body></html>; }
