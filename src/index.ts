import { AppState, IItemFull } from './components/AppData';
import ShopAPI from './components/ShopAPI';
import { Api } from './components/base/api';
import EventEmitter from './components/base/events';
import './scss/styles.scss';
import { API_URL, CDN_URL } from './utils/constants';
import { CatalogItemStatus, CatalogItem, Item } from './components/Item';
import { Page } from './components/Page';
import { cloneTemplate, createElement, ensureElement } from './utils/utils';

const api = new ShopAPI(API_URL);
const appData = new AppState({}, EventEmitter)
const page = new Page(document.body, EventEmitter)

//шаблоны
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');

api.getItems()
EventEmitter.onAll(({ eventName, data }) => {
	console.log(eventName, data);
});

//отрисовка карточек при изменении 
EventEmitter.on<CatalogItemStatus>('items:changed', () => {
	page.catalog = appData.itemList.map((item) => {
		const product = new CatalogItem(cloneTemplate(cardCatalogTemplate), {
			onClick: () => EventEmitter.emit('item:open-preview', item),
		});

		return product.render({
			title: item.title,
			image: CDN_URL + item.image,
			description: item.description,
			price: item.price !== null ? item.price.toString() + ' синапсов' : '',
			category: item.category,
		});
	});

	page.counter = appData.getBasket().length;
});

//открыть модальное окно карточки
EventEmitter.on('item:open-preview', (item: IItemFull) => {
  appData.setPreview(item)
  console.log('click')
})


api.getItems()
	.then(appData.setItemList.bind(appData))
  //.then(res => console.log(res))
	.catch((err) => {
		console.error(err);
	});