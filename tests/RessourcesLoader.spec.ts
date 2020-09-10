import RessourcesLoader from "../src/RessourcesLoader";

describe("RessourcesLoader", () => {
  describe("httpRequest", () => {
    const opts = {
      method: "GET"
    };

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
        send: jest.fn()
      };
      jest
        .spyOn(RessourcesLoader, "getXMLHttpRequest")
        .mockReturnValue(fakeXHR);
    });
    it("should call RessourcesLoader.getXMLHttpRequest for getting xhr", async () => {
      fakeXHR.addEventListener.mockImplementationOnce((evnt, callback) => {
        if (evnt === "load") {
          callback();
        }
      });
      fakeXHR.status = 200;
      await RessourcesLoader.httpRequest(opts);
      expect(RessourcesLoader.getXMLHttpRequest).toHaveBeenCalled();
    });

    describe("should resolve xhr.response for succefull request", () => {
      const statusCases = Array.from({ length: 100 }, (v, i) => i + 200);
      it.each(statusCases)("when response.status is %s", async (status) => {
        fakeXHR.addEventListener.mockImplementationOnce((evnt, callback) => {
          if (evnt === "load") {
            callback();
          }
        });
        fakeXHR.status = status;

        const response = await RessourcesLoader.httpRequest(opts);

        expect(response).toBe(fakeXHR.response);
      });
    });

    describe.skip("should reject resolve xhr.response for redirect request", () => {
      const statusCases = Array.from({ length: 100 }, (v, i) => i + 300);
      it.each(statusCases)("when response.status is %s", async (status) => {
        fakeXHR.addEventListener.mockImplementationOnce((evnt, callback) => {
          if (evnt === "load") {
            callback();
          }
        });
        fakeXHR.status = status;

        await expect(async () => {
          await RessourcesLoader.httpRequest(opts);
        }).rejects.toThrow({
          opts,
          status: fakeXHR.status,
          statusText: fakeXHR.statusText
        });
      });
    });
  });
});
