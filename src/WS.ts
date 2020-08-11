import Player from "./Player";
import { Observable, Subject } from "rxjs";

export default class WS {
  private _ws: WebSocket | null;
  private _websocket: Observable<Event>;
  private _webSocketSub: Subject<Event>;

  private _player: Observable<Player>;
  private _playerSub: Subject<Player>;

  constructor(endpoint: string) {
    if (!("WebSocket" in window)) {
      throw Error("No WebSocket");
    }
    this._ws = null;

    const subPlayer: Subject<Player> = new Subject();
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
  }

  get event() {
    return this._websocket;
  }

  get player() {
    return this._player;
  }

  connect(endpoint: string) {
    this._ws = new WebSocket(endpoint);
    const wsSub = this._webSocketSub;
    this._ws.onmessage = (evt) => {
      try {
        const player: Player = JSON.parse(evt.data);
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
      this._ws.send(JSON.stringify(data));
      this._webSocketSub.next(new Event("sent"));
    } else {
      this._webSocketSub.next(new Event("disconnected"));
    }
  }
}
