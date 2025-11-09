import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Navigation } from "@/components/layout/navigation";
import { Footer } from "@/components/layout/footer";
import { CookieBanner } from "@/components/layout/cookie-banner";
import { AnalyticsTracker } from "@/components/analytics-tracker";
import { LanguageProvider } from "@/contexts/language-context";
import { ThemeProvider } from "@/contexts/theme-context";
import { CookieConsentProvider } from "@/contexts/cookie-consent-context";
import { ImageSettingsProvider } from "@/contexts/image-settings-context";

const karla = localFont({
  src: [
    {
      path: "./fonts/Karla-Regular.woff2",
      weight: "400",
      style: "normal",
    },
    {
      path: "./fonts/Karla-Medium.woff2",
      weight: "500",
      style: "normal",
    },
    {
      path: "./fonts/Karla-SemiBold.woff2",
      weight: "600",
      style: "normal",
    },
    {
      path: "./fonts/Karla-Bold.woff2",
      weight: "700",
      style: "normal",
    },
    {
      path: "./fonts/Karla-Italic.woff2",
      weight: "400",
      style: "italic",
    },
    {
      path: "./fonts/Karla-MediumItalic.woff2",
      weight: "500",
      style: "italic",
    },
    {
      path: "./fonts/Karla-SemiBoldItalic.woff2",
      weight: "600",
      style: "italic",
    },
    {
      path: "./fonts/Karla-BoldItalic.woff2",
      weight: "700",
      style: "italic",
    },
  ],
  variable: "--font-karla",
  display: "swap",
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
    <html lang="en" suppressHydrationWarning className={karla.variable}>
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
        className="antialiased bg-white dark:bg-[#181818] text-gray-900 dark:text-gray-100 transition-colors font-sans"
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
