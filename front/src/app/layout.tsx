import type { Metadata } from "next";
import { Inter as FontSans } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "next-themes";
import { cn } from "@/lib/utils";
import { GlobalChatWrapper } from "@/context/globalChatContext";

export const metadata: Metadata = {
  title: "Create Next App",
  description: "Generated by create next app",
};

const fontSans = FontSans({
  subsets: ["latin"],
  variable: "--font-sans",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={cn(
          "min-h-screen bg-background font-sans antialiased",
          fontSans.variable
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <GlobalChatWrapper>{children}</GlobalChatWrapper>
        </ThemeProvider>
      </body>
    </html>
  );
}
