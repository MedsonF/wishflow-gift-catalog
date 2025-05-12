
import React from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';
import { GalleryImage } from '@/types';

interface LightboxProps {
  images: GalleryImage[];
  currentIndex: number;
  isOpen: boolean;
  onClose: () => void;
  onNext: () => void;
  onPrev: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({
  images,
  currentIndex,
  isOpen,
  onClose,
  onNext,
  onPrev,
}) => {
  const currentImage = images[currentIndex];

  if (!currentImage) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-4xl p-0 bg-black bg-opacity-90 border-none overflow-hidden">
        <div className="relative h-[80vh] flex items-center justify-center">
          <img
            src={currentImage.url}
            alt={currentImage.title || 'Gallery image'}
            className="max-h-full max-w-full object-contain"
          />
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
          
          <div className="absolute bottom-4 left-0 right-0 text-center text-white">
            {currentImage.title && (
              <p className="font-medium text-lg">{currentImage.title}</p>
            )}
            <p className="text-sm text-gray-300">
              {currentIndex + 1} / {images.length}
            </p>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute left-4 top-1/2 transform -translate-y-1/2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
            onClick={onPrev}
            disabled={currentIndex === 0}
          >
            <ChevronLeft className="h-6 w-6" />
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-4 top-1/2 transform -translate-y-1/2 rounded-full bg-black bg-opacity-50 hover:bg-opacity-70 text-white"
            onClick={onNext}
            disabled={currentIndex === images.length - 1}
          >
            <ChevronRight className="h-6 w-6" />
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default Lightbox;
