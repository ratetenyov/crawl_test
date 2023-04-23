const form = document.querySelector("form");
const input = document.querySelector("input");
const container = document.querySelector(".links-container");
const spinner = document.querySelector(".spinner");
const waitNotice = document.querySelector(".wait-notice");
const alertNotice = document.querySelector(".alert-notice");
const linksList = document.querySelector("ul");

form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  if (isValidHttpURL(input.value)) {
    const linksList = document.querySelector("ul");
    if (linksList) container.removeChild(linksList);

    crawlSite(input.value);
    spinner.classList.add("visible");
    waitNotice.classList.add("visible");
    container.classList.add("links-container--flex");
    alertNotice.textContent = "";
    input.classList.remove("input--alert");
  } else {
    input.classList.add("input--alert");
    alertNotice.textContent = "URL format is incorrect, please adjust";
  }
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
    .then((res) => {
      createLinksList(res, container);
      spinner.classList.remove("visible");
      waitNotice.classList.remove("visible");
      container.classList.remove("links-container--flex");
      input.value = "";
    });
};

const createLinksList = (links, nodeAppendTo) => {
  const listNode = document.createElement("ul");

  links.forEach((link) => {
    const listItemNode = document.createElement("li");
    const linkNode = document.createElement("a");
    linkNode.href = link;
    linkNode.target = "_blank";
    linkNode.textContent = link;

    listItemNode.append(linkNode);
    listNode.append(listItemNode);
  });

  nodeAppendTo.append(listNode);
};

const isValidHttpURL = (inputURL) => {
  let url;
  try {
    url = new URL(inputURL);
  } catch (_) {
    return false;
  }
  return url.protocol === "http:" || url.protocol === "https:";
};
