
import React from 'react';
import GiftCard from '@/components/GiftCard';
import { GiftItem } from '@/types';

interface GiftGridProps {
  gifts: GiftItem[];
  admin?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMarkChosen?: (id: string) => void;
}

const GiftGrid: React.FC<GiftGridProps> = ({ 
  gifts, 
  admin = false,
  onEdit,
  onDelete,
  onMarkChosen
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {gifts.map((gift) => (
        <GiftCard
          key={gift.id}
          gift={gift}
          admin={admin}
          onEdit={onEdit}
          onDelete={onDelete}
          onMarkChosen={onMarkChosen}
        />
      ))}
    </div>
  );
};

export default GiftGrid;
