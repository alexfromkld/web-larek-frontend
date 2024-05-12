export type ItemCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export type FormErrors = Partial<Record<keyof IOrder, string>>

export type ApiListResponse<Type> = {
  total: number,
  items: Type[]
};

export interface IItem {
  category: ItemCategory,
  description: string,
  id: string,
  image: string,
  price: number | null,
  title: string
}

export interface IItemList {
  total: number,
  items: IItem[]
}

export interface IOrder {
  payment: string,
  address: string,
  email: string,
  phone: string,
  total: number,
  items: string[]
}

export interface IOrderResult {
  id: string,
  total: number,
  error?: string
}

export interface IShopApi {
  getItems: () => Promise<IItemList>;
  getItem: (id: string) => Promise<IItem>;
  makeOrder: (order: IOrder) => Promise<IOrderResult>
}

export const BaseEvents = {
  ['ITEMS_CHANGED']: 'items:changed',
  
}






