
import React from 'react';
import SettingsForm from '@/components/admin/SettingsForm';
import { Card } from '@/components/ui/card';

const SiteSettings = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-foreground">Configurações do Site</h1>
      
      <Card className="p-6">
        <SettingsForm />
      </Card>
    </div>
  );
};

export default SiteSettings;
