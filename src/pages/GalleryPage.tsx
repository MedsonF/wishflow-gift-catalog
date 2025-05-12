
import React from 'react';
import { useGiftContext } from '@/contexts/GiftContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GalleryGrid from '@/components/GalleryGrid';

const GalleryPage = () => {
  const { galleryImages } = useGiftContext();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Galeria de Fotos</h1>
          <p className="text-gray-600">
            Confira nossa galeria de momentos especiais.
          </p>
        </div>

        <GalleryGrid images={galleryImages} />
      </main>
      
      <Footer />
    </div>
  );
};

export default GalleryPage;
