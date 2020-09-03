// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require("path");
// eslint-disable-next-line @typescript-eslint/no-var-requires
const TsJestTransformer = require("ts-jest-transformer");

class FileTransformer extends TsJestTransformer {
  process(src, filename, config, options) {
    // Important: write TS here
    const source =
      "export default " + JSON.stringify(path.basename(filename)) + ";";
    return super.process(source, filename, config, options);
  }
}

module.exports = new FileTransformer();
