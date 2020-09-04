// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export function mockAscessors(obj, params: string[]): void {
  for (const param in params) {
    Object.defineProperty(
      obj,
      param,
      (() => {
        let _param;
        return {
          get: jest.fn(() => _param),
          set: jest.fn((newValue) => (_param = newValue)),
        };
      })()
    );
  }
}
