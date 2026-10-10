import { Ranchers, Figtree } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { AccessibilityProvider } from "@/context/AccessibilityContext";
import CursorEffects from "@/components/CursorEffects";
import AccessibilityDock from "@/components/AccessibilityDock";
import PageLoader from "@/components/PageLoader";
import CookieNotice from "@/components/CookieNotice";

// Sign-painter headlines and a friendly body face.
const ranchers = Ranchers({
  variable: "--font-ranchers",
  subsets: ["latin"],
  weight: "400",
});

const figtree = Figtree({
  variable: "--font-figtree",
  subsets: ["latin"],
});


export const metadata = {
  title: "Kodo · Help Kodo find the way home",
  description:
    "A cozy coding game for kids. Snap blocks together, guide Kodo through gardens and woods, and learn real programming ideas with no typing.",
};

export const viewport = {
  themeColor: "#f7f4ea",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${ranchers.variable} ${figtree.variable}`}>
      <body className="antialiased">
        <AccessibilityProvider>
          <AuthProvider>
            <PageLoader />
            <CursorEffects />
            {children}
            <AccessibilityDock />
            <CookieNotice />
          </AuthProvider>
        </AccessibilityProvider>
      </body>
    </html>
  );
}
