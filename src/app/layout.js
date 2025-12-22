import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import CursorEffects from "@/components/CursorEffects";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Kogo - Learn Programming with Blocks",
  description: "An interactive block-based programming game to learn coding concepts",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <AccessibilityProvider>
          <AuthProvider>
            <CursorEffects />
            {children}
          </AuthProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
