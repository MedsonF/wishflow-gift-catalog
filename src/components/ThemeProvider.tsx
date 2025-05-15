import { useEffect } from 'react';
import { useGiftContext } from '@/contexts/GiftContext';

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { siteSettings } = useGiftContext();

  useEffect(() => {
    // Atualiza as variáveis CSS quando as configurações mudarem
    document.documentElement.style.setProperty('--primary-color', siteSettings.primaryColor);
    document.documentElement.style.setProperty('--background-color', siteSettings.backgroundColor);
  }, [siteSettings.primaryColor, siteSettings.backgroundColor]);

  return <>{children}</>;
}; 