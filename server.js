const axios = require("axios");
const cheerio = require("cheerio");
const express = require("express");
const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "public")));
app.use(express.json());

app.get("/", (req, res) => {
  res.sendFile(`${__dirname}/public/index.html`);
});

app.post("/crawlSite", async (req, res) => {
  const links = await main(req.body.url);
  res.json(links);
});

app.listen(8080, () => {
  console.log("Application listening on port 8080!");
});

async function main(url) {
  const pageHTML = await axios.get(url);
  const $ = cheerio.load(pageHTML.data);
  const allUrls = [];

  $("a").each((index, element) => {
    const paginationURL = $(element).attr("href");
    allUrls.push(paginationURL);
  });

  return allUrls;
}
