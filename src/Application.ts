import Player from "./Player";
import Map2D from "./Map2D";
import WS from "./WS";
import RessourcesLoader, { HttpMethod } from "./RessourcesLoader";
import UserInteraction from "./UserInteraction";
import Animation from "./Animation";

import Ajv from "ajv";
import Banner from "./banner/Banner";
const ajv = new Ajv();

export interface ApplicationConfiguration {
  mapUrl: string;
  pinSpriteUrl: string;
  wsendpoint: string;
  backendendpoint: string;
  canvas: HTMLCanvasElement;
  pseudo: HTMLInputElement;
  nope: HTMLInputElement;
  uiactive: HTMLInputElement;
}

export default class Application {
  private _debug: boolean = false;

  private _me: Player;
  private _house: Map2D | null;
  private _ws: WS;
  private _ui: UserInteraction;

  private _config: ApplicationConfiguration;

  private _apiContracts: any;
  private _token: string;

  constructor(config: ApplicationConfiguration) {
    this._me = {
      id: null,
      pseudo: "",
      x: 0,
      y: 0
    };

    this._config = config;

    this._ws = new WS();
    this._ui = new UserInteraction({
      clickArea: this._config.canvas,
      pseudo: this._config.pseudo
    });

    if (this._debug) {
      this._ws.event.subscribe((e) => console.log(`WebSocket ${e.type}`));
      this._ui.event.subscribe((e) => console.log(`UI ${e.type}`));
    }
  }

  async start() {
    await this.load();

    const house = (this._house = await Map2D.load(this._config.mapUrl));
    this._config.canvas.height = this._house.texture.height;
    this._config.canvas.width = this._house.texture.width;

    const ctx: CanvasRenderingContext2D = this._config.canvas.getContext(
      "2d"
    ) as CanvasRenderingContext2D;

    const animation = new Animation(15);
    animation.event.subscribe(() => house.refresh(ctx));
    animation.start();

    this._ws.contract = this._apiContracts.websocket;
    this._ws.connect(this._config.wsendpoint, this._token);

    this._ui.click.subscribe((position) => {
      const newMe = {
        ...this._me,
        ...position
      };
      if (ajv.validate(this._apiContracts["player"], newMe)) {
        this._me = newMe;
        this._ws.send({
          type: "player",
          payload: this._me
        });
      }
    });

    this._ui.pseudo.subscribe((pseudo) => {
      const newMe = {
        ...this._me,
        pseudo
      };
      if (ajv.validate(this._apiContracts["player"], newMe)) {
        this._me = newMe;
        this._ws.send({
          type: "player",
          payload: this._me
        });
      }
    });

    this._ui.event.subscribe((e) => {
      switch (e.type) {
        case "pseudo":
          this._config.nope.checked = ajv.validate(
            this._apiContracts["player"]["properties"]["pseudo"],
            this._config.pseudo.value
          ) as boolean;
          break;
      }
    });

    this._ws.event.subscribe((e) => {
      switch (e.type) {
        case "close":
          this._config.uiactive.checked = false;
          this._ui.desable();
          break;
        case "open":
          this._config.uiactive.checked = true;
          this._ui.enable();
          break;
      }
    });

    const banner = await Banner.load();

    this._ws.player.subscribe(async (player) => {
      await house.set(player, banner);
    });

    const playerList: Player[] = (await RessourcesLoader.httpRequest({
      method: HttpMethod.GET,
      url: `${this._config.backendendpoint}/players`,
      responseType: "json"
    })) as Player[];

    for (const player of playerList) {
      await house.set(player, banner);
    }
  }

  private async load() {
    try {
      this._apiContracts = await RessourcesLoader.httpRequest({
        method: HttpMethod.GET,
        url: `${this._config.backendendpoint}/contracts`,
        responseType: "json"
      });
    } catch (error) {
      throw new Error("Unable to load api contracts");
    }

    const urlParams = new URLSearchParams(window.location.search);
    const discordAuthCode = urlParams.get("code");
    if (discordAuthCode) {
      window.history.pushState({}, document.title, "/");
      try {
        const auth = await RessourcesLoader.httpRequest({
          method: HttpMethod.POST,
          url: `${this._config.backendendpoint}/auth`,
          responseType: "json",
          params: {
            code: discordAuthCode
          }
        });
        this._me.id = auth.player.id;
        this._me.pseudo = auth.player.pseudo;
        this._config.pseudo.value = auth.player.pseudo;
        this._token = auth.token;
      } catch (error) {
        console.error(error);
        throw new Error("Unable to auth");
      }
    } else {
      throw Error("No autent");
    }
  }
}
