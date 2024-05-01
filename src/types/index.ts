export type ItemCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил'; 

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

//API
export interface IShopApi {
  getItems: () => Promise<IItemList>;
  getItem: (id: string) => Promise<IItem>;
  makeOrder: (order: IOrder) => Promise<IOrderResult>
}

//Events


