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

##Базовый код

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
   - EventName - Алиас для строкового типа или регулярного выражения, представляющего названия событий.
   - Subscriber - Алиас для функции, которая является обработчиком события.
   - EmitterEvent - Интерфейс, представляющий структуру данных события.

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

4. Класс Model<T>
   Служит для создания моделей данных в приложении. Вот краткое описание его основных элементов:

   isModel(obj: unknown): obj is Model<any> Гарда для проверки на модель.

   Абстрактный класс Model<T>:
   ```
   - constructor(Partial<T>, IEvents(см.выше)) принимает частичные данные модели и {} событий IEvents. При создании экземпляра модели, данные копируются в объект, и события используются для уведомления об изменениях.
   - emitChanges(string, object) оповещает подписчиков об изменениях в модели.
   ```


   
6. Класс AppState
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

1. Класс Page
   Наследует абстрактный класс Component. Отображает главную страницу. Имеет следующие методы:
   ```
   -set counter (устанавливает счётчик товаров в корзине)
   -set catalog (устанавливет список товаров)
   -set locked (блокирует/разблокирует прокрутку страницы)
   ```
3. Класс Item
   Наследует абстрактный класс Component. Содержит в себе методы для управления и отображением товара. Содержит следущие свойства и методы:
   ```
   - #_title
   - #_button
   - #_description
   - #_image
   - #_category
   - #_price

   - set/get id
   - set/get title
   - set/get image
   - set/get category
   - set/get price
   - set description
   ```
5. Класс CatalogItem
   Наследуется от класса Item. Управляет состоянием кнопки добавления товара в корзину. Принимая в качесвте аргумента status.
6. Класс Modal
   Так же наследует абстратный класс Component. Отвечает за модальные окна. Принимает контент и отрисовывает его в модальном окне. Содержит слледущие методы:
   ```
   - open
   - close
   - render
   ```
8. Класс Basket
   Наследует абстрактный класс Component. Отвечает за отображение корзины.
9. Класс BasketItem
   Наследует класс Item для отображение товаров в корзине. Устанавливет index для списка товаров в корзине.
10. Класс Form
   Наследует абстрактный класс Component. Отвечает за управление и отображение формы. Содержит следущие методы:
```
   - onInputChange
   - render
```
11. Класс Order наследует класс Form. Выполняет функцию отображния заказа и управление им. Реагирует на изменение состояние кнопок выбора оплаты. Так же устанвливает информацию покупателя.
12. Класс Success наследует абстрактный класс Component. Оторбражает результаты заказа.

   
