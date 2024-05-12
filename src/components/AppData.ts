import { BaseEvents, FormErrors, IItem, IItemList, IOrder, ItemCategory } from "../types/index"
import { Page } from "./Page";
import { Model } from './base/Model'

export interface IItemFull extends IItem {
  status: boolean;
}

export type CatalogChangeEvent = {
  catalog: IItemFull[];
}

export class AppState extends Model<AppState> {
  basket: string[] = [];
  itemList: IItemFull[] = [];
  order: IOrder;
  preview: string | null;
  formErrors: FormErrors = {};

  addItemToBasket(item: IItemFull) {
    if(!this.basket.includes(item.id)) {
      this.basket.push(item.id);
      this.emitChanges(BaseEvents.ITEMS_CHANGED, {itemList: this.itemList});
    } else return
  }

  removeItemFromBasket(item: IItemFull) {
    if(this.basket.includes(item.id)) {
      const itemIndex = this.basket.findIndex(i => i === item.id);
      this.basket.splice(itemIndex, 1);
      this.emitChanges(BaseEvents.ITEMS_CHANGED, {itemList: this.itemList});
      this.emitChanges(BaseEvents.OPEN_BASKET, {itemList: this.itemList})
    }
  }

  getBasket() {
    return this.itemList.filter(item => this.basket.includes(item.id))
  }

  setPreview(item: IItemFull) {
    this.preview = item.id;
    this.emitChanges(BaseEvents.CHANGE_PREVIEW, item)
  }

  setItemList(data: {items: IItemFull[]; total: number}) {
    const { items } = data;
    this.itemList = [...items];
    this.emitChanges(BaseEvents.ITEMS_CHANGED, {itemList: this.itemList})
  }

  getTotalPrice() {
    let totalPrice = 0;

    for(const itemId of this.basket) {
      const item = this.itemList.find(item => item.id === itemId);

      if(item && item.price) {
        totalPrice += item.price
      } else return
    }

    return totalPrice
  }

  clearBasket() {
    this.basket = [];
    this.emitChanges(BaseEvents.ITEMS_CHANGED, {itemList: this.itemList})
  }

  setOrderField(field: keyof Omit<IOrder, 'total' | 'items'>, value: string) {
    this.order[field] = value;

    if (this.validateOrder()) {
        this.events.emit(BaseEvents.ORDER_READY, this.order);
    }
  }

  validateOrder() {
    const errors: typeof this.formErrors = {};

    if(!this.order.email) {
        errors.email = 'Необходимо указать email';
    }
    if(!this.order.phone) {
        errors.phone = 'Необходимо указать телефон';
    }
    if(!this.order.address) {
      errors.address = 'Необходимо указать адрес';
    }
    if(!this.order.payment) {
      errors.payment = 'Необходимо выбрать способ оплаты';
    }

    this.formErrors = errors;
    this.events.emit(BaseEvents.FORM_ERRORS_CHANGE, this.formErrors);
    return Object.keys(errors).length === 0;
  }

  clearOrder() {
    this.order = {
      payment: null,
      address: '',
      email: '',
      phone: '',
      total: 0,
      items: []
    }
  }
}
