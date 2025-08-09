// Основные интерфейсы данных

export interface IProduct {
  id: string;
  title: string;
  price: number | null;
  description: string;
  image: string;
  category?: string;
}

export interface IOrder {
  payment: 'online' | 'cash';
  address: string;
  email: string;
  phone: string;
  items: string[]; // Массив ID товаров
}

// Типы для API
export interface IApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

// Типы событий
export type TPaymentMethod = 'online' | 'cash';
export type TCartItems = string[];

// Интерфейсы для компонентов
export interface ICatalogOptions {
  container: HTMLElement;
  onCardClick?: (productId: string) => void;
}

export interface IModalOptions {
  onClose?: () => void;
  onSubmit?: (productId: string) => void;
}