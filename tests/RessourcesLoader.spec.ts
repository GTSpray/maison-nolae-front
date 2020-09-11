import RessourcesLoader, {
  RequestOptions,
  HttpMethod,
} from "../src/RessourcesLoader";

function rangeArray(min, max) {
  const size = max - min + 1;
  return Array.from({ length: size }, (v, i) => i + min);
}

describe("RessourcesLoader", () => {
  describe("httpRequest", () => {
    let opts: RequestOptions;
    let fakeXHR;
    beforeEach(() => {
      jest.clearAllMocks();
      jest.resetAllMocks();
      fakeXHR = {
        status: 200,
        response: "fakeResponse",
        statusText: "fakeStatusText",
        addEventListener: jest.fn(),
        open: jest.fn(),
        send: jest.fn(),
        setRequestHeader: jest.fn(),
      };
      opts = {
        method: HttpMethod.GET,
        url: "my-url",
      };
      jest
        .spyOn(RessourcesLoader, "getXMLHttpRequest")
        .mockReturnValue(fakeXHR);
    });

    describe.each(Object.values(HttpMethod))(
      "for %s request",
      (method: HttpMethod) => {
        beforeEach(() => {
          opts.method = method;
          fakeXHR.addEventListener.mockImplementationOnce((evnt, callback) => {
            if (evnt === "load") {
              fakeXHR.status = 200;
              fakeXHR.send.mockImplementationOnce(callback);
            }
          });
        });

        it("should call RessourcesLoader.getXMLHttpRequest for getting xhr", async () => {
          await RessourcesLoader.httpRequest(opts);
          expect(RessourcesLoader.getXMLHttpRequest).toHaveBeenCalled();
        });

        it("should listen load event", async () => {
          await RessourcesLoader.httpRequest(opts);
          expect(fakeXHR.addEventListener).toHaveBeenCalledWith(
            "load",
            expect.any(Function)
          );
        });

        it("should listen error event", async () => {
          await RessourcesLoader.httpRequest(opts);
          expect(fakeXHR.addEventListener).toHaveBeenCalledWith(
            "error",
            expect.any(Function)
          );
        });

        it("should set headers with headers in options", async () => {
          opts.headers = {
            header1: "value1",
            header2: "value2",
          };

          await RessourcesLoader.httpRequest(opts);

          expect(fakeXHR.setRequestHeader).toHaveBeenCalledWith(
            "header1",
            "value1"
          );
          expect(fakeXHR.setRequestHeader).toHaveBeenCalledWith(
            "header2",
            "value2"
          );
        });

        it("should open request", async () => {
          await RessourcesLoader.httpRequest(opts);
          expect(fakeXHR.open).toHaveBeenCalledTimes(1);
          expect(fakeXHR.open).toHaveBeenCalledWith(opts.method, opts.url);
        });

        it("should send request", async () => {
          await RessourcesLoader.httpRequest(opts);
          expect(fakeXHR.send).toHaveBeenCalledTimes(1);
        });

        it.each(["responseType", "timeout"])(
          "should set %s specified in options",
          async (param) => {
            const spyGet = jest.fn();
            Object.defineProperty(fakeXHR, param, {
              set: spyGet,
              configurable: true,
            });

            opts[param] = `value of ${param}`;

            await RessourcesLoader.httpRequest(opts);

            expect(spyGet).toHaveBeenCalledTimes(1);
            expect(spyGet).toHaveBeenCalledWith(opts[param]);
          }
        );
      }
    );

    it.each(Object.values(HttpMethod).filter((e) => e !== HttpMethod.GET))(
      "should add content-type header in %d request",
      async (method) => {
        opts.method = method;
        fakeXHR.addEventListener.mockImplementationOnce((evnt, callback) => {
          if (evnt === "load") {
            fakeXHR.status = 200;
            fakeXHR.send.mockImplementationOnce(callback);
          }
        });

        await RessourcesLoader.httpRequest(opts);

        expect(fakeXHR.setRequestHeader).toHaveBeenCalledWith(
          "Content-Type",
          "application/json;charset=UTF-8"
        );
      }
    );

    it.each(Object.values(HttpMethod).filter((e) => e !== HttpMethod.GET))(
      "should call send with stringified params in %d request",
      async (method) => {
        opts.method = method;
        fakeXHR.addEventListener.mockImplementationOnce((evnt, callback) => {
          if (evnt === "load") {
            fakeXHR.status = 200;
            fakeXHR.send.mockImplementationOnce(callback);
          }
        });

        opts.params = {
          param1: "value1",
          param2: "value2",
        };

        await RessourcesLoader.httpRequest(opts);

        expect(fakeXHR.send).toHaveBeenCalledTimes(1);
        expect(fakeXHR.send).toHaveBeenCalledWith(JSON.stringify(opts.params));
      }
    );

    it("should call open with stringified params in GET request", async () => {
      opts.method = HttpMethod.GET;
      fakeXHR.addEventListener.mockImplementationOnce((evnt, callback) => {
        if (evnt === "load") {
          fakeXHR.status = 200;
          fakeXHR.send.mockImplementationOnce(callback);
        }
      });

      opts.params = {
        param1: "value1",
        param2: "value2",
      };

      await RessourcesLoader.httpRequest(opts);

      expect(fakeXHR.send).toHaveBeenCalledWith();
      expect(fakeXHR.open).toHaveBeenCalledWith(
        opts.method,
        `${opts.url}?param1=value1&param2=value2`
      );
    });

    describe("should resolve xhr.response for succefull request", () => {
      const statusCases = [...rangeArray(200, 208), 210, 226];
      it.each(statusCases)("when response.status is %s", async (status) => {
        fakeXHR.addEventListener.mockImplementationOnce((evnt, callback) => {
          if (evnt === "load") {
            fakeXHR.status = status;
            fakeXHR.send.mockImplementationOnce(callback);
          }
        });

        const response = await RessourcesLoader.httpRequest(opts);

        expect(response).toBe(fakeXHR.response);
      });
    });

    describe("should reject xhr.response", () => {
      describe("on load event xhr", () => {
        describe("for redirect request", () => {
          const statusCases = [...rangeArray(300, 308), 310];
          it.each(statusCases)("when response.status is %s", async (status) => {
            fakeXHR.addEventListener.mockImplementationOnce(
              (evnt, callback) => {
                if (evnt === "load") {
                  fakeXHR.status = status;
                  fakeXHR.send.mockImplementationOnce(callback);
                }
              }
            );
            expect.assertions(1);
            await expect(
              RessourcesLoader.httpRequest(opts)
            ).rejects.toStrictEqual({
              opts,
              status: fakeXHR.status,
              statusText: fakeXHR.statusText,
            });
          });
        });

        describe("for client side error request", () => {
          const statusCases = [
            ...rangeArray(400, 418),
            ...rangeArray(421, 426),
            428,
            429,
            431,
            ...rangeArray(449, 451),
            456,

            // NGNIX extend
            444,
            ...rangeArray(495, 499),
          ];
          it.each(statusCases)("when response.status is %s", async (status) => {
            fakeXHR.addEventListener.mockImplementationOnce(
              (evnt, callback) => {
                if (evnt === "load") {
                  fakeXHR.status = status;
                  fakeXHR.send.mockImplementationOnce(callback);
                }
              }
            );
            expect.assertions(1);
            await expect(
              RessourcesLoader.httpRequest(opts)
            ).rejects.toStrictEqual({
              opts,
              status: fakeXHR.status,
              statusText: fakeXHR.statusText,
            });
          });
        });

        describe("for server side error request", () => {
          const statusCases = [
            ...rangeArray(500, 511),
            ...rangeArray(520, 527), // Cloudflare extends
          ];
          it.each(statusCases)("when response.status is %s", async (status) => {
            fakeXHR.addEventListener.mockImplementationOnce(
              (evnt, callback) => {
                if (evnt === "load") {
                  fakeXHR.status = status;
                  fakeXHR.send.mockImplementationOnce(callback);
                }
              }
            );
            expect.assertions(1);
            await expect(
              RessourcesLoader.httpRequest(opts)
            ).rejects.toStrictEqual({
              opts,
              status: fakeXHR.status,
              statusText: fakeXHR.statusText,
            });
          });
        });

        describe("for information request", () => {
          const statusCases = rangeArray(100, 103);
          it.each(statusCases)("when response.status is %s", async (status) => {
            fakeXHR.addEventListener.mockImplementationOnce(
              (evnt, callback) => {
                if (evnt === "load") {
                  fakeXHR.status = status;
                  fakeXHR.send.mockImplementationOnce(callback);
                }
              }
            );
            expect.assertions(1);
            await expect(
              RessourcesLoader.httpRequest(opts)
            ).rejects.toStrictEqual({
              opts,
              status: fakeXHR.status,
              statusText: fakeXHR.statusText,
            });
          });
        });
      });

      it("on error event xhr", async () => {
        fakeXHR.addEventListener.mockImplementation((evnt, callback) => {
          if (evnt === "error") {
            fakeXHR.send.mockImplementationOnce(callback);
          }
        });
        expect.assertions(1);

        await expect(RessourcesLoader.httpRequest(opts)).rejects.toStrictEqual({
          opts,
          status: fakeXHR.status,
          statusText: fakeXHR.statusText,
        });
      });
    });
  });
  
  describe('getXMLHttpRequest', () => {
        it.todo('should return XMLHttpRequest if possible')
        it.todo('should return ActiveXObject if no XMLHttpRequest')
        it.todo('should try to ActiveXObject("Msxml2.XMLHTTP")')
        it.todo('should try to ActiveXObject("Microsoft.XMLHTTP")')
        it.todo('should return null if no XHR possible')
  });

  describe('loadImage', () => {
    it.todo('should resolve an image')
    it.todo('should set image.src with url')
    it.todo('should reject src when image is not complete')
  });
});
