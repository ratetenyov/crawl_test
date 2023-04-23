const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", (_, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.post("/crawlSite", async ({ body }, res) => {
  try {
    const links = await crawlSite(body.url, body.linksAmount);
    res.json(links);
  } catch (_) {
    res.end();
  }
});

app.listen(3000, () => {
  console.log("Application listening on port 3000!");
});

async function crawlSite(url) {
  const origin = new URL(url).origin;
  let uniqueURLs = [];
  const visitedURLs = [url];
  const MAX_UNIQUE = 300;

  const traverseDOM = async (urls) => {
    const link = urls.pop();
    const pageHTML = await axios.get(link);
    const $ = cheerio.load(pageHTML.data);

    $("a").each((_, element) => {
      let scrapedURL = $(element).attr("href");

      if (scrapedURL?.startsWith("/")) {
        scrapedURL = origin + scrapedURL;
      }

      if (!uniqueURLs.includes(scrapedURL) && scrapedURL?.includes(origin)) {
        uniqueURLs.push(scrapedURL);
        visitedURLs.push(scrapedURL);
      }
    });
  };

  while (visitedURLs.length) {
    await traverseDOM(visitedURLs);

    if (uniqueURLs.length >= MAX_UNIQUE) {
      uniqueURLs = uniqueURLs.slice(0, MAX_UNIQUE);
      break;
    }
  }

  return uniqueURLs;
}
