import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'AUREL — Immersive Property Experience | The Residences at Emerald Bay',
  description:
    'Explore AUREL Residences: a cinematic 3D architectural visualization of ultra-luxury residential towers, floor-by-floor navigation, interactive floor plans, and residence gallery.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="antialiased bg-[#08080a] text-[#f5f2eb] overflow-hidden selection:bg-[#c5a059] selection:text-black">
        {children}
      </body>
    </html>
  );
}
