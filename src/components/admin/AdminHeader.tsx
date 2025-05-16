import React from 'react';
import { Link } from 'react-router-dom';
import { useGiftContext } from '@/contexts/GiftContext';
import { Button } from '@/components/ui/button';

const AdminHeader: React.FC = () => {
  const { logout } = useGiftContext();

  return (
    <header className="bg-white border-b border-gray-200 py-4 px-6 flex items-center justify-between shadow-sm">
      <h1 className="font-bold text-xl">Área Administrativa</h1>
      <div className="flex items-center gap-4">
        <Link to="/" target="_blank">
          <Button variant="outline" size="sm">
            Visualizar Site
          </Button>
        </Link>
        <Button variant="ghost" size="sm" onClick={logout}>
          Sair
        </Button>
      </div>
    </header>
  );
};

export default AdminHeader;
