import type { Metadata, Viewport } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";
import { CalorieShotProvider } from "@/components/calorieshot/provider";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "CalorieShot — Snap it. Know it. Track it.",
  description:
    "AI-powered nutrition tracking. Snap a photo of your meal and instantly see calories, macros, and full nutrition.",
  keywords: [
    "CalorieShot",
    "nutrition",
    "AI",
    "meal tracking",
    "calories",
    "macros",
    "food scanner",
  ],
  authors: [{ name: "CalorieShot" }],
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "CalorieShot",
  },
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/icon-192.png", sizes: "192x192", type: "image/png" }],
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFBFC" },
    { media: "(prefers-color-scheme: dark)", color: "#0A0F1F" },
  ],
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

// Inline script to apply theme BEFORE React hydrates — avoids flash
const themeScript = `
(function() {
  try {
    var stored = localStorage.getItem('calorieshot_theme');
    var mql = window.matchMedia('(prefers-color-scheme: dark)');
    var isDark = stored ? stored === 'dark' : mql.matches;
    if (isDark) document.documentElement.classList.add('dark');
  } catch (e) {}
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body
        className={`${spaceGrotesk.variable} font-sans antialiased bg-background text-foreground`}
      >
        <CalorieShotProvider>{children}</CalorieShotProvider>
      </body>
    </html>
  );
}
