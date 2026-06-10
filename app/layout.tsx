import { Geist, Geist_Mono, Roboto } from "next/font/google"

import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AuthStoreProvider } from "@/components/providers/auth-store-provider";
import { cn } from "@/lib/utils";

const robotoHeading = Roboto({ subsets: ['latin'], variable: '--font-heading' });

const geist = Geist({ subsets: ['latin'], variable: '--font-sans' })

const fontMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
})

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={cn("antialiased", fontMono.variable, "font-sans", geist.variable, robotoHeading.variable)}
    >
      <body>
        <ThemeProvider>
          <AuthStoreProvider>
            {children}
          </AuthStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
