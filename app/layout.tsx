import type { Metadata } from "next";
import "./globals.css";
import Providers from "@/app/components/Providers";
import Navbar from "@/app/components/Navbar";

export const metadata: Metadata = {
  title: "ECommerce Store",
  description: "A modern ecommerce store built with Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang='en'>
      <body className='font-sans antialiased'>
        <Providers>
          <Navbar />
          <main className='pt-16 min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50'>
            {children}
          </main>
        </Providers>
      </body>
    </html>
  );
}
