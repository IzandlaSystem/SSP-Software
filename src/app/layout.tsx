import type { Metadata } from "next";
import { Suspense } from "react";
import NavigationProgress from "@/components/layout/NavigationProgress";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "SSP Pro | Smart Sports Performance Platform",
  description: "Professional sports performance tracking for coaches, athletes, and team sessions.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col" suppressHydrationWarning>
        <ThemeProvider>
          <Suspense fallback={null}>
            <NavigationProgress />
          </Suspense>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
