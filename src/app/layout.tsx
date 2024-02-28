import type { Metadata } from "next";
import { Inter } from "next/font/google";

import "@styles/globals.css";
import Header from "@components/Header";
import Footer from "@components/Footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: 'Dinesh Haribabu',
  description: 'A front-end web developer focused on crafting clean and intuitive interfaces providing better UX.',
  authors: {
    name: 'Dinesh Haribabu',
    url: 'https://dineshharibabu.in/'
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <Header></Header>
        <main className="p-8 pt-12 pb-16 dark:text-slate-20 max-w-7xl m-auto min-h-full">
          {children}
        </main>
        <Footer></Footer>
      </body>
    </html>
  );
}
