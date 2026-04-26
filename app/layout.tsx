import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google"; // 🔥 Fix: next/font/google
import "./globals.css";
import { Toaster } from 'react-hot-toast';

// Font configuration
const jakarta = Plus_Jakarta_Sans({ 
  subsets: ["latin"],
  weight: ['400', '500', '600', '700', '800'],
});

export const metadata: Metadata = {
  title: "SAAS Pulse - Syed Dawar Ali Shah",
  description: "Advanced Usage Analytics Core",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en"> 
      <body className={`${jakarta.className} antialiased bg-black text-white selection:bg-[#CCFF00] selection:text-black`}>
        <Toaster position="top-right" reverseOrder={false} />
        {children}
      </body>
    </html>
  );
}