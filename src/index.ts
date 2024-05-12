import { AppState, IItemFull, CatalogChangeEvent } from './components/AppData';
import ShopAPI from './components/ShopAPI';
import { Api } from './components/base/api';
import EventEmitter from './components/base/events';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { CatalogItemStatus, CatalogItem, Item, BasketItem } from './components/Item';
import { Page } from './components/Page';
import { Modal } from './components/common/Modal';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';
import { Basket } from './components/common/Basket';
import { BaseEvents } from './types';

//шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const itemBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');

const api = new ShopAPI(API_URL);
const appData = new AppState({}, EventEmitter)
const page = new Page(document.body, EventEmitter);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), EventEmitter)
const basket = new Basket(cloneTemplate(basketTemplate), EventEmitter)


api.getItems()
EventEmitter.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

//отрисовка карточек при изменении 
EventEmitter.on<CatalogChangeEvent>(BaseEvents.ITEMS_CHANGED, () => {
	page.catalog = appData.itemList.map((item) => {
		const product = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => EventEmitter.emit(BaseEvents.OPEN_PREVIEW, item),
		});

		return product.render({
			title: item.title,
			image: CDN_URL + item.image,
			description: item.description,
			price: item.price !== null ? item.price.toString() + ' синапсов' : 'Бесценно',
			category: item.category,
		});
	});

	page.counter = appData.getBasket().length;
});

//открыть модальное окно карточки
EventEmitter.on(BaseEvents.OPEN_PREVIEW, (item: IItemFull) => {
  appData.setPreview(item)
})

//изменение открытого товара
EventEmitter.on(BaseEvents.CHANGE_PREVIEW, (item: IItemFull) => {
	const card = new CatalogItem(cloneTemplate(cardPreviewTemplate), {
		onClick: () => EventEmitter.emit(BaseEvents.ADD_ITEM, item),
	})

	modal.render({
		content: card.render({
			title: item.title,
			image: CDN_URL + item.image,
			description: item.description,
			category: item.category,
			price: item.price !== null ? item.price.toString() + ' синапсов' : 'Бесценно',
			status: {
				status: item.price === null || appData.basket.includes(item.id)
			}
		})
	})
})

//добавить в корзину
EventEmitter.on(BaseEvents.ADD_ITEM, (item: IItemFull) => {
	appData.addItemToBasket(item);
	modal.close();
})



EventEmitter.on(BaseEvents.OPEN_BASKET, () => {
	const items = appData.getBasket().map((item, index) => {
		const product = new BasketItem(cloneTemplate(itemBasketTemplate), {
			onClick: () => EventEmitter.emit(BaseEvents.REMOVE_ITEM, item),
		});
		return product.render({
			index: index + 1,
			title: item.title,
			description: item.description,
			price: item.price?.toString() || '0',
			category: item.category
		})
	})
	modal.render({
		content: createElement<HTMLElement>('div', {}, [
			basket.render({
				items,
				total: appData.getTotalPrice()
			})
		])
	})
})

EventEmitter.on(BaseEvents.REMOVE_ITEM, (item: IItemFull) => {	
	appData.removeItemFromBasket(item);
})

EventEmitter.on(BaseEvents.OPEN_MODAL, () => {
	page.locked = true;
})

EventEmitter.on(BaseEvents.CLOSE_MODAL, () => {
	page.locked = false;
})

api.getItems()
	.then(appData.setItemList.bind(appData))
  //.then(res => console.log(res))
	.catch((err) => {
		console.error(err);
	});