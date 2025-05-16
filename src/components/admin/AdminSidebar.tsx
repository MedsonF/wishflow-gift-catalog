import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { useGiftContext } from '@/contexts/GiftContext';

const AdminSidebar: React.FC = () => {
  const { gifts } = useGiftContext();
  
  // Count statistics
  const totalGifts = gifts.length;
  const chosenGifts = gifts.filter(gift => gift.status === 'chosen').length;
  const availableGifts = gifts.filter(gift => gift.status === 'available').length;
  
  const links = [
    { to: '/admin', label: 'Dashboard', exact: true },
    { to: '/admin/items', label: 'Gerenciar Itens' },
    { to: '/admin/categories', label: 'Categorias' },
    { to: '/admin/gallery', label: 'Galeria' },
    { to: '/admin/settings', label: 'Configurações' },
  ];

  return (
    <div className="bg-sidebar h-full flex flex-col">
      <div className="p-6 border-b">
        <h2 className="text-xl font-bold text-sidebar-foreground">Painel Admin</h2>
      </div>
      
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-1">
          {links.map((link, index) => (
            <li key={index}>
              <NavLink
                to={link.to}
                end={link.exact}
                className={({ isActive }) =>
                  cn(
                    "block px-4 py-2 rounded-md transition-colors",
                    isActive 
                      ? "bg-primary text-primary-foreground font-medium" 
                      : "text-sidebar-foreground hover:bg-primary hover:text-primary-foreground hover:bg-opacity-10"
                  )
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      
      <div className="p-4 border-t">
        <div className="space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-sidebar-foreground">Total de Itens</span>
            <span className="font-medium text-sidebar-foreground">{totalGifts}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-sidebar-foreground">Escolhidos</span>
            <span className="font-medium text-sidebar-foreground">{chosenGifts}</span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-sidebar-foreground">Disponíveis</span>
            <span className="font-medium text-sidebar-foreground">{availableGifts}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSidebar;
