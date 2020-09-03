import Map2D from "../src/Map2D";
describe("Map2D", () => {
  describe("refresh", () => {
    const imgW = 120,
      imgH = 140;
    const fakeTexture: HTMLImageElement = new Image(imgW, imgH);

    let map: Map2D, ctx;
    beforeEach(() => {
      map = new Map2D(fakeTexture);
      ctx = {
        fillRect: jest.fn(),
        drawImage: jest.fn(),
      };
      const fakeCtx = (ctx as unknown) as CanvasRenderingContext2D;
      map.refresh(fakeCtx);
    });

    it("should clear context before draw texture", () => {
      expect(ctx.fillRect).toBeCalledWith(0, 0, imgW, imgH);
    });

    it("should draw texture in context", () => {
      expect(ctx.drawImage).toBeCalledWith(fakeTexture, 0, 0);
    });
  });
});
