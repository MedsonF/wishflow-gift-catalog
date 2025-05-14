
import React, { useState } from 'react';
import GiftForm from '@/components/admin/GiftForm';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { useGiftContext } from '@/contexts/GiftContext';
import { Loader2 } from 'lucide-react';

const NewItem = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { refreshData, loading } = useGiftContext();

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    try {
      // Refresh data and wait for it to complete
      await refreshData();
      
      toast({
        title: 'Item adicionado',
        description: 'O presente foi adicionado com sucesso.',
      });
      
      // Navigate after data is refreshed
      navigate('/admin/items');
    } catch (error) {
      console.error('Error refreshing data:', error);
      toast({
        title: 'Erro ao atualizar dados',
        description: 'Ocorreu um erro ao atualizar os dados.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
    }
  };

  if (loading.gifts || loading.categories) {
    return (
      <div className="h-96 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p>Carregando dados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Adicionar Novo Presente</h1>
      
      <Card className="p-6">
        <GiftForm 
          onSubmit={handleSubmit}
          onCancel={() => {
            navigate('/admin/items');
          }}
        />
      </Card>
    </div>
  );
};

export default NewItem;
