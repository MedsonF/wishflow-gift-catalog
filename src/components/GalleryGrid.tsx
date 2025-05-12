
import React, { useState } from 'react';
import GalleryImage from '@/components/GalleryImage';
import Lightbox from '@/components/Lightbox';
import { GalleryImage as GalleryImageType } from '@/types';

interface GalleryGridProps {
  images: GalleryImageType[];
  admin?: boolean;
  onDelete?: (id: string) => void;
}

const GalleryGrid: React.FC<GalleryGridProps> = ({ 
  images,
  admin = false,
  onDelete
}) => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const openLightbox = (index: number) => {
    setCurrentImageIndex(index);
    setLightboxOpen(true);
  };

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => 
      prev < images.length - 1 ? prev + 1 : prev
    );
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => 
      prev > 0 ? prev - 1 : prev
    );
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {images.map((image, index) => (
          <GalleryImage
            key={image.id}
            image={image}
            admin={admin}
            onDelete={onDelete}
            onClick={() => openLightbox(index)}
          />
        ))}
      </div>

      <Lightbox
        images={images}
        currentIndex={currentImageIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
        onNext={handleNextImage}
        onPrev={handlePrevImage}
      />
    </>
  );
};

export default GalleryGrid;
