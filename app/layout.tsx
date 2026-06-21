// app/layout.tsx

import "./globals.css"
import { ThemeProvider } from "@/components/providers/theme-provider"
import { AuthStoreProvider } from "@/components/providers/auth-store-provider"
import { cn } from "@/lib/utils"
import { Geist, Geist_Mono, Roboto } from "next/font/google"

const robotoHeading = Roboto({ 
  subsets: ['latin'], 
  weight: ['400', '700', '900'],
  variable: '--font-heading' 
})

const geist = Geist({ 
  subsets: ['latin'], 
  variable: '--font-sans' 
})

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
      className={cn("dark", fontMono.variable, geist.variable, robotoHeading.variable)}
    >
      <body className="font-sans antialiased bg-background text-foreground selection:bg-primary/30">
        <ThemeProvider>
          <AuthStoreProvider>
            {children}
          </AuthStoreProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}