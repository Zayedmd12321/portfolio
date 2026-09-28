import type { Metadata } from "next";
import { OSProvider } from "@/context/OSContext";
import "./globals.css"; // Ensure this path points to your CSS file

export const metadata: Metadata = {
  title: "Md Zayed Ghanchi — Portfolio",
  description: "Software Engineer | Building resilient, large-scale web systems. B.Tech Aerospace @ IIT Kharagpur.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {/* The Provider must wrap 'children' */}
        <OSProvider>
          {children}
        </OSProvider>
      </body>
    </html>
  );
}