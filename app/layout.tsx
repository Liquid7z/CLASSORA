import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "CLASSORA — Campus Academic Workspace",
  description: "Academic communication and material distribution platform"
};

export default function RootLayout({children}:{children:React.ReactNode}) {
  return <html lang="en"><body>{children}</body></html>;
}
