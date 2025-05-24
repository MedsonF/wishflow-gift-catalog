import React, { useState, useEffect } from 'react';
import { GiftItem } from '@/types';
import { useGiftContext } from '@/contexts/GiftContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import ImageEditor from './ImageEditor';

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
    status: 'available' as 'available' | 'chosen',
    cashPaymentLink: '',
    installmentPaymentLink: '',
  });
  const [hasInstallment, setHasInstallment] = useState(false);
  const [hasPaymentLinks, setHasPaymentLinks] = useState(true);
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
      setHasPaymentLinks(!!gift.cashPaymentLink || !!gift.installmentPaymentLink);
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

  const handlePaymentLinksToggle = (checked: boolean) => {
    setHasPaymentLinks(checked);
    if (!checked) {
      setFormData({
        ...formData,
        cashPaymentLink: '',
        installmentPaymentLink: '',
      });
      setHasInstallment(false);
    }
  };

  const handleImageChange = (newImageUrl: string) => {
    setFormData({ ...formData, imageUrl: newImageUrl });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const giftData = {
        ...formData,
        cashPaymentLink: hasPaymentLinks ? formData.cashPaymentLink : undefined,
        installmentPaymentLink: hasPaymentLinks && hasInstallment ? formData.installmentPaymentLink : undefined,
      };

      if (gift) {
        await updateGift(gift.id, giftData);
      } else {
        await addGift(giftData);
      }
      
      onSubmit();
    } catch (error) {
      console.error('Error saving gift:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <Label htmlFor="title">Título</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
          />
        </div>

        <div>
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
          />
        </div>

        <div>
          <Label>Imagem</Label>
          <ImageEditor
            imageUrl={formData.imageUrl}
            onImageChange={handleImageChange}
          />
        </div>

        <div>
          <Label htmlFor="category">Categoria</Label>
          <Select
            value={formData.category}
            onValueChange={handleCategoryChange}
            required
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione uma categoria" />
            </SelectTrigger>
            <SelectContent>
              {categories.map((category) => (
                <SelectItem key={category.id} value={category.id}>
                  {category.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={formData.status}
            onValueChange={handleStatusChange}
            required
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="available">Disponível</SelectItem>
              <SelectItem value="chosen">Escolhido</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            id="hasPaymentLinks"
            checked={hasPaymentLinks}
            onCheckedChange={handlePaymentLinksToggle}
          />
          <Label htmlFor="hasPaymentLinks">Adicionar links de pagamento</Label>
        </div>

        {hasPaymentLinks && (
          <>
            <div>
              <Label htmlFor="cashPaymentLink">Link de pagamento à vista</Label>
              <Input
                id="cashPaymentLink"
                name="cashPaymentLink"
                value={formData.cashPaymentLink}
                onChange={handleChange}
                required={hasPaymentLinks}
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="hasInstallment"
                checked={hasInstallment}
                onCheckedChange={handleInstallmentToggle}
              />
              <Label htmlFor="hasInstallment">Adicionar link de pagamento parcelado</Label>
            </div>

            {hasInstallment && (
              <div>
                <Label htmlFor="installmentPaymentLink">Link de pagamento parcelado</Label>
                <Input
                  id="installmentPaymentLink"
                  name="installmentPaymentLink"
                  value={formData.installmentPaymentLink}
                  onChange={handleChange}
                  required={hasInstallment}
                />
              </div>
            )}
          </>
        )}
      </div>

      <div className="flex justify-end space-x-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Salvando...' : gift ? 'Atualizar' : 'Adicionar'}
        </Button>
      </div>
    </form>
  );
};

export default GiftForm;
