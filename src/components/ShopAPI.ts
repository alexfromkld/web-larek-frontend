import { IItem, IItemList, IOrder, IOrderResult, IShopApi } from "../types";
import { Api } from "./base/api";

export default class ShopAPI extends Api implements IShopApi {
  constructor(baseUrl: string, options?: RequestInit) {
    super(baseUrl, options)
  }

  async getItems(): Promise<IItemList> {
    return (await this.get('/product/')) as IItemList;
  }

  async getItem(id: string): Promise<IItem> {
    return (await this.get(`/product/${id}`)) as IItem;
  }
  
  async makeOrder(order: IOrder): Promise<IOrderResult> {
    return (await this.post('/order', order)) as IOrderResult;
  }
}