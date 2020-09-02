import { Subject } from "rxjs";

export interface UserInteractionConfiguration {
  clickArea: HTMLCanvasElement;
  pseudo: HTMLInputElement;
}

export default class UserInteraction {
  private _config: UserInteractionConfiguration;

  public event: Subject<Event>;
  public click: Subject<{ x: number; y: number }>;
  public pseudo: Subject<string>;

  constructor(conf: UserInteractionConfiguration) {
    this._config = conf;
    this.event = new Subject();
    this.click = new Subject();
    this.pseudo = new Subject();
  }

  private onPseudoChange() {
    if (this._config.pseudo.value) {
      this.pseudo.next(this._config.pseudo.value);
    }
    this.event.next(new Event("pseudo"));
  }

  private onClick(mouse: MouseEvent) {
    const rect = this._config.clickArea.getBoundingClientRect();
    this.click.next({
      y: mouse.y - rect.top,
      x: mouse.x - rect.left,
    });
    this.event.next(new Event("click"));
  }

  enable() {
    this._config.clickArea.addEventListener(
      "mousedown",
      (e) => this.onClick(e),
      false
    );
    this._config.pseudo.addEventListener("input", () => this.onPseudoChange());
  }

  desable() {
    this._config.clickArea.removeEventListener("mousedown", (e) =>
      this.onClick(e)
    );
    this._config.pseudo.removeEventListener("input", () =>
      this.onPseudoChange()
    );
  }
}
