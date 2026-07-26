import type { Metadata } from 'next';
import {
  Cinzel,
  Playfair_Display,
  Poppins,
  Inter,
  Great_Vibes,
  Space_Grotesk,
} from 'next/font/google';
import '../styles/main.scss';

// ── Google Fonts via next/font (self-hosted, no render-blocking network request)
const cinzel = Cinzel({
  subsets: ['latin'],
  weight: ['400', '600', '700'],
  variable: '--font-cinzel',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-playfair',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-poppins',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-inter',
  display: 'swap',
});

const greatVibes = Great_Vibes({
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-great-vibes',
  display: 'swap',
});

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  weight: ['300', '400', '500'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Photo Universe — Infinite Gallery',
  description: 'An experimental infinite spatial photo gallery',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const fontVars = [
    cinzel.variable,
    playfair.variable,
    poppins.variable,
    inter.variable,
    greatVibes.variable,
    spaceGrotesk.variable,
  ].join(' ');

  return (
    <html lang="en" className={fontVars}>
      <body>{children}</body>
    </html>
  );
}
