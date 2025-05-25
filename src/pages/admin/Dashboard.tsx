
import React from 'react';
import { useGiftContext } from '@/contexts/GiftContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import GiftGrid from '@/components/GiftGrid';

const Dashboard = () => {
  const { gifts, categories, galleryImages } = useGiftContext();
  
  // Statistics
  const totalGifts = gifts.length;
  const chosenGifts = gifts.filter(gift => gift.status === 'chosen').length;
  const availableGifts = gifts.filter(gift => gift.status === 'available').length;
  
  // Recent items (last 4 added)
  const recentGifts = [...gifts].sort((a, b) => 
    parseInt(b.id) - parseInt(a.id)
  ).slice(0, 4);
  
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Dashboard</h1>
      
      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total de Presentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{totalGifts}</div>
            <p className="text-xs text-gray-500 mt-1">
              {categories.length} categorias
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Presentes Escolhidos
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{chosenGifts}</div>
            <p className="text-xs text-gray-500 mt-1">
              {chosenGifts > 0 
                ? `${Math.round((chosenGifts / totalGifts) * 100)}% do total` 
                : 'Nenhum presente escolhido ainda'}
            </p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Presentes Disponíveis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold">{availableGifts}</div>
            <p className="text-xs text-gray-500 mt-1">
              {galleryImages.length} fotos na galeria
            </p>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick actions */}
      <div className="flex flex-wrap gap-2">
        <Link to="/admin/items/new">
          <Button>Adicionar Presente</Button>
        </Link>
        <Link to="/admin/items">
          <Button variant="outline">Gerenciar Presentes</Button>
        </Link>
      </div>
      
      {/* Recent items */}
      {recentGifts.length > 0 && (
        <div className="mt-8">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Itens Recentes</h2>
            <Link to="/admin/items">
              <Button variant="ghost" size="sm">
                Ver Todos
              </Button>
            </Link>
          </div>
          
          <GiftGrid 
            gifts={recentGifts} 
            admin={false} 
          />
        </div>
      )}
    </div>
  );
};

export default Dashboard;
