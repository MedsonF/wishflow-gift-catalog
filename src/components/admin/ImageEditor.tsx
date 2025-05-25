import React, { useRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface ImageEditorProps {
  imageUrl: string;
  onImageChange: (newImageUrl: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onImageChange }) => {
  const imageRef = useRef<HTMLImageElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          onImageChange(result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div className="relative aspect-square w-full max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden">
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Preview"
          className="w-full h-full object-contain"
        />
      </div>
      
      <div>
        <Label htmlFor="image">Alterar Imagem</Label>
        <Input
          id="image"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="mt-1"
        />
      </div>
    </div>
  );
};

export default ImageEditor; 