const { Readability, isProbablyReaderable } = require("@mozilla/readability");
const got = require("got");
const chalk = require("chalk");
const fs = require("fs/promises");
const { JSDOM } = require("jsdom");
const window = new JSDOM("").window;
const DOMPurify = require("dompurify")(window);

async function parseURL(site) {
  const response = await got(site);
  const doc = new JSDOM(DOMPurify.sanitize(response.body));

  if (isProbablyReaderable(doc.window.document)) {
    let reader = new Readability(doc.window.document);
    let article = reader.parse();

    return {
      html: article.content,
      title: article.title,
      text: article.textContent,
    };
  } else {
    return { error: "The site was not readable" };
  }
}
async function saveToFile(html) {
  await fs.writeFile("./content.html", html, "utf-8");
  console.log("file saved to " + process.cwd() + "/content.html");
}
async function sendData(site, save) {
  const { html, title, text, error } = await parseURL(site);

  if (!error) {
    console.log(chalk.blue.underline(title));
    console.log(text);
    if (save) {
      saveToFile(html);
      console.log(chalk.red("contents saved to file"));
    }
  } else {
    console.log(chalk.red.bold("The site could not be read"));
  }
}

module.exports = sendData;
