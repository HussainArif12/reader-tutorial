#!/usr/bin/env node
const sendData = require("./utils/readerUtils");
const argv = require("yargs/yargs")(process.argv.slice(2))
  .option("site", {
    alias: "s",
    describe: "The website to fetch",
  })
  .option("file", {
    alias: "f",
    describe: "Save the HTML to disk",
  })
  .demandOption(["site"], "Please specify the website")
  .help().argv;

(async () => {
  await sendData(argv.site, argv.file);
})();
