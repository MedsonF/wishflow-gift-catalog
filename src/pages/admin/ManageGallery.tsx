
import React, { useState } from 'react';
import { useGiftContext } from '@/contexts/GiftContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ImageUploadForm from '@/components/admin/ImageUploadForm';
import GalleryGrid from '@/components/GalleryGrid';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ManageGallery = () => {
  const { galleryImages, deleteGalleryImage } = useGiftContext();
  const { toast } = useToast();
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false);
  
  const handleDeleteImage = (id: string) => {
    deleteGalleryImage(id);
    
    toast({
      title: 'Imagem excluída',
      description: 'A imagem foi removida da galeria com sucesso.',
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciar Galeria</h1>
        <Button onClick={() => setIsUploadDialogOpen(true)}>
          Adicionar Imagem
        </Button>
      </div>
      
      <Card className="p-6">
        {galleryImages.length === 0 ? (
          <div className="text-center py-8">
            <h3 className="text-lg font-semibold mb-2">Galeria Vazia</h3>
            <p className="text-gray-600 mb-4">
              Adicione sua primeira imagem à galeria.
            </p>
            <Button onClick={() => setIsUploadDialogOpen(true)}>
              Adicionar Imagem
            </Button>
          </div>
        ) : (
          <GalleryGrid 
            images={galleryImages}
            admin={true}
            onDelete={handleDeleteImage}
          />
        )}
      </Card>
      
      {/* Upload Image Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Adicionar Nova Imagem</DialogTitle>
          </DialogHeader>
          <ImageUploadForm 
            onSuccess={() => setIsUploadDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageGallery;
