import RessourcesLoader from "./RessourcesLoader";
import Pin from "./Pin";
import IPlayer from "./IPlayer";
export default class Map2D {
  static async load(url: string): Promise<Map2D> {
    try {
      const texture = await RessourcesLoader.loadImage(url);
      return new Map2D(texture);
    } catch (error) {
      console.error(error);
      throw new Error(`Impossible de charger la carte "${url}"`);
    }
  }

  public pins: Map<string, Pin>;
  private _texture: HTMLImageElement;

  constructor(texture: HTMLImageElement) {
    this._texture = texture;
    this.pins = new Map();
  }

  get texture(): HTMLImageElement {
    return this._texture;
  }

  set(player: IPlayer, banner: HTMLElement) {
    const id = player.id as string;
    if (player.x && player.y) {
      if (!this.pins.has(id)) {
        this.pins.set(id, new Pin(banner, player.pseudo, 400, 240));
      }
      const pin: Pin = this.pins.get(id) as Pin;
      pin.text = player.pseudo;
      pin.x = player.x;
      pin.y = player.y;
    }
  }

  refresh(ctx: CanvasRenderingContext2D) {
    ctx.font = "15px Georgia";
    ctx.textAlign = "center";
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, this.texture.width, this.texture.height);
    ctx.drawImage(this.texture, 0, 0);

    this.pins.forEach((pin: Pin) => {
      ctx.drawImage(pin.sprite, pin.x, pin.y, pin.width, pin.height);
    });
  }
}
