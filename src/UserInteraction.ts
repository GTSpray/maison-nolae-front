import { Subject } from "rxjs";

export interface UserInteractionConfiguration {
  clickArea: HTMLCanvasElement;
  pseudo: HTMLInputElement;
}

export interface MousePosition {
  x: number;
  y: number;
}

function getMousePosition(
  element: HTMLElement,
  event: MouseEvent
): MousePosition {
  const rect = element.getBoundingClientRect();
  return {
    x: Math.round(event.clientX - rect.left),
    y: Math.round(event.clientY - rect.top)
  };
}

export default class UserInteraction {
  private _config: UserInteractionConfiguration;

  public event: Subject<Event>;
  public click: Subject<MousePosition>;
  public pseudo: Subject<string>;

  constructor(conf: UserInteractionConfiguration) {
    this._config = conf;
    this.event = new Subject();
    this.click = new Subject();
    this.pseudo = new Subject();

    // Prevent scrolling when touching the canvas
    this._config.clickArea.addEventListener(
      "touchstart",
      (e) => {
        this.dispatchEventMouse(e);
      },
      false
    );
    this._config.clickArea.addEventListener(
      "touchend",
      (e) => {
        if (typeof e.cancelable !== "boolean" || e.cancelable) {
          e.preventDefault();
        }

        e.stopPropagation();
      },
      false
    );
    this._config.clickArea.addEventListener(
      "touchmove",
      (e) => {
        this.dispatchEventMouse(e);
      },
      false
    );
  }

  private dispatchEventMouse(e: TouchEvent) {
    const touch = e.touches[0];
    const mouseEvent = new MouseEvent("mousedown", {
      clientX: touch.clientX,
      clientY: touch.clientY
    });
    this._config.clickArea.dispatchEvent(mouseEvent);
  }

  private onPseudoChange() {
    if (this._config.pseudo.value) {
      this.pseudo.next(this._config.pseudo.value);
    }
    this.event.next(new Event("pseudo"));
  }

  private onClick(e: MouseEvent) {
    if (typeof e.cancelable !== "boolean" || e.cancelable) {
      e.preventDefault();
    }
    e.stopPropagation();

    this._config.pseudo.blur();

    const position: MousePosition = getMousePosition(this._config.clickArea, e);
    this.click.next(position);
    this.event.next(new Event("click"));
  }

  enable(): void {
    this._config.clickArea.addEventListener(
      "mousedown",
      (e) => this.onClick(e),
      false
    );
    this._config.pseudo.addEventListener("input", () => this.onPseudoChange());
  }

  desable(): void {
    this._config.clickArea.removeEventListener("mousedown", (e) =>
      this.onClick(e)
    );
    this._config.pseudo.removeEventListener("input", () =>
      this.onPseudoChange()
    );
  }
}
