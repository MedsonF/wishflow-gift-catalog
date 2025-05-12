
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useGiftContext } from '@/contexts/GiftContext';
import { useToast } from '@/hooks/use-toast';

const ImageUploadForm: React.FC<{ onSuccess: () => void }> = ({ onSuccess }) => {
  const { addGalleryImage } = useGiftContext();
  const { toast } = useToast();
  const [imageUrl, setImageUrl] = useState('');
  const [imageTitle, setImageTitle] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, you might upload the image to a storage service here
    // For now, we'll just add the image URL to our context
    
    setTimeout(() => {
      addGalleryImage({
        url: imageUrl,
        title: imageTitle || undefined,
      });
      
      toast({
        title: 'Imagem adicionada',
        description: 'A imagem foi adicionada à galeria com sucesso.',
      });
      
      setImageUrl('');
      setImageTitle('');
      setIsSubmitting(false);
      onSuccess();
    }, 1000);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="imageUrl">URL da Imagem</Label>
        <Input
          id="imageUrl"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="https://example.com/image.jpg"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="imageTitle">Título da Imagem (opcional)</Label>
        <Input
          id="imageTitle"
          value={imageTitle}
          onChange={(e) => setImageTitle(e.target.value)}
          placeholder="Descrição da imagem"
        />
      </div>
      
      <Button type="submit" disabled={isSubmitting} className="w-full">
        {isSubmitting ? 'Adicionando...' : 'Adicionar à Galeria'}
      </Button>
    </form>
  );
};

export default ImageUploadForm;
