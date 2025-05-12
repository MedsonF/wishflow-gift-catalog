
import React, { useState } from 'react';
import { useGiftContext } from '@/contexts/GiftContext';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import CategoryForm from '@/components/admin/CategoryForm';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const ManageCategories = () => {
  const { categories, deleteCategory } = useGiftContext();
  const { toast } = useToast();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentCategory, setCurrentCategory] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null);

  const handleEdit = (id: string) => {
    setCurrentCategory(id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setCategoryToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (categoryToDelete) {
      deleteCategory(categoryToDelete);
      setIsDeleteDialogOpen(false);
      setCategoryToDelete(null);
      
      toast({
        title: 'Categoria excluída',
        description: 'A categoria foi removida com sucesso.',
      });
    }
  };

  const currentCategoryData = currentCategory 
    ? categories.find(c => c.id === currentCategory) 
    : undefined;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciar Categorias</h1>
        <Button onClick={() => {
          setCurrentCategory(null);
          setIsFormOpen(true);
        }}>
          Adicionar Categoria
        </Button>
      </div>
      
      {/* Categories list */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map(category => (
          <Card key={category.id}>
            <CardHeader>
              <h3 className="text-lg font-semibold">{category.name}</h3>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">
                Slug: <code className="bg-gray-100 px-1 rounded">{category.slug}</code>
              </p>
            </CardContent>
            <CardFooter className="flex justify-end space-x-2">
              <Button variant="outline" size="sm" onClick={() => handleEdit(category.id)}>
                Editar
              </Button>
              <Button variant="destructive" size="sm" onClick={() => handleDelete(category.id)}>
                Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}

        {categories.length === 0 && (
          <div className="col-span-3 text-center py-12">
            <h3 className="text-lg font-semibold mb-2">Nenhuma categoria encontrada</h3>
            <p className="text-gray-600 mb-4">
              Adicione sua primeira categoria para começar.
            </p>
            <Button onClick={() => {
              setCurrentCategory(null);
              setIsFormOpen(true);
            }}>
              Adicionar Categoria
            </Button>
          </div>
        )}
      </div>
      
      {/* Category Form Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentCategory ? 'Editar Categoria' : 'Adicionar Categoria'}
            </DialogTitle>
          </DialogHeader>
          <CategoryForm 
            category={currentCategoryData}
            onSubmit={() => {
              setIsFormOpen(false);
              setCurrentCategory(null);
              
              toast({
                title: currentCategory ? 'Categoria atualizada' : 'Categoria adicionada',
                description: 'A operação foi concluída com sucesso.',
              });
            }}
            onCancel={() => {
              setIsFormOpen(false);
              setCurrentCategory(null);
            }}
          />
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
          </DialogHeader>
          <p>
            Tem certeza de que deseja excluir esta categoria? Esta ação não pode ser desfeita.
            Os itens associados a esta categoria ficarão sem categoria.
          </p>
          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancelar
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Excluir
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageCategories;
