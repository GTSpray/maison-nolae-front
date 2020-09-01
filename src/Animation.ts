import { Subject } from "rxjs";

export interface AnimationTilt {
  time: number;
  frame: number;
  cycle: number;
}

export default class Animation {
  private _fps: number;
  private _tref: number;
  private _isPlaying: boolean;
  private _time: number | null;
  private _frame: number;
  private _delay: number;

  public event: Subject<AnimationTilt>;

  constructor(fps: number) {
    this._isPlaying = false;
    this.event = new Subject();
    this._tref = this._time = this._frame = this._delay = -1;

    this.fps = fps;
  }

  loop(time: number) {
    if (this._time === null) {
      this._time = time;
    }
    const seg = Math.floor((time - this._time) / this._delay);
    if (seg > this._frame) {
      this._frame = seg;

      const cycle = Math.floor(this._frame / this._fps);
      const frame = this._frame - cycle * this._fps;

      this.event.next({
        time: time,
        frame,
        cycle
      });
    }

    this._tref = requestAnimationFrame((t) => this.loop(t));
  }

  set fps(fps: number) {
    this._fps = fps;
    this._delay = 1000 / this._fps;
    this._frame = this._time = -1;
  }

  start() {
    if (!this._isPlaying) {
      this._isPlaying = true;
      this._tref = requestAnimationFrame((t) => this.loop(t));
    }
  }

  pause() {
    if (this._isPlaying) {
      cancelAnimationFrame(this._tref);
      this._isPlaying = false;
      this._time = this._frame = -1;
    }
  }
}
