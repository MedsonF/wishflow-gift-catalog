import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useGiftContext } from '@/contexts/GiftContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GiftGrid from '@/components/GiftGrid';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const { gifts, categories } = useGiftContext();
  const [filteredGifts, setFilteredGifts] = useState(gifts);
  const [currentFilter, setCurrentFilter] = useState('all');

  useEffect(() => {
    if (id === 'all') {
      setFilteredGifts(gifts);
    } else {
      setFilteredGifts(gifts.filter(gift => gift.category === id));
    }
  }, [id, gifts]);

  const filterByStatus = (status: string) => {
    setCurrentFilter(status);
    if (status === 'all') {
      if (id === 'all') {
        setFilteredGifts(gifts);
      } else {
        setFilteredGifts(gifts.filter(gift => gift.category === id));
      }
    } else {
      if (id === 'all') {
        setFilteredGifts(gifts.filter(gift => gift.status === status));
      } else {
        setFilteredGifts(gifts.filter(gift => 
          gift.category === id && gift.status === status
        ));
      }
    }
  };

  // Get category name
  const categoryName = id === 'all' 
    ? 'Todos os Presentes' 
    : categories.find(cat => cat.id === id)?.name || 'Categoria';

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
          <p className="text-gray-600">
            {categories.find(cat => cat.id === id)?.name?.toLowerCase() === 'eletrodomésticos' ? (
              <>
                Para começar nossa vida juntos com o pé direito, montamos uma lista de presentes cheia de itens que vão deixar nosso novo lar ainda mais especial.
                <br /><br />
                Se quiser nos presentear, é só escolher um dos itens da lista, efetuar o pagamento ou comprar em sua loja de preferência e nos sinalizar qual foi o escolhido.
              </>
            ) : (
              'Escolha um presente especial da nossa lista.'
            )}
          </p>
        </div>

        <Tabs defaultValue="all" className="mb-8">
          <TabsList>
            <TabsTrigger 
              value="all" 
              onClick={() => filterByStatus('all')}
            >
              Todos
            </TabsTrigger>
            <TabsTrigger 
              value="available" 
              onClick={() => filterByStatus('available')}
            >
              Disponíveis
            </TabsTrigger>
            <TabsTrigger 
              value="chosen" 
              onClick={() => filterByStatus('chosen')}
            >
              Escolhidos
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {filteredGifts.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-xl font-semibold mb-2">Nenhum presente encontrado</h3>
            <p className="text-gray-600">
              Não encontramos presentes nesta categoria com o filtro selecionado.
            </p>
          </div>
        ) : (
          <GiftGrid gifts={filteredGifts} />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
