import {Form} from "./common/Form";
import {IOrder} from "../types";
import {IEvents} from "./base/events";
import {ensureElement} from "../utils/utils";

export class Order extends Form<IOrder> {
    protected _paymentButton;

    constructor(container: HTMLFormElement, events: IEvents) {
        super(container, events);

        this._paymentButton = Array.from(container.querySelectorAll('.button_alt')) as HTMLButtonElement[];

        if(this._paymentButton.length) {
            this._paymentButton.forEach(button => {
                button.addEventListener('click', () => {
                    this._paymentButton.forEach(button => {
                        button.classList.toggle('button_alt-active', false)
                    })
                    button.classList.toggle('button_alt-active', true);
                    this.payment = button.name;
                })
            })
        }
    }

    set phone(value: string) {
        (this.container.elements.namedItem('phone') as HTMLInputElement).value = value;
    }

    set email(value: string) {
        (this.container.elements.namedItem('email') as HTMLInputElement).value = value;
    }
    
    set address(value: string) {
        (this.container.elements.namedItem('address') as HTMLInputElement).value = value;
    }

    set payment(value: string) {
        this.events.emit('order:setPaymentType', { paymentType: value });
    }
}