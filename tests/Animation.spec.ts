import { default as Animation, AnimationTilt } from "../src/Animation";

describe("Animation", () => {
  const fakeRequestAnimationFrame = jest.spyOn(window, "requestAnimationFrame");
  const fakeCancelAnimationFrame = jest.spyOn(window, "cancelAnimationFrame");

  describe("loop", () => {
    let animation: Animation, spy: jest.Mock, now: number;
    beforeEach(() => {
      animation = new Animation(1);
      spy = jest.fn();
      animation.event.subscribe(spy);
      now = Date.now();
    });

    describe('when loop is call whith timestamp the emited AnimationTilt', () => {
      beforeEach(()=>{
        animation.loop(now);
      });

      test('cycle correspond to number of seconds', ()=>{
        expect(spy).toBeCalledWith({
          cycle: Math.floor(now / 1000),
          frame: expect.any(Number),
          time: expect.any(Number),
        });
      })

      test('frame correspond to frame number', ()=>{
        expect(spy).toBeCalledWith({
          cycle: expect.any(Number),
          frame: 0,
          time: expect.any(Number)
        });
      })

      test("time correspond to current timstamp", () => {
        const expected: AnimationTilt = {
          cycle: expect.any(Number),
          frame: expect.any(Number),
          time: now,
        };
        expect(spy).toBeCalledWith(expected);
      });
    });

    it("should emit only one tilt per second when fps are set to 1", () => {
      for (let i = 0; i < 999; i++) {
        animation.loop(i);
      }
      expect(spy).toBeCalledTimes(1);
    });

    describe("when animation fps are set to 4", () => {
      let aSpy: jest.Mock;
      beforeAll(() => {
        fakeRequestAnimationFrame.mockClear();
        aSpy = jest.fn();
        const aAnimation = new Animation(4);
        aAnimation.event.subscribe(aSpy);
        for (let i = 0; i < 999; i++) {
          aAnimation.loop(i);
        }
      });

      it("should emit 4 times", () => {
        expect(aSpy).toHaveBeenCalledTimes(4);
      });

      it.each([
        [0, 0],
        [249, 1],
        [499, 2],
        [749, 3],
      ])("should emit at %dms for frame n°%d", (ms, frame) => {
        const expected: AnimationTilt = {
          cycle: 0,
          frame,
          time: ms,
        };
        expect(aSpy).toHaveBeenNthCalledWith(frame + 1, expected);
      });

      it("should call requestAnimationFrame 999 times (after each call)", () => {
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(999);
      });
    });
  });

  describe("start", () => {
    let animation: Animation;
    beforeEach(() => {
      fakeRequestAnimationFrame.mockClear();
      animation = new Animation(1);
    });

    it("should call requestAnimationFrame for init animation", () => {
      animation.start();
      expect(window.requestAnimationFrame).toBeCalledTimes(1);
      expect(window.requestAnimationFrame).toBeCalledWith(expect.any(Function));
    });

    it("should not call requestAnimationFrame if animation are initialised", () => {
      animation.start();
      animation.start();
      expect(window.requestAnimationFrame).toBeCalledTimes(1);
      expect(window.requestAnimationFrame).toBeCalledWith(expect.any(Function));
    });

    it("should call requestAnimationFrame if animation is paused", () => {
      animation.start();
      animation.pause();
      animation.start();
      expect(window.requestAnimationFrame).toBeCalledTimes(2);
      expect(window.requestAnimationFrame).toBeCalledWith(expect.any(Function));
    });
  });

  describe("pause", () => {
    let animation: Animation;
    beforeEach(() => {
      fakeCancelAnimationFrame.mockClear();
      animation = new Animation(1);
    });

    it("should call cancelAnimationFrame for stop animation", () => {
      animation.start();
      animation.pause();
      expect(window.cancelAnimationFrame).toBeCalledTimes(1);
      expect(window.cancelAnimationFrame).toBeCalledWith(expect.any(Number));
    });

    it("should call cancelAnimationFrame with requestAnimationFrame return value", () => {
      const fakeAnimationRequestId = 1234;
      fakeRequestAnimationFrame.mockReturnValue(fakeAnimationRequestId)
      animation.start();
      animation.pause();
      expect(window.cancelAnimationFrame).toBeCalledTimes(1);
      expect(window.cancelAnimationFrame).toBeCalledWith(fakeAnimationRequestId);
    });

    it("should not call cancelAnimationFrame if animation are not initialised", () => {
      animation.pause();
      expect(window.cancelAnimationFrame).toBeCalledTimes(0);
    });

    it("should not call cancelAnimationFrame if animation is paused", () => {
      animation.start();
      animation.pause();
      animation.pause();
      expect(window.cancelAnimationFrame).toBeCalledTimes(1);
      expect(window.cancelAnimationFrame).toBeCalledWith(expect.any(Number));
    });
  });

  describe('set fps', () => {
    let animation: Animation, spy: jest.Mock;
      beforeEach(()=>{
        spy.mockClear();
      })
      beforeAll(() => {
        spy = jest.fn();
        animation = new Animation(1);
        animation.event.subscribe(spy);
      });
      
      it("should emit 1 time because animation fps are set with 1", () => {
        for (let i = 0; i < 999; i++) {
          animation.loop(i);
        }
        expect(spy).toHaveBeenCalledTimes(1);
      });

      it("should emit 60 times when fps are set to 60", () => {
        animation.fps = 60;
        for (let i = 0; i < 999; i++) {
          animation.loop(i);
        }
        expect(spy).toHaveBeenCalledTimes(60);
      });
  });
});
