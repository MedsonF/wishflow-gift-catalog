
import React, { createContext, useState, useContext, useEffect } from 'react';
import { GiftItem, Category, User, GalleryImage, SiteSettings } from '@/types';

// Mock data
const initialCategories: Category[] = [
  { id: '1', name: 'Eletrodomésticos', slug: 'eletrodomesticos' },
  { id: '2', name: 'Itens Divertidos', slug: 'itens-divertidos' },
  { id: '3', name: 'Decoração', slug: 'decoracao' },
  { id: '4', name: 'Utensílios de Cozinha', slug: 'utensilios-cozinha' },
];

const initialGifts: GiftItem[] = [
  {
    id: '1',
    title: 'Cafeteira Elétrica',
    description: 'Cafeteira elétrica digital com temporizador e jarra de vidro.',
    price: 299.99,
    imageUrl: 'https://images.unsplash.com/photo-1591369449330-9c184f7180ed?q=80&w=400',
    category: '1',
    status: 'available',
    cashPaymentLink: 'https://example.com/payment/1',
    installmentPaymentLink: 'https://example.com/payment/1/installment',
  },
  {
    id: '2',
    title: 'Conjunto de Jogos de Tabuleiro',
    description: 'Kit com 5 jogos de tabuleiro clássicos para reunir a família.',
    price: 159.90,
    imageUrl: 'https://images.unsplash.com/photo-1610890716171-6b1bb98ffd09?q=80&w=400',
    category: '2',
    status: 'chosen',
    cashPaymentLink: 'https://example.com/payment/2',
  },
  {
    id: '3',
    title: 'Quadro Decorativo',
    description: 'Quadro abstrato com moldura em madeira para sala de estar.',
    price: 89.90,
    imageUrl: 'https://images.unsplash.com/photo-1582582621959-48d27397dc69?q=80&w=400',
    category: '3',
    status: 'available',
    cashPaymentLink: 'https://example.com/payment/3',
    installmentPaymentLink: 'https://example.com/payment/3/installment',
  },
  {
    id: '4',
    title: 'Kit de Facas Profissionais',
    description: 'Conjunto com 6 facas de aço inoxidável e suporte em madeira.',
    price: 349.99,
    imageUrl: 'https://images.unsplash.com/photo-1593618998160-c4d5a436ed53?q=80&w=400',
    category: '4',
    status: 'available',
    cashPaymentLink: 'https://example.com/payment/4',
  },
  {
    id: '5',
    title: 'Liquidificador de Alta Potência',
    description: 'Liquidificador 1200W com 10 velocidades e copo de vidro resistente.',
    price: 259.90,
    imageUrl: 'https://images.unsplash.com/photo-1612487439139-c2622d729710?q=80&w=400',
    category: '1',
    status: 'chosen',
    cashPaymentLink: 'https://example.com/payment/5',
    installmentPaymentLink: 'https://example.com/payment/5/installment',
  },
  {
    id: '6',
    title: 'Conjunto de Almofadas Decorativas',
    description: 'Kit com 4 almofadas coloridas para decoração da sala.',
    price: 119.90,
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=400',
    category: '3',
    status: 'available',
    cashPaymentLink: 'https://example.com/payment/6',
  },
];

const initialGalleryImages: GalleryImage[] = [
  { id: '1', url: 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800', title: 'Celebração' },
  { id: '2', url: 'https://images.unsplash.com/photo-1551970353-3fe576f6cb7d?q=80&w=800', title: 'Momentos Especiais' },
  { id: '3', url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=800', title: 'Nossa História' },
  { id: '4', url: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800', title: 'Juntos' },
];

const initialSiteSettings: SiteSettings = {
  title: 'Lista de Presentes',
  description: 'Selecione um presente especial para celebrar conosco este momento importante.',
  primaryColor: '#fafaf5',
  backgroundColor: '#ffffff',
};

// Initial admin user
const initialUsers: User[] = [
  {
    id: '1',
    username: 'medson',
    password: 'admin123',
    isAdmin: true,
  },
  {
    id: '2',
    username: 'admin',
    password: 'admin123',
    isAdmin: true,
  },
  {
    id: '3',
    username: 'ana',
    password: 'admin123',
    isAdmin: true,
  }
];

// Context type
type GiftContextType = {
  gifts: GiftItem[];
  categories: Category[];
  users: User[];
  galleryImages: GalleryImage[];
  siteSettings: SiteSettings;
  currentUser: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
  addGift: (gift: Omit<GiftItem, 'id'>) => void;
  updateGift: (id: string, gift: Partial<GiftItem>) => void;
  deleteGift: (id: string) => void;
  markAsChosen: (id: string) => void;
  addCategory: (category: Omit<Category, 'id'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;
  addGalleryImage: (image: Omit<GalleryImage, 'id'>) => void;
  deleteGalleryImage: (id: string) => void;
  updateSiteSettings: (settings: Partial<SiteSettings>) => void;
};

// Create context
const GiftContext = createContext<GiftContextType | undefined>(undefined);

// Provider component
export const GiftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Load data from localStorage or use initial data
  const [gifts, setGifts] = useState<GiftItem[]>(() => {
    const savedGifts = localStorage.getItem('gifts');
    return savedGifts ? JSON.parse(savedGifts) : initialGifts;
  });

  const [categories, setCategories] = useState<Category[]>(() => {
    const savedCategories = localStorage.getItem('categories');
    return savedCategories ? JSON.parse(savedCategories) : initialCategories;
  });

  const [users, setUsers] = useState<User[]>(initialUsers);

  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>(() => {
    const savedImages = localStorage.getItem('galleryImages');
    return savedImages ? JSON.parse(savedImages) : initialGalleryImages;
  });

  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => {
    const savedSettings = localStorage.getItem('siteSettings');
    return savedSettings ? JSON.parse(savedSettings) : initialSiteSettings;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(null);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('gifts', JSON.stringify(gifts));
  }, [gifts]);

  useEffect(() => {
    localStorage.setItem('categories', JSON.stringify(categories));
  }, [categories]);

  useEffect(() => {
    localStorage.setItem('users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('galleryImages', JSON.stringify(galleryImages));
  }, [galleryImages]);

  useEffect(() => {
    localStorage.setItem('siteSettings', JSON.stringify(siteSettings));
  }, [siteSettings]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  // Authentication functions
  const login = (username: string, password: string): boolean => {
    const user = users.find(
      (user) => user.username === username && user.password === password
    );
    
    if (user) {
      setCurrentUser(user);
      return true;
    }
    return false;
  };

  const logout = () => {
    setCurrentUser(null);
  };

  // Gift CRUD operations
  const addGift = (gift: Omit<GiftItem, 'id'>) => {
    const newGift = {
      ...gift,
      id: Date.now().toString(),
    };
    setGifts([...gifts, newGift]);
  };

  const updateGift = (id: string, updatedFields: Partial<GiftItem>) => {
    setGifts(
      gifts.map((gift) =>
        gift.id === id ? { ...gift, ...updatedFields } : gift
      )
    );
  };

  const deleteGift = (id: string) => {
    setGifts(gifts.filter((gift) => gift.id !== id));
  };

  const markAsChosen = (id: string) => {
    updateGift(id, { status: 'chosen' });
  };

  // Category CRUD operations
  const addCategory = (category: Omit<Category, 'id'>) => {
    const newCategory = {
      ...category,
      id: Date.now().toString(),
    };
    setCategories([...categories, newCategory]);
  };

  const updateCategory = (id: string, updatedFields: Partial<Category>) => {
    setCategories(
      categories.map((category) =>
        category.id === id ? { ...category, ...updatedFields } : category
      )
    );
  };

  const deleteCategory = (id: string) => {
    setCategories(categories.filter((category) => category.id !== id));
  };

  // Gallery operations
  const addGalleryImage = (image: Omit<GalleryImage, 'id'>) => {
    const newImage = {
      ...image,
      id: Date.now().toString(),
    };
    setGalleryImages([...galleryImages, newImage]);
  };

  const deleteGalleryImage = (id: string) => {
    setGalleryImages(galleryImages.filter((image) => image.id !== id));
  };

  // Site settings
  const updateSiteSettings = (settings: Partial<SiteSettings>) => {
    setSiteSettings({ ...siteSettings, ...settings });
  };

  return (
    <GiftContext.Provider
      value={{
        gifts,
        categories,
        users,
        galleryImages,
        siteSettings,
        currentUser,
        login,
        logout,
        addGift,
        updateGift,
        deleteGift,
        markAsChosen,
        addCategory,
        updateCategory,
        deleteCategory,
        addGalleryImage,
        deleteGalleryImage,
        updateSiteSettings,
      }}
    >
      {children}
    </GiftContext.Provider>
  );
};

// Custom hook to use the context
export const useGiftContext = () => {
  const context = useContext(GiftContext);
  if (context === undefined) {
    throw new Error('useGiftContext must be used within a GiftProvider');
  }
  return context;
};
