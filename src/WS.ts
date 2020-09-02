import IPlayer from "./Player";
import { Observable, Subject } from "rxjs";

import Ajv from "ajv";
const ajv = new Ajv();

export default class WS {
  private _ws: WebSocket | null;
  private _websocket: Observable<Event>;
  private _webSocketSub: Subject<Event>;

  private _player: Observable<IPlayer>;
  private _playerSub: Subject<IPlayer>;

  private _contract: any;
  private _token: string;

  private _endpoint: string;
  private _tries: number;

  constructor() {
    if (!("WebSocket" in window)) {
      throw Error("No WebSocket");
    }
    this._ws = null;
    this._tries = 0;

    this._token = "";
    this._endpoint= "";
    const subPlayer: Subject<IPlayer> = new Subject();
    this._player = new Observable((sub) => {
      subPlayer.subscribe((player) => {
        sub.next(player);
      });
    });
    this._playerSub = subPlayer;

    const subWs: Subject<Event> = new Subject();
    this._websocket = new Observable((sub) => {
      subWs.subscribe((event) => {
        sub.next(event);
      });
    });
    this._webSocketSub = subWs;

    this._websocket.subscribe((evnt) => {
      switch (evnt.type) {
        case "open":
          this._tries = 0;
          this.send({
            type: "authentication",
            payload: {
              token: this._token,
            },
          });
          break;
        case "close":
          if (this._tries < 3) {
            this.connect(this._endpoint, this._token);
            this._tries++;
          }
          break;
      }
    });
  }

  get event() {
    return this._websocket;
  }

  get player() {
    return this._player;
  }

  set contract(contract: any) {
    this._contract = contract;
  }
  connect(endpoint: string, token: string) {
    if (this._endpoint === endpoint) {
      this._tries++;
    } else {
      this._endpoint = endpoint;
    }

    this._token = token;
    this._ws = new WebSocket(endpoint);
    const wsSub = this._webSocketSub;
    this._ws.onmessage = (evt) => {
      try {
        const player: IPlayer = JSON.parse(evt.data);
        this._playerSub.next(player);
      } catch (error) {}
      wsSub.next(evt);
    };
    this._ws.onerror = this._ws.onopen = this._ws.onclose = (evt: Event) => {
      wsSub.next(evt);
    };
  }

  disconnect() {
    if (this._ws) {
      this._ws.close();
      this._ws = null;
    }
    this._webSocketSub.next(new Event("disconnected"));
  }

  send(data: Object) {
    if (this._ws) {
      try {
        if (ajv.validate(this._contract, data)) {
          const event = JSON.stringify(data);
          this._ws.send(event);
          this._webSocketSub.next(new Event("sent"));
        } else {
          console.error("Ajv invalid websocket event");
        }
      } catch (error) {
        console.error("fail to stringify websocket event");
      }
    } else {
      this._webSocketSub.next(new Event("disconnected"));
    }
  }
}
