
import React from 'react';
import { Link } from 'react-router-dom';
import { useGiftContext } from '@/contexts/GiftContext';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  const { siteSettings, currentUser, logout } = useGiftContext();

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-4 flex flex-col sm:flex-row justify-between items-center">
        <div className="mb-4 sm:mb-0">
          <Link to="/" className="text-2xl font-bold text-primary">
            {siteSettings.title}
          </Link>
        </div>
        <nav className="flex items-center space-x-4">
          <Link to="/" className="hover:text-primary transition-colors">
            Início
          </Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/category/${category.id}`}
              className="hover:text-primary transition-colors hidden sm:block"
            >
              {category.name}
            </Link>
          ))}
          {currentUser ? (
            <>
              <Link to="/admin">
                <Button variant="outline" size="sm">
                  Dashboard
                </Button>
              </Link>
              <Button variant="ghost" size="sm" onClick={logout}>
                Sair
              </Button>
            </>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm">
                Admin
              </Button>
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
