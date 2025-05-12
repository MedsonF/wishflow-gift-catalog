
import React, { useState, useEffect } from 'react';
import { SiteSettings } from '@/types';
import { useGiftContext } from '@/contexts/GiftContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const SettingsForm: React.FC = () => {
  const { siteSettings, updateSiteSettings } = useGiftContext();
  const { toast } = useToast();
  const [formData, setFormData] = useState<SiteSettings>({
    title: '',
    description: '',
    primaryColor: '',
    backgroundColor: '',
  });

  useEffect(() => {
    setFormData(siteSettings);
  }, [siteSettings]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSiteSettings(formData);
    
    toast({
      title: 'Configurações salvas',
      description: 'As configurações do site foram atualizadas com sucesso.',
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Título do Site</Label>
          <Input
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Descrição</Label>
          <Textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows={4}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="primaryColor">Cor Primária</Label>
            <div className="flex space-x-2">
              <Input
                id="primaryColor"
                name="primaryColor"
                type="color"
                value={formData.primaryColor}
                onChange={handleChange}
                className="w-12 h-10 p-1"
              />
              <Input
                value={formData.primaryColor}
                onChange={handleChange}
                name="primaryColor"
                className="flex-1"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="backgroundColor">Cor de Fundo</Label>
            <div className="flex space-x-2">
              <Input
                id="backgroundColor"
                name="backgroundColor"
                type="color"
                value={formData.backgroundColor}
                onChange={handleChange}
                className="w-12 h-10 p-1"
              />
              <Input
                value={formData.backgroundColor}
                onChange={handleChange}
                name="backgroundColor"
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
      
      <Button type="submit">Salvar Configurações</Button>
    </form>
  );
};

export default SettingsForm;
