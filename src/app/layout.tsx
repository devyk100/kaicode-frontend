  import type { Metadata } from "next";
  import { Geist, Geist_Mono } from "next/font/google";
  import "./globals.css";
  import { ThemeProvider } from "@/components/providers/theme-provider";
  import { CustomNavigationMenu } from "@/components/ui/custom-navbar";
  import { Toaster } from "@/components/ui/toaster";
  import { Analytics } from "@vercel/analytics/react"
  const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
  });

  const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
  });

  export const metadata: Metadata = {
    title: "Kaicode",
    description: "A collaborative programming playground.",
  };

  export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <html lang="en" suppressHydrationWarning>
        <body
          className={`${geistSans.variable} ${geistMono.variable} antialiased overflow-x-hidden`}
        >
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            
              <CustomNavigationMenu />
            {children}
            <Toaster />
          </ThemeProvider>
          <Analytics />
        </body>
      </html>
    );
  }
