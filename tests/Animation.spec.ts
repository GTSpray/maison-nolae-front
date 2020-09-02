import Animation from "../src/Animation";

describe("Animation", () => {

  const fakeRquestAnimationFrame = jest.spyOn(window, "requestAnimationFrame");
  
  describe("loop", () => {
    let animation: Animation, spy: jest.Mock<any, any>, now: number;
    beforeEach(() => {
      animation = new Animation(1);
      spy = jest.fn();
      animation.event.subscribe(spy);
      now = Date.now();
    });

    it("should emit TiltAnimation at first occurence", () => {
      animation.loop(now);
      expect(spy).toBeCalledWith({
        cycle: Math.floor(now / 1000), // expected nb cycles == nb seconds
        frame: 0,
        time: now,
      });
    });

    it("should emit only one tilt per second when fps are set to 1", () => {
      for (let i = 0; i < 999; i++) {
        animation.loop(i);
      }
      expect(spy).toBeCalledTimes(1);
    });

    describe("when animation fps are set to 4", () => {
      let aSpy: jest.Mock<any, any>;
      beforeAll(() => {
        fakeRquestAnimationFrame.mockClear();
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

      it("should requestAnimationFrame 999 times", () => {
        expect(window.requestAnimationFrame).toHaveBeenCalledTimes(999);
      });

      it.each([
        [0, 0],
        [1, 249],
        [2, 499],
        [3, 749],
      ])("for frame n°%d at %d ms", (frame, ms) => {
        expect(aSpy).toHaveBeenNthCalledWith(frame + 1, {
          cycle: 0,
          frame,
          time: ms,
        });
      });
    });
  });
});
