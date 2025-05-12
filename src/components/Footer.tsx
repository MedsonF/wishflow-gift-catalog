
import React from 'react';
import { useGiftContext } from '@/contexts/GiftContext';

const Footer: React.FC = () => {
  const { siteSettings } = useGiftContext();

  return (
    <footer className="bg-gray-100 py-8 mt-12">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="mb-4 md:mb-0">
            <h3 className="text-lg font-semibold text-primary">{siteSettings.title}</h3>
            <p className="text-gray-600 mt-1 max-w-md">
              {siteSettings.description}
            </p>
          </div>
          <div className="flex flex-col items-center md:items-end">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} Lista de Presentes
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Todos os direitos reservados
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
