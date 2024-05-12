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
4. Класс Modal
   Так же наследует абстратный класс Component. Отвечает за модальные окна. Принимает контент и отрисовывает его в модальном окне. Содержит слледущие методы:
   ```
   - open
   - close
   - render
   ```
8. Класс Basket
   Наследует абстрактный класс Component. Отвечает за отображение корзины.

10. Класс Form
   Наследует абстрактный класс Component. Отвечает за управление и отображение формы. Содержит следущие методы:
```
   - onInputChange
   - render
```
11. Класс Order наследует класс Form. Выполняет функцию отображния заказа и управление им. Реагирует на изменение состояние кнопок выбора оплаты. Так же устанвливает информацию покупателя.
12. Класс Success наследует абстрактный класс Component. Оторбражает результаты заказа.
   
7. Класс AppState
   Управляет состоянием приложения. Содержит следущие методы:
   ```
   - addItemToBasket (добавляет товар в корзину)
   - removeItemFromBasket (удаляет его из корзины)
   - getBasket (получить список товаров в корзине)
   - setPreview (превью товара)
   - setItemList (превью товаров)
   - getTotalPrice (стоимость всех товаров в корзине)
   - clearBasket (очищает корзину)
   - setOrderField (устанавливает значение полей заказа)
   - validateOrder (валидация полей заказа)
   - clearOrder (очистить поля заказа)
   ```
   
Классы отображения



   
