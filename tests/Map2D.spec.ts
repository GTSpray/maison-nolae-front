import { mockAscessors } from "./helpers/mock.helper";

import Map2D from "../src/Map2D";
import IPlayer from "../src/IPlayer";
import Pin2D from "../src/Pin2D";
import RessourcesLoader from "../src/RessourcesLoader";

jest.mock("../src/Pin2D", () => ({
  __esModule: true,
  default: mockAscessors(["sprite", "text", "x", "y", "width", "height"]),
}));

jest.mock("../src/RessourcesLoader");

describe("Map2D", () => {
  describe("refresh", () => {
    const imgW = 120,
      imgH = 140;
    const fakeTexture: HTMLImageElement = new Image(imgW, imgH);

    const fakePin = {
      sprite: new Image(120, 140),
      width: -1,
      height: -2,
      x: -3,
      y: -4,
    };

    let map: Map2D, ctx;
    beforeEach(() => {
      map = new Map2D(fakeTexture);

      jest
        .spyOn(Pin2D.prototype, "sprite", "get")
        .mockReturnValue(fakePin.sprite);
      jest
        .spyOn(Pin2D.prototype, "width", "get")
        .mockReturnValue(fakePin.width);

      jest
        .spyOn(Pin2D.prototype, "height", "get")
        .mockReturnValue(fakePin.height);

      jest
        .spyOn(Pin2D.prototype, "height", "get")
        .mockReturnValue(fakePin.height);

      jest.spyOn(Pin2D.prototype, "x", "get").mockReturnValue(fakePin.x);
      jest.spyOn(Pin2D.prototype, "y", "get").mockReturnValue(fakePin.y);

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

    describe("for each player", () => {
      const fakeBanner: HTMLElement = document.createElement("svg");
      const players: [number, IPlayer][] = [
        { x: 600, y: 700 },
        { x: 500, y: 900 },
      ].map((p, i) => [
        i,
        {
          ...p,
          id: `id${i}`,
          pseudo: `pseudo${i}`,
        },
      ]);

      beforeEach(() => {
        (Pin2D as jest.Mock).mockClear;
        ctx.drawImage.mockClear();
        players.forEach((p) => {
          const [, player] = p;
          map.set(player, fakeBanner);
        });
        map.refresh(ctx);
      });

      it("should print players", () => {
        expect(ctx.drawImage).toHaveBeenCalledTimes(players.length + 1);
      });

      it.each(players)(
        "should draw a pin who represent player%d's postion",
        (i) => {
          expect(ctx.drawImage).toHaveBeenNthCalledWith(
            i + 2,
            fakePin.sprite,
            fakePin.x,
            fakePin.y,
            fakePin.width,
            fakePin.height
          );
        }
      );

      describe("should not draw a pin for a player whitout position", () => {
        const invisiblePlayers: [string, IPlayer][] = [
          ["not x", { y: 200 }],
          ["not y", { x: 250 }],
          ["not x and y", {}],
        ].map((usecase, i) => {
          const [reason, position] = usecase;
          const uc: [string, IPlayer] = [
            reason,
            {
              ...position,
              id: `id${players.length + i}`,
              pseudo: `pseudo${players.length + i}`,
            },
          ];
          return uc;
        });

        beforeEach(() => {
          ctx.drawImage.mockClear();
          invisiblePlayers.forEach((usecase) => {
            const [, player] = usecase;
            map.set(player, fakeBanner);
          });
          map.refresh(ctx);
        });

        it("should print other players", () => {
          expect(ctx.drawImage).toHaveBeenCalledTimes(players.length + 1);
        });
      });
    });
  });
  describe("set", () => {
    const fakeBanner: HTMLElement = document.createElement("svg");
    let player: IPlayer;
    let map: Map2D;
    beforeEach(() => {
      jest.clearAllMocks();
      const fakeTexture: HTMLImageElement = new Image();
      map = new Map2D(fakeTexture);
      player = {
        id: "playerid",
        pseudo: "playerpseudo",
        x: 0,
        y: 0,
      };
    });

    describe("should create a Pin correspond player", () => {
      it("should create new Pin with player", () => {
        map.set(player, fakeBanner);
        expect(Pin2D).toHaveBeenCalledWith(fakeBanner, player.pseudo, 400, 240);
      });

      it("should set text with player.pseudo after creation", () => {
        const spy = jest.spyOn(Pin2D.prototype, "text", "set");
        map.set(player, fakeBanner);
        expect(spy).toHaveBeenCalledWith(player.pseudo);
      });
      it("should set x with player.x after creation", () => {
        const spy = jest.spyOn(Pin2D.prototype, "x", "set");
        map.set(player, fakeBanner);
        expect(spy).toHaveBeenCalledWith(player.x);
      });
      it("should set y with player.y after creation", () => {
        const spy = jest.spyOn(Pin2D.prototype, "y", "set");
        map.set(player, fakeBanner);
        expect(spy).toHaveBeenCalledWith(player.y);
      });
    });

    describe("should not recreate a pin for the same player", () => {
      it.each(["pseudo", "x", "y"])(
        'even if the value of "%s" changes',
        (attribute) => {
          map.set(player, fakeBanner);
          player[attribute] = `updated${attribute}`;
          map.set(player, fakeBanner);
          expect(Pin2D).toHaveBeenCalledTimes(1);
        }
      );
      it("unless the id changes", () => {
        map.set(player, fakeBanner);
        player.id = "newId";
        map.set(player, fakeBanner);
        expect(Pin2D).toHaveBeenCalledTimes(2);
      });

      it("should set text with player.pseudo after update", () => {
        const spy = jest.spyOn(Pin2D.prototype, "text", "set");
        map.set(player, fakeBanner);
        expect(spy).toHaveBeenCalledWith(player.pseudo);
      });
      it("should set x with player.x after update", () => {
        const spy = jest.spyOn(Pin2D.prototype, "x", "set");
        map.set(player, fakeBanner);
        expect(spy).toHaveBeenCalledWith(player.x);
      });
      it("should set y with player.y after update", () => {
        const spy = jest.spyOn(Pin2D.prototype, "y", "set");
        map.set(player, fakeBanner);
        expect(spy).toHaveBeenCalledWith(player.y);
      });
    });
  });
  describe("load", () => {
    const fakeUrl = "my-url";
    let fakeLoader: jest.Mock;
    beforeEach(() => {
      fakeLoader = jest.spyOn(RessourcesLoader, "loadImage");
    });

    it("should call RessourceLoader.loadImage for getting texture", async () => {
      const fakeTexture = new Image(1, 1);
      fakeLoader.mockResolvedValue(fakeTexture);
      const map = await Map2D.load(fakeUrl);
      expect(RessourcesLoader.loadImage).toBeCalledWith(fakeUrl);
      // expect(Map2D).toBeCalledWith(fakeTexture);
      expect(map).toBeTruthy();
    });
  });
});
