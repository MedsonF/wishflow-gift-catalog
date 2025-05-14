
import React from 'react';
import GiftCard from '@/components/GiftCard';
import { GiftItem } from '@/types';
import { useIsMobile } from '@/hooks/use-mobile';

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
  // Using the mobile hook to determine if we're on a mobile device
  const isMobile = useIsMobile();

  return (
    <div className={`grid grid-cols-2 ${!isMobile ? 'sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : ''} gap-4 sm:gap-6`}>
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
