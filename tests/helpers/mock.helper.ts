export function mockAscessors(params: string[]): jest.Mock {
  const instance = jest.fn();
  instance.prototype = {};
  for (const param of params) {
    Object.defineProperty(
      instance.prototype,
      param,
      (() => {
        let _param;
        return {
          get: ()=> _param,
          set: (value)=> { _param = value},
          configurable: true
        };
      })()
    );
  }
  return instance;
}
