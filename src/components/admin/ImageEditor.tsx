import React, { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RotateCcw, ZoomIn, ZoomOut, Crop, X } from 'lucide-react';
import { Slider } from '@/components/ui/slider';

interface ImageEditorProps {
  imageUrl: string;
  onImageChange: (newImageUrl: string) => void;
}

const ImageEditor: React.FC<ImageEditorProps> = ({ imageUrl, onImageChange }) => {
  const [rotation, setRotation] = useState(0);
  const [scale, setScale] = useState(1);
  const [isCropping, setIsCropping] = useState(false);
  const [cropStart, setCropStart] = useState({ x: 0, y: 0 });
  const [cropEnd, setCropEnd] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const imageRef = useRef<HTMLImageElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (imageRef.current) {
      const img = imageRef.current;
      img.onload = () => {
        setCropEnd({ x: img.width, y: img.height });
      };
    }
  }, [imageUrl]);

  const handleRotate = () => {
    const newRotation = (rotation - 90) % 360;
    setRotation(newRotation);
    applyTransformations();
  };

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.1, 3));
    applyTransformations();
  };

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.1, 0.5));
    applyTransformations();
  };

  const handleScaleChange = (value: number[]) => {
    setScale(value[0]);
    applyTransformations();
  };

  const handleCropStart = () => {
    setIsCropping(true);
    setCropStart({ x: 0, y: 0 });
    setCropEnd({ x: 0, y: 0 });
  };

  const handleCropEnd = () => {
    if (isCropping && imageRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      if (ctx) {
        // Ajusta o tamanho do canvas para o tamanho do crop
        canvas.width = cropEnd.x - cropStart.x;
        canvas.height = cropEnd.y - cropStart.y;

        // Desenha a parte recortada da imagem
        ctx.drawImage(
          img,
          cropStart.x,
          cropStart.y,
          cropEnd.x - cropStart.x,
          cropEnd.y - cropStart.y,
          0,
          0,
          canvas.width,
          canvas.height
        );

        // Converte o canvas para base64 e atualiza a imagem
        const newImageUrl = canvas.toDataURL('image/jpeg');
        onImageChange(newImageUrl);
        setIsCropping(false);
        setScale(1);
        setRotation(0);
      }
    }
  };

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isCropping && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCropStart({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
      setIsDragging(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging && containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      setCropEnd({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const applyTransformations = () => {
    if (imageRef.current && canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      const img = imageRef.current;

      if (ctx) {
        // Ajusta o tamanho do canvas para acomodar a rotação e escala
        canvas.width = img.width * scale;
        canvas.height = img.height * scale;

        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate((rotation * Math.PI) / 180);
        ctx.scale(scale, scale);
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
          setScale(1);
          setIsCropping(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-4">
      <div 
        ref={containerRef}
        className="relative aspect-square w-full max-w-md mx-auto bg-gray-100 rounded-lg overflow-hidden"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <img
          ref={imageRef}
          src={imageUrl}
          alt="Preview"
          className="w-full h-full object-contain"
          style={{ 
            transform: `rotate(${rotation}deg) scale(${scale})`,
            transition: isDragging ? 'none' : 'transform 0.2s ease-in-out'
          }}
        />
        <canvas ref={canvasRef} className="hidden" />
        
        {isCropping && (
          <div
            className="absolute border-2 border-primary"
            style={{
              left: Math.min(cropStart.x, cropEnd.x),
              top: Math.min(cropStart.y, cropEnd.y),
              width: Math.abs(cropEnd.x - cropStart.x),
              height: Math.abs(cropEnd.y - cropStart.y),
            }}
          />
        )}
      </div>
      
      <div className="flex flex-col space-y-4">
        <div className="flex items-center justify-between">
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
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className="flex items-center space-x-2"
            >
              <ZoomIn className="h-4 w-4" />
              <span>Zoom +</span>
            </Button>
            
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              className="flex items-center space-x-2"
            >
              <ZoomOut className="h-4 w-4" />
              <span>Zoom -</span>
            </Button>
            
            {!isCropping ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleCropStart}
                className="flex items-center space-x-2"
              >
                <Crop className="h-4 w-4" />
                <span>Cortar</span>
              </Button>
            ) : (
              <Button
                type="button"
                variant="default"
                size="sm"
                onClick={handleCropEnd}
                className="flex items-center space-x-2"
              >
                <Crop className="h-4 w-4" />
                <span>Confirmar Corte</span>
              </Button>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label>Zoom</Label>
          <Slider
            value={[scale]}
            min={0.5}
            max={3}
            step={0.1}
            onValueChange={handleScaleChange}
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
    </div>
  );
};

export default ImageEditor; 