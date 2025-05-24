import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RotateCcw, Crop } from 'lucide-react';

interface ImageEditorProps {
  imageUrl: string;
  onImageChange: (newImageUrl: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onImageChange }) => {
  const [rotation, setRotation] = useState(0);
  const [isCropping, setIsCropping] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const handleRotate = () => {
    const newRotation = (rotation - 90) % 360;
    setRotation(newRotation);
    
    if (imageRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;
      
      // Ajusta o tamanho do canvas para acomodar a rotação
      canvas.width = img.height;
      canvas.height = img.width;
      
      if (ctx) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((newRotation * Math.PI) / 180);
        ctx.drawImage(img, -img.width / 2, -img.height / 2);
        
        // Converte o canvas para base64 e atualiza a imagem
        const newImageUrl = canvas.toDataURL('image/jpeg');
        onImageChange(newImageUrl);
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result;
        if (typeof result === 'string') {
          onImageChange(result);
          setRotation(0);
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
          style={{ transform: `rotate(${rotation}deg)` }}
        />
        <canvas ref={canvasRef} className="hidden" />
      </div>
      
      <div className="flex flex-col space-y-2">
        <div className="flex items-center space-x-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleRotate}
            className="flex items-center space-x-2"
          >
            <RotateCcw className="h-4 w-4" />
            <span>Girar</span>
          </Button>
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
    </div>
  );
};

export default ImageEditor; 