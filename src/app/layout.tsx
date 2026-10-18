import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ClientProviders } from "@/components/providers/client-providers";
import { CommandBar } from "@/components/command-bar";
import { SwarmNotifications } from "@/components/global/swarm-notifications";
import ErrorBoundary from "@/components/global/error-boundary";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://pixalified-ai.com"),
  title: {
    default: "Pixalified AI | Autonomous Marketing OS",
    template: "%s | Pixalified AI"
  },
  description: "Advanced autonomous AI marketing operating system for enterprise-scale strategy orchestration and predictive ROI.",
  keywords: ["AI Marketing", "Autonomous Agents", "Marketing OS", "Pixalified", "Swarm Intelligence"],
  authors: [{ name: "Pixalified Team" }],
  creator: "Pixalified AI",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://pixalified-ai.com",
    siteName: "Pixalified AI",
    title: "Pixalified AI | Autonomous Marketing OS",
    description: "Orchestrate your entire marketing strategy with a unified AI swarm.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Pixalified AI Marketing OS",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Pixalified AI | Autonomous Marketing OS",
    description: "Autonomous AI marketing operating system for modern enterprises.",
    images: ["/og-image.png"],
    creator: "@pixalified",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <ClientProviders>
          <ErrorBoundary>
            <CommandBar />
            <SwarmNotifications />
            {children}
          </ErrorBoundary>
        </ClientProviders>
      </body>
    </html>
  );
}
