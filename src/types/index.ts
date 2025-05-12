
export interface GiftItem {
  id: string;
  title: string;
  description: string;
  price: number;
  imageUrl: string;
  category: string;
  status: 'available' | 'chosen';
  cashPaymentLink?: string;
  installmentPaymentLink?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
}

export interface User {
  id: string;
  username: string;
  password: string;
  isAdmin: boolean;
}

export interface GalleryImage {
  id: string;
  url: string;
  title?: string;
}

export interface SiteSettings {
  title: string;
  description: string;
  primaryColor: string;
  backgroundColor: string;
}
