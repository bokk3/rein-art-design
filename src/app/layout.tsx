import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { LanguageProvider } from "@/contexts/language-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { CookieConsentProvider } from "@/contexts/cookie-consent-context";
import { ImageSettingsProvider } from "@/contexts/image-settings-context";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Portfolio | Custom Artisan Work",
  description: "Discover unique custom projects and artisan work. Browse our portfolio of handcrafted pieces made with quality materials and attention to detail.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const saved = localStorage.getItem('theme');
                let theme;
                if (saved === 'system' || !saved) {
                  theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                } else {
                  theme = saved;
                }
                document.documentElement.classList.toggle('dark', theme === 'dark');
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 transition-colors`}
      >
        <ThemeProvider>
          <LanguageProvider>
            <CookieConsentProvider>
              <ImageSettingsProvider>
                <AnalyticsTracker />
                <Navigation />
                <main>{children}</main>
                <Footer />
                <CookieBanner />
              </ImageSettingsProvider>
            </CookieConsentProvider>
          </LanguageProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
