import React, { useState, useEffect } from 'react';
import { useGiftContext } from '@/contexts/GiftContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import GiftGrid from '@/components/GiftGrid';
import GiftForm from '@/components/admin/GiftForm';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

const ManageItems = () => {
  const { gifts, categories, deleteGift, markAsChosen, loading, refreshData } = useGiftContext();
  const { toast } = useToast();
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [currentGift, setCurrentGift] = useState<string | null>(null);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [giftToDelete, setGiftToDelete] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  // Refresh data when component mounts
  useEffect(() => {
    const loadData = async () => {
      if (loading.gifts || loading.categories) return;
      
      setIsRefreshing(true);
      try {
        await refreshData();
      } catch (error) {
        console.error('Error refreshing data:', error);
        toast({
          title: 'Erro ao carregar dados',
          description: 'Ocorreu um erro ao carregar os dados. Tente novamente.',
          variant: 'destructive',
        });
      } finally {
        setIsRefreshing(false);
      }
    };
    
    loadData();
  }, []);

  // Filter gifts
  const filteredGifts = gifts.filter(gift => {
    const matchesSearch = gift.title.toLowerCase().includes(search.toLowerCase()) ||
                          gift.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'all' ? true : gift.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' ? true : gift.status === statusFilter;
    const matchesTab = activeTab === 'all' ? true : gift.category === activeTab;
    
    return matchesSearch && matchesCategory && matchesStatus && matchesTab;
  });

  // Group gifts by category for tabs
  const giftsByCategory = categories.reduce((acc, category) => {
    const categoryGifts = gifts.filter(gift => gift.category === category.id);
    acc[category.id] = categoryGifts;
    return acc;
  }, {} as Record<string, typeof gifts>);

  const handleEdit = (id: string) => {
    setCurrentGift(id);
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    setGiftToDelete(id);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (giftToDelete) {
      setIsProcessing(true);
      try {
        await deleteGift(giftToDelete);
        setIsDeleteDialogOpen(false);
        setGiftToDelete(null);
        
        toast({
          title: 'Item excluído',
          description: 'O item foi removido com sucesso.',
        });
      } catch (error) {
        console.error('Error deleting gift:', error);
        toast({
          title: 'Erro ao excluir',
          description: 'Ocorreu um erro ao tentar excluir o item.',
          variant: 'destructive',
        });
      } finally {
        setIsProcessing(false);
      }
    }
  };

  const handleMarkChosen = async (id: string) => {
    setIsProcessing(true);
    try {
      const gift = gifts.find(g => g.id === id);
      if (gift) {
        await markAsChosen(id);
        
        toast({
          title: gift.status === 'available' ? 'Item marcado como escolhido' : 'Item marcado como disponível',
          description: 'O status do item foi atualizado com sucesso.',
        });
      }
    } catch (error) {
      console.error('Error updating gift status:', error);
      toast({
        title: 'Erro ao atualizar status',
        description: 'Ocorreu um erro ao tentar atualizar o status do item.',
        variant: 'destructive',
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleFormSubmit = async () => {
    try {
      await refreshData();
      setIsFormOpen(false);
      setCurrentGift(null);
      
      toast({
        title: currentGift ? 'Item atualizado' : 'Item adicionado',
        description: 'A operação foi concluída com sucesso.',
      });
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: 'Erro ao atualizar dados',
        description: 'Ocorreu um erro ao atualizar os dados.',
        variant: 'destructive',
      });
    }
  };

  const currentGiftData = currentGift ? gifts.find(g => g.id === currentGift) : undefined;

  if ((loading.gifts || loading.categories) && !isRefreshing) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Carregando itens...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Gerenciar Presentes</h1>
        <Link to="/admin/items/new">
          <Button>Adicionar Presente</Button>
        </Link>
      </div>
      
      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <Input
          placeholder="Pesquisar..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="md:w-1/3"
        />
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filtrar por status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="available">Disponível</SelectItem>
            <SelectItem value="chosen">Escolhido</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      {/* Category Filter Select */}
      <div className="flex flex-col md:flex-row gap-4">
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="md:w-1/4">
            <SelectValue placeholder="Filtrar por categoria" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as categorias</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name} ({giftsByCategory[category.id]?.length || 0})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex flex-col">

        <TabsContent value="all" className="mt-4 w-full">
          {filteredGifts.length === 0 ? (
        <div className="text-center py-8">
          <h3 className="text-lg font-semibold mb-2">Nenhum item encontrado</h3>
          <p className="text-gray-600">
            Tente ajustar os filtros ou adicione um novo item.
          </p>
          <Link to="/admin/items/new" className="mt-4 inline-block">
            <Button>Adicionar Presente</Button>
          </Link>
        </div>
      ) : (
        <GiftGrid 
          gifts={filteredGifts} 
          admin={true}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onMarkChosen={handleMarkChosen}
        />
      )}
        </TabsContent>

        {categories.map(category => (
          <TabsContent key={category.id} value={category.id} className="mt-4">
            {filteredGifts.length === 0 ? (
              <div className="text-center py-8">
                <h3 className="text-lg font-semibold mb-2">Nenhum item encontrado</h3>
                <p className="text-gray-600">
                  Não há itens nesta categoria ou os filtros aplicados não retornaram resultados.
                </p>
                <Link to="/admin/items/new" className="mt-4 inline-block">
                  <Button>Adicionar Presente</Button>
                </Link>
              </div>
            ) : (
              <GiftGrid 
                gifts={filteredGifts} 
                admin={true}
                onEdit={handleEdit}
                onDelete={handleDelete}
                onMarkChosen={handleMarkChosen}
              />
            )}
          </TabsContent>
        ))}
      </Tabs>
      
      {/* Edit Dialog */}
      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle>{currentGift ? 'Editar Item' : 'Adicionar Item'}</DialogTitle>
          </DialogHeader>
          <GiftForm 
            gift={currentGiftData}
            onSubmit={handleFormSubmit}
            onCancel={() => {
              setIsFormOpen(false);
              setCurrentGift(null);
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
          <p>Tem certeza de que deseja excluir este item? Esta ação não pode ser desfeita.</p>
          <div className="flex justify-end space-x-4 mt-4">
            <Button 
              variant="outline" 
              onClick={() => setIsDeleteDialogOpen(false)}
              disabled={isProcessing}
            >
              Cancelar
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDelete}
              disabled={isProcessing}
            >
              {isProcessing ? 'Excluindo...' : 'Excluir'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageItems;
