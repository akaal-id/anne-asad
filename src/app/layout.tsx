import type { Metadata } from "next";
import { Lora, Mulish } from "next/font/google"; // Changed Inter to Mulish
import { BASE_PATH } from "@/lib/utils";
import "./globals.css";

const lora = Lora({
  variable: "--font-lora",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"], // Added weights for SEO/Optimization
});

const mulish = Mulish({
  variable: "--font-mulish", // Changed variable name
  subsets: ["latin"],
  display: "swap",
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "The Wedding of Aulianne & Asad",
  description: "Undangan Pernikahan Aulianne & Asad. Kami mengundang Bapak/Ibu/Saudara/i untuk hadir di acara pernikahan kami.",
  keywords: ["wedding", "undangan", "pernikahan", "aulianne", "asad"],
  icons: {
    icon: `${BASE_PATH}/icon/aa-icon.png`,
    apple: `${BASE_PATH}/icon/aa-icon.png`,
  },
  openGraph: {
    title: "The Wedding of Aulianne & Asad",
    description: "Undangan Pernikahan Aulianne & Asad",
    url: "https://anne-asad.vercel.app",
    siteName: "Aulianne & Asad Wedding",
    images: [
      {
        url: `${BASE_PATH}/images/anne-asad-cartoon.jpg`, // Updated OG Image to the couple's cartoon
        width: 1200,
        height: 630,
        alt: "Aulianne & Asad Wedding",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="scroll-smooth">
      <body
        className={`${lora.variable} ${mulish.variable} antialiased font-sans bg-white text-navy-deep`}
      >
        {children}
      </body>
    </html>
  );
}
