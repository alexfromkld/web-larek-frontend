import {Component} from "../base/Component";
import {ensureElement} from "../../utils/utils";

interface ISuccess {
  total: number;
  title: string;
  description: string;
}

interface ISuccessActions {
  onClick: () => void;
}

export class Success extends Component<ISuccess> {
    protected _close: HTMLElement;
    protected _title: HTMLElement;
    protected _description: HTMLElement;

    constructor(container: HTMLElement, actions: ISuccessActions) {
        super(container);

        this._close = ensureElement<HTMLElement>('.order_success-close', this.container);
        this._title = ensureElement<HTMLElement>('.order_success-title', this.container);
        this._description = ensureElement<HTMLElement>('.order_success-description', this.container)

        if (actions?.onClick) {
            this._close.addEventListener('click', actions.onClick);
        }
    }

    set title(value: string) {
      this.setText(this._title, value)
    }

    set description(value: string) {
      this.setText(this._description, value)
    }
}