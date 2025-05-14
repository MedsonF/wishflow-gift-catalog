
import React, { useState } from 'react';
import GiftForm from '@/components/admin/GiftForm';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const NewItem = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    setIsSubmitting(false);
    toast({
      title: 'Item adicionado',
      description: 'O presente foi adicionado com sucesso.',
    });
    navigate('/admin/items');
  };

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
