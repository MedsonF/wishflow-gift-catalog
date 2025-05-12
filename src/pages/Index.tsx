
import React from 'react';
import { useGiftContext } from '@/contexts/GiftContext';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GiftGrid from '@/components/GiftGrid';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Index = () => {
  const { gifts, categories, siteSettings } = useGiftContext();
  
  // Get featured gifts (4 available items)
  const featuredGifts = gifts
    .filter(gift => gift.status === 'available')
    .slice(0, 4);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="bg-primary bg-opacity-10 py-16">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4 text-primary">
              {siteSettings.title}
            </h1>
            <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-gray-700">
              {siteSettings.description}
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link to="/category/1">
                <Button size="lg" className="bg-primary hover:bg-primary/90">
                  Ver Presentes
                </Button>
              </Link>
              <Link to="/gallery">
                <Button size="lg" variant="outline">
                  Galeria de Fotos
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Categories section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold mb-8 text-center">Categorias</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link 
                  to={`/category/${category.id}`} 
                  key={category.id}
                  className="block group"
                >
                  <div className="bg-white rounded-lg shadow-md p-6 text-center hover:shadow-lg transition-all border border-gray-100 hover:border-primary">
                    <h3 className="text-xl font-semibold mb-2 group-hover:text-primary transition-colors">
                      {category.name}
                    </h3>
                    <p className="text-gray-500 text-sm">
                      Clique para ver os itens
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        
        {/* Featured gifts section */}
        {featuredGifts.length > 0 && (
          <section className="py-16 bg-gray-50">
            <div className="container mx-auto px-4">
              <h2 className="text-3xl font-bold mb-8 text-center">Presentes em Destaque</h2>
              <GiftGrid gifts={featuredGifts} />
              <div className="text-center mt-10">
                <Link to="/category/all">
                  <Button variant="outline" size="lg">
                    Ver Todos os Presentes
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        )}
        
        {/* CTA section */}
        <section className="py-16 bg-primary-foreground bg-opacity-5">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl font-bold mb-4">Escolha um Presente Especial</h2>
            <p className="text-lg max-w-2xl mx-auto mb-8 text-gray-600">
              Agradecemos por fazer parte deste momento especial. Sua presença e seu presente significam muito para nós.
            </p>
            <Link to="/category/all">
              <Button size="lg">
                Explorar Todos os Presentes
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
