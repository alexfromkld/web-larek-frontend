# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Документация

## Типы
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

## Базовый код

1. Класс Api
   Обеспечивает основную функциональность для взаимодействия с сервером. Тип ApiPostMethods ограничивает возможные методы запросов (POST, PUT, DELETE).
   ```
   - baseUrl: string (строка содержащая базоый URL-адрес для всех запросов)
   - #options: RequestInit ({} содержащий опции запроса по умолчанию, наппример Headers)

   - constructor(string, RequestInit = {}) метод создания нового экземпляра Api, принимает базовый URL: string и параметры запроса: RequestInit
   - #handleResponse(Response): Promise<object> обрабатывает ответы с сервера
   - get(string) GET-запрос с сервера
   - post(string, object, ApiPostMethods = 'POST') метод выполнения POST-запроса
   ```

2. Класс Component<T>
   Абстрактный класс, служит в качестве базового компонента для работы с DOM, описание основных методов и свойств:
```
   - constructor(HTMLElement) принимает контейнерный элемент

   - toggleClass(HTMLElement, string, boolean?) переключение класса элемента
   - setText(HTMLElement, unknown) устанавливает текстовое содержимое указанного элемента
   - setDisabled(HTMLElement, boolean) устанавливает/снимает блокировку с элемента
   - setHidden(HTMLElement) скрывает указанный элемент
   - setVisible(HTMLElement) отображает указанный элемент
   - setImage(HTMLImageElement, string, string?) устанавливет изображение
   - render(Partial<T>): HTMLElement метод который можно переопределить в дочерних коассах для отображения компонента. Возвращает контейнерный элемент
```
3. Класс EventEmitter
   Обечпечивает работу событий. Его функции это возможность установить и снять слушателей событий, вызвать слушателей при возникновении события. Имеет следущие методы:

   Типы (EventName, Subscriber, EmitterEvent)
   ```
   - EventName - Алиас для строкового типа или регулярного выражения, представляющего названия событий.
   - Subscriber - Алиас для функции, которая является обработчиком события.
   - EmitterEvent - Интерфейс, представляющий структуру данных события.
   ```

   Интерфейс IEvents:
   ```
   on<T extends object>(EventName, callback) Метод для подписки на событие. Принимает название события и коллбек, который будет вызван при наступлении события.
   emit<T extends object>(string, T): void Метод для инициирования события. Принимает название события и опциональные данные, которые будут переданы обработчикам.
   trigger<T extends object>(string, Partial<T>?) Метод, который возвращает функцию-триггер для определенного события. Этот триггер может быть вызван для инициирования события с заданными данными.
   ```
   Свойства
   ```
   _events: Map<EventName, Set<Subscriber>> хранит множество подписчиков для каждого события
   ```
   Методы
   ```
   -on Устанавливает обработчик на указанное событие.
   -off Удаляет обработчик с указанного события.
   -emit Инициирует событие, вызывая все подписанные обработчики.
   -onAll Устанавливает обработчик на все события.
   -ofAll Удаляет все обработчики событий.
   -trigger Создает триггер для указанного события.
   ```

5. Класс Model<T>
   Служит для создания моделей данных в приложении. Вот краткое описание его основных элементов:
   ```
   isModel(obj: unknown): obj is Model<any> Гарда для проверки на модель.
   ```
   Абстрактный класс Model<T>:
   ```
   - constructor(Partial<T>, IEvents(см.выше)) принимает частичные данные модели и {} событий IEvents. При создании экземпляра модели, данные копируются в объект, и события используются для уведомления об изменениях.
   - emitChanges(string, object) оповещает подписчиков об изменениях в модели.
   ```
## View

1. Класс Page
   Расширяет базовый класс Component и представляет страницу веб-приложения. Вот краткое описание его основных элементов:
   Inteface IPage:
   ```
   counter: number
   catalog: HTMLElement[]
   locked: boolean
   ```
   Класс Page
   ```
   constructor(HTMLElement, IEvents) Конструктор класса, принимающий контейнерный элемент страницы и объект событий. Вызывает конструктор родительского класса Component и инициализирует элементы страницы.
   ```
   Свойства
   ```
   - #_counter: HTMLElement эл-т счётчика
   - #_catalog HTMLElement эл-т каталога
   - #_wrapper HTMLElement эл-т обёртки
   - #_basket HTMLElement эл-т корзины
   ```
   Методы
   ```
   -set counter (устанавливает счётчик товаров в корзине)
   -set catalog (устанавливет список товаров)
   -set locked (блокирует/разблокирует прокрутку страницы)
   ```
2. Класс Item<T>
   Расширяет базовый класс Component и представляет отдельный элемент или товар на веб-странице. Вот краткое описание его основных элементов:
   
   Интерфейс IItemActions:
     onClick: (event: MouseEvent): void определяет структуру обработчиков действий
   
   Интерфейс IItem<T>
   ```
   - index: number
   - title: string
   - description: string | string[]
   - image: string
   - status: T
   - price: string
   - category: ItemCategory(см. выше в Типах)
   ```
   Класс Item<T>:

   constructor(string, HTMELement, ItemActions?) принимает имя блока, контейнерный элемент и {} действий -> вызывает родительский конструктор и инициализирует элементы товара
   
   Свойства:
   ```
   - #_title
   - #_button
   - #_description
   - #_image
   - #_category
   - #_price
   ```
   Методы геттеры и сеттеры: 
   ```
   - set/get id
   - set/get title
   - set/get image
   - set/get category
   - set/get price
   - set description
   ```
3. Класс CatalogItem
   Расширяет класс Item<CatalogItemStatus> и представляет элемент каталога товаров на веб-странице. Вот краткое описание его основных элементов:

   Тип CatalogItemStatus:
   - status: boolean

   constructor(HTMLElement, IItemActions?) вызывает родительский конструктор и инициализирует элементы каталога

   Свойства:

   - #_status: HTMLElement

   Методы:

   - set status(CatalogItemStatus) Устанавливает статус товара в зависимости от переданного значения. Если товар недоступен (статус true), кнопка будет отключена и текст на ней изменится на "Уже в корзине".

4. Класс BasketItem
   Также расширяет класс Item<BasketItemIndex>, но представляет элемент корзины товаров на веб-странице. Вот краткое описание его основных элементов:

   Тип BasketItemIndex:
   - index: number;

   ```
   #_index: HTMLElement Элемент, представляющий индекс товара в корзине.

   constructor(HTMLElement, IItemActions?) Вызывает конструктор родительского класса Item и инициализирует элементы корзины.

   set index(number) Устанавливает индекс товара в корзине, отображая его в соответствующем элементе.
   ```
5. Класс Modal
   Расширяет базовый класс Component<IModalData> и представляет модальное окно на веб-странице. Вот краткое описание его основных элементов:

   Интерфейс IModalData:
   - content: HTMLElement Определяет структуру данных для содержимого модального окна.

   Modal:
   ```
   #_closeButton: HTMLButtonElement кнопка закрытия модального окна
   #_content: HTMLElement содержимое модального окна

   constructor(HTMElement, IEvents) Вызывает конструктор родительского класса Component и инициализирует элементы модального окна. Устанавливает обработчики событий для кнопки закрытия, самого модального окна и его содержимого.

   set content(HTMLElement) устанавливает содержимое модального окна
   open() Открывает модальное окно, добавляя ему класс "modal_active" и инициирует событие "modal:open".
   close() Закрывает модальное окно, удаляя у него класс "modal_active", очищает содержимое и инициирует событие "modal:close".
   render() Метод для рендеринга модального окна. Вызывает метод open() после рендеринга, чтобы открыть модальное окно.
   ```
6. Класс Basket
   Расширяет базовый класс Component<IBasketView> и представляет корзину на веб-странице. Вот краткое описание его основных элементов:

   Интерфейс IBasketView:
   - items: HTMLElement[]
   - total: number
   - selected: string[]

   Basket:
   ```
   #_list: HTMElement Элемент списка товаров в корзине.
   #_total: HTMLElement Элемент отображения общей суммы заказа.
   #_button: HTMLElelemnt Кнопка оформления заказа.

   constructor(HTMElement, IEvents) Вызывает конструктор родительского класса Component и инициализирует элементы корзины. Устанавливает обработчик события для кнопки оформления заказа.

   set items(HTMLElement[]) Устанавливает элементы в список корзины. Если список пуст, отображается сообщение о том, что корзина пуста.
   set selected(string[]) Устанавливает состояние кнопки оформления заказа в зависимости от выбранных элементов.
   set totoal(number) Устанавливает общую сумму заказа
   ```

7. Класс Form<T>
   Расширяет базовый класс Component<IFormState> и представляет форму на веб-странице. Вот краткое описание его основных элементов:

   Интерфейс IFormState:
   - valid: boolean
   - errors: string[]

   Form<T>:
   ```
   #_submit: HTMLButtonElement Кнопка отправки формы.
   #_errors: HTMLElement Элемент для отображения ошибок формы.

   constructor(HTMLFormElement, IEvents) Вызывает конструктор родительского класса Component и инициализирует элементы формы. Устанавливает обработчики событий для ввода данных и отправки формы.

   onInputChange(keyof T, string) Обрабатывает изменения в полях ввода формы и генерирует событие с информацией о измененном поле и его значении.
   render(Partial<T> & IFormState) Метод для рендеринга формы. Вызывает родительский метод render для установки состояния формы, а затем применяет значения состояния к элементам формы.

   set valid(boolean) блокирует/разблокирует кнопку отправки
   set errors(string) устанавливает ошибку в элемент ошибки
   ```
   
9. Класс Order
   Расширяет класс Form<IOrder> и представляет форму заказа на веб-странице. Вот краткое описание его основных элементов:

   ```
   #_paymentButton Массив кнопок выбора способа оплаты.

   constructor(HTMLFormElement, IEvents) Вызывает конструктор родительского класса Form, передавая ему контейнерную форму и объект событий.

   Сеттеры для установки значений полей
   set phone(string)
   set email(string)
   set address(string)
   set payment(string)
   ```

10. Класс Success
   Расширяет класс Component<ISuccess> и представляет компонент успешного завершения заказа на веб-странице. Вот краткое описание его основных элементов:

   Интерфейс ISuccess: 
   - total:  number общая сумма заказа
   - title: string заголовок
   - description: string описание

   Интерфейс ISuccessActions:
     onClick: () => void Определяет структуру данных для действий компонента успешного завершения заказа. В данном случае, это просто функция обратного вызова при клике на элемент.

   ```
   #_close: HTMLElement Элемент для закрытия компонента.
   #_title: HTMLElement Элемент заголовка компонента.
   #_description: HTMLElement Элемент описания компонента.

   constructor(HTMLElement, ISuccessActions) Вызывает конструктор родительского класса Component и инициализирует элементы компонента успешного завершения заказа. Устанавливает обработчик события для закрытия компонента.

   set titile(string) Устанавливает заголовок компонента.
   set description(string) Устанавливает описание компонента.
   ```

## Model

1. Класс AppState
   Расширяет класс Model<AppState> и представляет состояние приложения. Вот краткое описание его основных элементов:

   Интерфейс IItemFull: расширяет интерфейс IItem (см. выше в Типах)
   - status: boolean

   Тип CatalogChangeEvent:
   - catalog: IItemFull[]

   ```
   basket: string[] = [] Массив идентификаторов товаров в корзине.
   itemList: IItemFull[] = [] Массив полных данных о товарах в каталоге.
   order: IOrder(см. выше в Типах) Информация о заказе, включая метод оплаты, адрес доставки, email, телефон, общую сумму и выбранные товары.
   preview: string | null Идентификатор товара, выбранного для предварительного просмотра.
   formErrors: FormErrors = {} Объект с ошибками формы заказа.

   
   addItemToBasket(IItemFull) добавляет товар в корзину и генерирует событие изменение корзины
   removeItemFromBasket(IItemFull) удаляет его из корзины и генерирует событие изменение корзины и открытие её
   getBasket() Возвращает товары, находящиеся в корзине.
   setPreview(IItemFull) Устанавливает товар для предварительного просмотра и генерирует событие изменения выбранного товара.
   setItemList(data: {IItemFull[], number}) Устанавливает список товаров и общую сумму.
   getTotalPrice() Вычисляет общую стоимость товаров в корзине.
   clearBasket() Очищает корзину и генерирует событие изменения корзины.
   setOrderField(keyof Omit<IOrder, 'total' | 'items'>, string) Устанавливает значение поля заказа и, если заказ валиден, генерирует событие готовности заказа.
   validateOrder() Проверяет валидность данных заказа и генерирует событие изменения ошибок формы.
   clearOrder() Очищает данные заказа.
   ```

## Основные события приложения
  export const BaseEvents = {
  ['ITEMS_CHANGED']: 'items:changed',
  ['OPEN_PREVIEW']: 'item:open-preview',
  ['CHANGE_PREVIEW']: 'item:changed-preview',
  ['OPEN_BASKET']: 'basket:open',
  ['ADD_ITEM']: 'basket:add-item',
  ['REMOVE_ITEM']: 'basket:remove-item',
  ['OPEN_MODAL']: 'modal:open',
  ['CLOSE_MODAL']: 'modal:close',
  ['OPEN_ORDER']: 'order:open',
  ['ORDER_READY']: 'order:ready',
  ['FORM_ERRORS_CHANGE']: 'formErrors:change',
  ['SET_PAYMENT_TYPE']: 'order:setPaymentType'
}

   
