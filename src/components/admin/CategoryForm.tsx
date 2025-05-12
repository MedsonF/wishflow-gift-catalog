
import React, { useState, useEffect } from 'react';
import { Category } from '@/types';
import { useGiftContext } from '@/contexts/GiftContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CategoryFormProps {
  category?: Category;
  onSubmit: () => void;
  onCancel: () => void;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ category, onSubmit, onCancel }) => {
  const { addCategory, updateCategory } = useGiftContext();
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
  });

  // Initialize form data if editing
  useEffect(() => {
    if (category) {
      setFormData({
        name: category.name,
        slug: category.slug,
      });
    }
  }, [category]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Auto-generate slug when name changes (if not in edit mode)
    if (name === 'name' && !category) {
      const slug = value
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')  // Remove special characters
        .replace(/\s+/g, '-')      // Replace spaces with hyphens
        .replace(/--+/g, '-');     // Replace multiple hyphens with single hyphen
      
      setFormData(prev => ({ ...prev, slug }));
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (category) {
      // Update
      updateCategory(category.id, formData);
    } else {
      // Create
      addCategory(formData);
    }
    
    onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nome da Categoria</Label>
          <Input
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="slug">Slug (URL)</Label>
          <Input
            id="slug"
            name="slug"
            value={formData.slug}
            onChange={handleChange}
            required
          />
          <p className="text-xs text-gray-500">
            O slug é usado para criar URLs amigáveis (ex: /categoria/meu-slug)
          </p>
        </div>
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          {category ? 'Atualizar Categoria' : 'Adicionar Categoria'}
        </Button>
      </div>
    </form>
  );
};

export default CategoryForm;
