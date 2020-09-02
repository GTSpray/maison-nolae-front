import Animation from "../src/Animation";

describe("Animation", () => {
  beforeEach(() => {
    jest.spyOn(window, "requestAnimationFrame");
  });

  describe("loop", () => {
    it("should emit TiltAnimation", () => {
      const animation = new Animation(1);
      const spy = jest.fn();
      animation.event.subscribe(spy);
      const now = Date.now();
      animation.loop(now);
      expect(spy).toBeCalledWith({
        cycle: Math.floor(now / 1000), // expected nb cycles == nb seconds
        frame: 0,
        time: now,
      });
    });
  });
});
