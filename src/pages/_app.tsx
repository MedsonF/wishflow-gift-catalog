import type { AppProps } from 'next/app';
import { GiftProvider } from '@/contexts/GiftContext';
import { ThemeProvider } from '@/components/ThemeProvider';
import '@/styles/globals.css';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <GiftProvider>
      <ThemeProvider>
        <Component {...pageProps} />
      </ThemeProvider>
    </GiftProvider>
  );
} 