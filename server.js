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

app.post("/crawlSite", async (req, res) => {
  const links = await crawlSite(req.body.url);
  res.json(links);
});

app.listen(8080, () => {
  console.log("Application listening on port 8080!");
});

async function crawlSite(url) {
  const origin = new URL(url).origin;
  const uniqueURLs = [];
  const visitedURLs = [url];

  const traverseDOM = async (urls) => {
    const link = urls.pop();
    const pageHTML = await axios.get(link);
    const $ = cheerio.load(pageHTML.data);

    $("a").each((_, element) => {
      const scrapedURL = $(element).attr("href");
      if (!uniqueURLs.includes(scrapedURL) && scrapedURL?.includes(origin)) {
        uniqueURLs.push(scrapedURL);
        visitedURLs.push(scrapedURL);
      }
    });
  };

  while (visitedURLs.length) await traverseDOM(visitedURLs);

  return uniqueURLs;
}
