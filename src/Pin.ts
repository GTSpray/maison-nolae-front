export default class Pin {
  public _sprite: HTMLImageElement;
  private _width: number;
  private _height: number;
  private _x: number;
  private _y: number;
  private _text: string;

  constructor(sprite: HTMLImageElement, text: string, w?: number, h?: number) {
    this._sprite = sprite;
    this._width = w ? w : sprite.width;
    this._height = h ? h : sprite.height;
    this._x = 0;
    this._y = 0;
    this._text = text;
  }

  get sprite() {
    return this._sprite;
  }

  get width() {
    return this._width;
  }

  get height() {
    return this._height;
  }

  set text(text: string) {
    this._text = text;
  }

  get text() {
    return this._text;
  }

  set x(x: number) {
    this._x = x - this._width / 2;
  }

  set y(y: number) {
    this._y = y;
  }

  get x(): number {
    return this._x + this._width / 2;
  }

  get y() {
    return this._y;
  }
}
