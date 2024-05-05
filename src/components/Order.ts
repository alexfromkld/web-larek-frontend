import {Form} from "./common/Form";
import {IOrder} from "../types";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

export class Order extends Form<IOrder> {
    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
}