import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GiftItem } from '@/types';
import { cn } from '@/lib/utils';

interface GiftCardProps {
  gift: GiftItem;
  admin?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
  onMarkChosen?: (id: string) => void;
}

const GiftCard: React.FC<GiftCardProps> = ({ 
  gift, 
  admin = false,
  onEdit,
  onDelete,
  onMarkChosen
}) => {
  const handleCashPayment = () => {
    if (gift.cashPaymentLink) {
      window.open(gift.cashPaymentLink, '_blank');
    }
  };

  const handleInstallmentPayment = () => {
    if (gift.installmentPaymentLink) {
      window.open(gift.installmentPaymentLink, '_blank');
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(price);
  };

  const hasPaymentLinks = gift.cashPaymentLink || gift.installmentPaymentLink;

  return (
    <Card className={cn(
      "overflow-hidden h-full flex flex-col transition-all hover:shadow-lg",
      gift.status === 'chosen' && !admin && 'chosen-item opacity-75'
    )}>
      <div className="relative w-full aspect-square overflow-hidden">
        <img
          src={gift.imageUrl}
          alt={gift.title}
          className="w-full h-full object-contain bg-white"
        />
        <Badge className="absolute top-2 right-2 bg-primary">
          {formatPrice(gift.price)}
        </Badge>
      </div>
      <CardContent className="pt-3 flex-grow space-y-1">
        <h3 className="font-semibold text-sm sm:text-base mb-1 line-clamp-1">
          {gift.title}
        </h3>
        <p className="text-gray-600 text-xs sm:text-sm line-clamp-3 leading-relaxed">
          {gift.description}
        </p>
      </CardContent>
      <CardFooter className="pt-2">
        {admin ? (
          <div className="flex justify-end space-x-2 w-full">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onEdit?.(gift.id)}
            >
              Editar
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onDelete?.(gift.id)}
            >
              Excluir
            </Button>
            <Button
              variant={gift.status === 'chosen' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onMarkChosen?.(gift.id)}
            >
              {gift.status === 'chosen' ? 'Escolhido' : 'Disponível'}
            </Button>
          </div>
        ) : gift.status === 'available' && (
          <div className="flex flex-col space-y-2 w-full">
            {hasPaymentLinks ? (
              <>
                <Button
                  variant="default"
                  className="w-full whitespace-normal text-center h-auto py-2"
                  onClick={handleCashPayment}
                >
                  Comprar à Vista
                </Button>
                {gift.installmentPaymentLink && (
                  <Button
                    variant="outline"
                    className="w-full whitespace-normal text-center h-auto py-2"
                    onClick={handleInstallmentPayment}
                  >
                    Comprar Parcelado
                  </Button>
                )}
              </>
            ) : (
              <Button
                variant="default"
                className="w-full whitespace-normal text-center h-auto py-2"
                disabled
              >
                Disponível em<br className="sm:hidden" /> Loja Física
              </Button>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
};

export default GiftCard;
