import { mockAscessors } from "./helpers/mock.helper";

import Pin2D from "../src/Pin2D";
import Banner from "../src/banner/Banner";

jest.mock("../src/banner/Banner", () => ({
  __esModule: true,
  default: mockAscessors(["label"]),
}));

describe("Pin2D", () => {
  const fakeBanner = document.createElement("svg");

  beforeEach(() => {
    Banner.prototype.compile = jest.fn();
  });

  it("should set empty image at contructor for getting a sprite", () => {
    const pin = new Pin2D(fakeBanner);
    expect(pin).toBeTruthy();
    expect(pin.sprite).toEqual(new Image(0, 0));
  });

  it("should create a banner with svg", () => {
    const pin = new Pin2D(fakeBanner);
    expect(pin).toBeTruthy();
    expect(Banner).toHaveBeenCalledWith(fakeBanner);
  });

  it("should set width and height with svg dimensions", () => {
    const svgSize = {
      width: 10,
      height: 20,
    };
    fakeBanner.getBoundingClientRect = jest.fn().mockReturnValue(svgSize);
    const pin = new Pin2D(fakeBanner);
    expect(pin).toBeTruthy();
    expect(pin.width).toEqual(svgSize.width);
    expect(pin.height).toEqual(svgSize.height);
  });

  it("should set width and height with predefined size", () => {
    const svgSize = {
        width: 10,
        height: 20,
      },
      predefinedSize = {
        width: 100,
        height: 200,
      };
    fakeBanner.getBoundingClientRect = jest.fn().mockReturnValue(svgSize);
    const pin = new Pin2D(
      fakeBanner,
      predefinedSize.width,
      predefinedSize.height
    );
    expect(pin).toBeTruthy();
    expect(pin.width).toEqual(predefinedSize.width);
    expect(pin.height).toEqual(predefinedSize.height);
  });

  it("should position pin according to his width", () => {
    const setting = {
        x: 600,
        y: 1000
    }
    const pin = new Pin2D(fakeBanner, 100, 200);
    pin.x = setting.x;
    pin.y = setting.y;
    expect(pin).toBeTruthy();
    expect(pin.x).toEqual(setting.x - pin.width/2);
    expect(pin.y).toEqual(setting.y - pin.height/2);
  });
});
