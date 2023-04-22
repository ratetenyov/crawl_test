const form = document.querySelector("form");
const input = document.querySelector("input");
const container = document.querySelector(".links");

form.addEventListener("submit", (evt) => {
  evt.preventDefault();
  crawlSite(input.value);
});

const crawlSite = (url) => {
  fetch("http://localhost:8080/crawlSite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url }),
  })
    .then((res) => res.json())
    .then((res) => container.append(res));
};
