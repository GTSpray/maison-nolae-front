import Map2D from "../src/Map2D";
import IPlayer from "../src/IPlayer";
import Pin2D from "../src/Pin2D";

import { mockAscessors } from "./helpers/mock.helper";

const fakePin = {
  width: 12,
  height: 21,
};

jest.mock("../src/Pin2D", () => {
  return jest.fn().mockImplementation(() => {
    const instance = {
      ...fakePin,
      sprite: "",
      text: null,
      x: null,
      y: null,
    };    
    mockAscessors(instance,[ "x", "y"]);
    Object.defineProperty(
      instance,
      "text",
      (() => {
        return {
          set: jest.fn((text) => (instance.sprite = `spriteOf ${text}`)),
        };
      })()
    );

    return instance;
  });
});

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
        ctx.drawImage.mockClear();
        players.forEach((p) => {
          const [, player] = p;
          map.set(player, fakeBanner);
        });
        map.refresh(ctx);
      });

      it.each(players)(
        "should draw a pin who represent player%d's postion",
        (i, player: IPlayer) => {
          expect(ctx.drawImage).toHaveBeenCalledTimes(players.length + 1);
          expect(ctx.drawImage).toHaveBeenNthCalledWith(
            i + 2,
            `spriteOf ${player.pseudo}`,
            player.x,
            player.y,
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

        it.each(invisiblePlayers)(
          "when player has %s",
          (_reason, player: IPlayer) => {
            expect(ctx.drawImage).not.toHaveBeenCalledWith(
              `spriteOf ${player.pseudo}`,
              player.x,
              player.y,
              fakePin.width,
              fakePin.height
            );
          }
        );
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
      map.set(player, fakeBanner);
    });

    describe("should create a Pin correspond player", () => {
      it("should create new Pin with player", () => {
        expect(Pin2D).toHaveBeenCalledWith(fakeBanner, player.pseudo, 400, 240);
      });

      it.todo("should set text with player.pseudo after creation")
      it.todo("should set x with player.x after creation")
      it.todo("should set y with player.y after creation")
    });

    describe("should not recreate a pin for the same player", () => {
      it.each(["pseudo", "x", "y"])(
        'even if the value of "%s" changes',
        (attribute) => {
          player[attribute] = `updated${attribute}`;
          map.set(player, fakeBanner);
          expect(Pin2D).toHaveBeenCalledTimes(1);
        }
      );
      it("unless the id changes", () => {
        player.id = "newId";
        map.set(player, fakeBanner);
        expect(Pin2D).toHaveBeenCalledTimes(2);
      });

      it.todo("should set text with player.pseudo after update")
      it.todo("should set x with player.x after update")
      it.todo("should set y with player.y after update")

    });
  });
});
