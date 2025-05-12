
import React, { useState } from 'react';
import { GalleryImage as GalleryImageType } from '@/types';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';

interface GalleryImageProps {
  image: GalleryImageType;
  admin?: boolean;
  onDelete?: (id: string) => void;
  onClick?: () => void;
}

const GalleryImage: React.FC<GalleryImageProps> = ({ 
  image, 
  admin = false,
  onDelete,
  onClick
}) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div 
      className="relative overflow-hidden rounded-md cursor-pointer group"
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onClick={onClick}
    >
      <img 
        src={image.url} 
        alt={image.title || 'Gallery image'} 
        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-105"
      />
      <div className={`absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-opacity duration-300 flex items-end p-3`}>
        {image.title && (
          <p className="text-white font-medium drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            {image.title}
          </p>
        )}
      </div>

      {admin && isHovering && (
        <Button 
          variant="destructive"
          size="icon"
          className="absolute top-2 right-2 rounded-full w-8 h-8 opacity-90"
          onClick={(e) => {
            e.stopPropagation();
            onDelete && onDelete(image.id);
          }}
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
};

export default GalleryImage;
