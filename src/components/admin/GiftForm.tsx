
import React, { useState, useEffect } from 'react';
import { GiftItem } from '@/types';
import { useGiftContext } from '@/contexts/GiftContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

interface GiftFormProps {
  gift?: GiftItem;
  onSubmit: () => void;
  onCancel: () => void;
}

const GiftForm: React.FC<GiftFormProps> = ({ gift, onSubmit, onCancel }) => {
  const { categories, addGift, updateGift } = useGiftContext();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: 0,
    imageUrl: '',
    category: '',
    status: 'available' as 'available' | 'chosen', // Type assertion to ensure type safety
    cashPaymentLink: '',
    installmentPaymentLink: '',
  });
  const [hasInstallment, setHasInstallment] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form data if editing
  useEffect(() => {
    if (gift) {
      setFormData({
        title: gift.title,
        description: gift.description,
        price: gift.price,
        imageUrl: gift.imageUrl,
        category: gift.category,
        status: gift.status,
        cashPaymentLink: gift.cashPaymentLink || '',
        installmentPaymentLink: gift.installmentPaymentLink || '',
      });
      setHasInstallment(!!gift.installmentPaymentLink);
    }
  }, [gift]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === 'price') {
      setFormData({ ...formData, [name]: parseFloat(value) || 0 });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleStatusChange = (value: string) => {
    setFormData({ ...formData, status: value as 'available' | 'chosen' });
  };

  const handleCategoryChange = (value: string) => {
    setFormData({ ...formData, category: value });
  };

  const handleInstallmentToggle = (checked: boolean) => {
    setHasInstallment(checked);
    if (!checked) {
      setFormData({ ...formData, installmentPaymentLink: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      if (gift) {
        // Update
        await updateGift(gift.id, {
          ...formData,
          installmentPaymentLink: hasInstallment ? formData.installmentPaymentLink : undefined,
        });
      } else {
        // Create
        await addGift({
          ...formData,
          installmentPaymentLink: hasInstallment ? formData.installmentPaymentLink : undefined,
        });
      }
      
      onSubmit();
    } catch (error) {
      console.error('Error saving gift:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleImageFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Fix: Ensure we're working with a string
        const result = reader.result;
        if (typeof result === 'string') {
          // Update form data with the string representation
          setFormData({
            ...formData,
            imageUrl: result
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Título</Label>
            <Input
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="price">Preço (R$)</Label>
            <Input
              id="price"
              name="price"
              type="number"
              step="0.01"
              min="0"
              value={formData.price}
              onChange={handleChange}
              required
              disabled={isSubmitting}
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={3}
            disabled={isSubmitting}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="imageUrl">URL da Imagem</Label>
          <Input
            id="imageUrl"
            name="imageUrl"
            value={formData.imageUrl}
            onChange={handleChange}
            placeholder="Cole a URL da imagem ou selecione um arquivo abaixo"
            disabled={isSubmitting}
          />
          <Input
            id="imageFile"
            name="imageFile"
            type="file"
            accept="image/*"
            onChange={handleImageFile}
            disabled={isSubmitting}
          />
          {formData.imageUrl && (
            <img
              src={formData.imageUrl}
              alt="Prévia da imagem"
              className="mt-2 max-h-32 rounded"
            />
          )}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="category">Categoria</Label>
            <Select 
              value={formData.category} 
              onValueChange={handleCategoryChange}
              disabled={isSubmitting}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map(category => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select 
              value={formData.status} 
              onValueChange={handleStatusChange}
              disabled={isSubmitting}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="available">Disponível</SelectItem>
                <SelectItem value="chosen">Escolhido</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="cashPaymentLink">Link para Pagamento à Vista</Label>
          <Input
            id="cashPaymentLink"
            name="cashPaymentLink"
            value={formData.cashPaymentLink}
            onChange={handleChange}
            disabled={isSubmitting}
            required
          />
        </div>
        
        <div className="flex items-center space-x-2 mb-2">
          <Switch
            id="hasInstallment"
            checked={hasInstallment}
            onCheckedChange={handleInstallmentToggle}
            disabled={isSubmitting}
          />
          <Label htmlFor="hasInstallment">Adicionar Pagamento Parcelado</Label>
        </div>
        
        {hasInstallment && (
          <div className="space-y-2">
            <Label htmlFor="installmentPaymentLink">Link para Pagamento Parcelado</Label>
            <Input
              id="installmentPaymentLink"
              name="installmentPaymentLink"
              value={formData.installmentPaymentLink}
              onChange={handleChange}
              disabled={isSubmitting}
              required={hasInstallment}
            />
          </div>
        )}
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting 
            ? (gift ? 'Atualizando...' : 'Adicionando...') 
            : (gift ? 'Atualizar Item' : 'Adicionar Item')}
        </Button>
      </div>
    </form>
  );
};

export default GiftForm;
