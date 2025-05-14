
import React, { createContext, useState, useContext, useEffect } from 'react';
import { GiftItem, Category, User, GalleryImage, SiteSettings } from '@/types';
import { supabase } from "@/integrations/supabase/client";

// Context type
type GiftContextType = {
  gifts: GiftItem[];
  categories: Category[];
  users: User[];
  galleryImages: GalleryImage[];
  siteSettings: SiteSettings;
  currentUser: User | null;
  loading: {
    gifts: boolean;
    categories: boolean;
    galleryImages: boolean;
    siteSettings: boolean;
  };
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  addGift: (gift: Omit<GiftItem, 'id'>) => Promise<void>;
  updateGift: (id: string, gift: Partial<GiftItem>) => Promise<void>;
  deleteGift: (id: string) => Promise<void>;
  markAsChosen: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addGalleryImage: (image: Omit<GalleryImage, 'id'>) => Promise<void>;
  deleteGalleryImage: (id: string) => Promise<void>;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  refreshData: () => Promise<void>;
};

// Create context
const GiftContext = createContext<GiftContextType | undefined>(undefined);

// Provider component
export const GiftProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // State for data
  const [gifts, setGifts] = useState<GiftItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [galleryImages, setGalleryImages] = useState<GalleryImage[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>({
    title: 'Lista de Presentes',
    description: 'Selecione um presente especial para celebrar conosco este momento importante.',
    primaryColor: '#fafaf5',
    backgroundColor: '#ffffff',
  });
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Loading states
  const [loading, setLoading] = useState({
    gifts: true,
    categories: true,
    galleryImages: true,
    siteSettings: true,
  });

  // Fetch data from Supabase
  const fetchGifts = async () => {
    setLoading(prev => ({ ...prev, gifts: true }));
    try {
      const { data, error } = await supabase
        .from('gifts')
        .select('*');
      
      if (error) throw error;

      // Map database fields to our app's structure
      const mappedGifts: GiftItem[] = data.map(gift => ({
        id: gift.id,
        title: gift.title,
        description: gift.description,
        price: Number(gift.price),
        imageUrl: gift.image_url,
        category: gift.category_id,
        status: gift.status as 'available' | 'chosen',
        cashPaymentLink: gift.cash_payment_link || undefined,
        installmentPaymentLink: gift.installment_payment_link || undefined,
      }));
      
      setGifts(mappedGifts);
    } catch (error) {
      console.error('Error fetching gifts:', error);
    } finally {
      setLoading(prev => ({ ...prev, gifts: false }));
    }
  };

  const fetchCategories = async () => {
    setLoading(prev => ({ ...prev, categories: true }));
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*');
      
      if (error) throw error;

      // Map database fields to our app's structure
      const mappedCategories: Category[] = data.map(category => ({
        id: category.id,
        name: category.name,
        slug: category.slug,
      }));
      
      setCategories(mappedCategories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(prev => ({ ...prev, categories: false }));
    }
  };

  const fetchGalleryImages = async () => {
    setLoading(prev => ({ ...prev, galleryImages: true }));
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .select('*');
      
      if (error) throw error;

      // Map database fields to our app's structure
      const mappedImages: GalleryImage[] = data.map(image => ({
        id: image.id,
        url: image.url,
        title: image.title || undefined,
      }));
      
      setGalleryImages(mappedImages);
    } catch (error) {
      console.error('Error fetching gallery images:', error);
    } finally {
      setLoading(prev => ({ ...prev, galleryImages: false }));
    }
  };

  const fetchSiteSettings = async () => {
    setLoading(prev => ({ ...prev, siteSettings: true }));
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .single();
      
      if (error) {
        if (error.code === 'PGRST116') {
          // No settings found, we'll use the default ones
          console.log('No site settings found, using defaults');
        } else {
          throw error;
        }
      } else if (data) {
        // Map database fields to our app's structure
        setSiteSettings({
          title: data.title,
          description: data.description,
          primaryColor: data.primary_color,
          backgroundColor: data.background_color,
        });
      }
    } catch (error) {
      console.error('Error fetching site settings:', error);
    } finally {
      setLoading(prev => ({ ...prev, siteSettings: false }));
    }
  };

  // Fetch admin users
  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*');
      
      if (error) throw error;

      // Map database fields to our app's structure
      const mappedUsers: User[] = data.map(user => ({
        id: user.id,
        username: user.username,
        password: user.password, // Note: In production, we'd never return passwords
        isAdmin: user.is_admin,
      }));
      
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Function to refresh all data
  const refreshData = async () => {
    await Promise.all([
      fetchGifts(),
      fetchCategories(),
      fetchGalleryImages(),
      fetchSiteSettings(),
      fetchUsers()
    ]);
  };

  // Initial data load
  useEffect(() => {
    refreshData();
    
    // Check for existing login
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
  }, []);

  // Authentication functions
  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const { data, error } = await supabase
        .from('admin_users')
        .select('*')
        .eq('username', username)
        .eq('password', password)
        .single();
      
      if (error || !data) return false;

      const user: User = {
        id: data.id,
        username: data.username,
        password: data.password,
        isAdmin: data.is_admin,
      };
      
      setCurrentUser(user);
      localStorage.setItem('currentUser', JSON.stringify(user));
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('currentUser');
  };

  // Gift CRUD operations
  const addGift = async (gift: Omit<GiftItem, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('gifts')
        .insert({
          title: gift.title,
          description: gift.description,
          price: gift.price,
          image_url: gift.imageUrl,
          category_id: gift.category,
          status: gift.status,
          cash_payment_link: gift.cashPaymentLink,
          installment_payment_link: gift.installmentPaymentLink,
        })
        .select()
        .single();
      
      if (error) throw error;

      // Update local state
      const newGift: GiftItem = {
        id: data.id,
        title: data.title,
        description: data.description,
        price: Number(data.price),
        imageUrl: data.image_url,
        category: data.category_id,
        status: data.status as 'available' | 'chosen',
        cashPaymentLink: data.cash_payment_link,
        installmentPaymentLink: data.installment_payment_link,
      };
      
      setGifts(prev => [...prev, newGift]);
    } catch (error) {
      console.error('Error adding gift:', error);
    }
  };

  const updateGift = async (id: string, updatedFields: Partial<GiftItem>) => {
    try {
      // Map our app's structure fields to database fields
      const dbFields: any = {};
      
      if (updatedFields.title !== undefined) dbFields.title = updatedFields.title;
      if (updatedFields.description !== undefined) dbFields.description = updatedFields.description;
      if (updatedFields.price !== undefined) dbFields.price = updatedFields.price;
      if (updatedFields.imageUrl !== undefined) dbFields.image_url = updatedFields.imageUrl;
      if (updatedFields.category !== undefined) dbFields.category_id = updatedFields.category;
      if (updatedFields.status !== undefined) dbFields.status = updatedFields.status;
      if (updatedFields.cashPaymentLink !== undefined) dbFields.cash_payment_link = updatedFields.cashPaymentLink;
      if (updatedFields.installmentPaymentLink !== undefined) dbFields.installment_payment_link = updatedFields.installmentPaymentLink;

      const { error } = await supabase
        .from('gifts')
        .update(dbFields)
        .eq('id', id);
      
      if (error) throw error;

      // Update local state
      setGifts(prev => 
        prev.map(gift => 
          gift.id === id ? { ...gift, ...updatedFields } : gift
        )
      );
    } catch (error) {
      console.error('Error updating gift:', error);
    }
  };

  const deleteGift = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gifts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      // Update local state
      setGifts(prev => prev.filter(gift => gift.id !== id));
    } catch (error) {
      console.error('Error deleting gift:', error);
    }
  };

  const markAsChosen = async (id: string) => {
    try {
      // Get current status
      const gift = gifts.find(g => g.id === id);
      if (!gift) return;
      
      const newStatus = gift.status === 'available' ? 'chosen' : 'available';
      
      await updateGift(id, { status: newStatus });
    } catch (error) {
      console.error('Error marking gift as chosen:', error);
    }
  };

  // Category CRUD operations
  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          name: category.name,
          slug: category.slug,
        })
        .select()
        .single();
      
      if (error) throw error;

      const newCategory: Category = {
        id: data.id,
        name: data.name,
        slug: data.slug,
      };
      
      setCategories(prev => [...prev, newCategory]);
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const updateCategory = async (id: string, updatedFields: Partial<Category>) => {
    try {
      const { error } = await supabase
        .from('categories')
        .update(updatedFields)
        .eq('id', id);
      
      if (error) throw error;

      setCategories(prev => 
        prev.map(category => 
          category.id === id ? { ...category, ...updatedFields } : category
        )
      );
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from('categories')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      setCategories(prev => prev.filter(category => category.id !== id));
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  // Gallery operations
  const addGalleryImage = async (image: Omit<GalleryImage, 'id'>) => {
    try {
      const { data, error } = await supabase
        .from('gallery_images')
        .insert({
          url: image.url,
          title: image.title,
        })
        .select()
        .single();
      
      if (error) throw error;

      const newImage: GalleryImage = {
        id: data.id,
        url: data.url,
        title: data.title || undefined,
      };
      
      setGalleryImages(prev => [...prev, newImage]);
    } catch (error) {
      console.error('Error adding gallery image:', error);
    }
  };

  const deleteGalleryImage = async (id: string) => {
    try {
      const { error } = await supabase
        .from('gallery_images')
        .delete()
        .eq('id', id);
      
      if (error) throw error;

      setGalleryImages(prev => prev.filter(image => image.id !== id));
    } catch (error) {
      console.error('Error deleting gallery image:', error);
    }
  };

  // Site settings
  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    try {
      // Check if settings exist
      const { data: existingSettings } = await supabase
        .from('site_settings')
        .select('id')
        .limit(1);
      
      const dbSettings: any = {};
      if (settings.title !== undefined) dbSettings.title = settings.title;
      if (settings.description !== undefined) dbSettings.description = settings.description;
      if (settings.primaryColor !== undefined) dbSettings.primary_color = settings.primaryColor;
      if (settings.backgroundColor !== undefined) dbSettings.background_color = settings.backgroundColor;

      if (existingSettings && existingSettings.length > 0) {
        // Update existing settings
        const { error } = await supabase
          .from('site_settings')
          .update(dbSettings)
          .eq('id', existingSettings[0].id);
        
        if (error) throw error;
      } else {
        // Insert new settings if none exist
        const { error } = await supabase
          .from('site_settings')
          .insert({
            title: settings.title || siteSettings.title,
            description: settings.description || siteSettings.description,
            primary_color: settings.primaryColor || siteSettings.primaryColor,
            background_color: settings.backgroundColor || siteSettings.backgroundColor,
          });
        
        if (error) throw error;
      }

      setSiteSettings(prev => ({ ...prev, ...settings }));
    } catch (error) {
      console.error('Error updating site settings:', error);
    }
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
        loading,
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
        refreshData,
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
