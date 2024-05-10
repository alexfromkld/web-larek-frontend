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
- src/styles/styles.scss — корневой файл стилей
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

1. Класс Component
   Абстрактный класс, базовый класс для всех элементов интерфейса. Содержит следующие методы:
```
   - toggleClass
   - setText
   - setDisabled
   - setHidden
   - setVisible
   - setImage
   - render
```
3. Класс Model
   Так же является абстрактным классом. Отслеживает изменение компонентов. Включает в себя единственный метод emitChanges который сообщает об изменение модели.
4. Класс AppState
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
6. Класс EventEmitter
   Обечпечивает работу событий. Его функции это возможность установить и снять слушателей событий, вызвать слушателей при возникновении события. Имеет следущие методы:
   ```
   -on
   -off
   -emit
   -onAll
   -ofAll
   -trigger
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

## Типы
export type ItemCategory = 'софт-скил' | 'другое' | 'дополнительное' | 'кнопка' | 'хард-скил';

export type FormErrors = Partial<Record<keyof IOrder, string>>

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
   
