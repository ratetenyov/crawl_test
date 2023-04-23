const form = document.querySelector("form");
const inputText = document.querySelector("input[type=text]");
const inputNumber = document.querySelector("input[type=number]");
const container = document.querySelector(".links-container");
const spinner = document.querySelector(".spinner");
const waitNotice = document.querySelector(".wait-notice");
const alertNotice = document.querySelector(".alert-notice");
const linksList = document.querySelector("ul");

form.addEventListener("submit", (evt) => {
  evt.preventDefault();

  if (isValidHttpURL(inputText.value)) {
    removeChildNode(container, document.querySelector("ul"));

    crawlSite(inputText.value, Number(inputNumber.value));
    spinner.classList.add("visible");
    waitNotice.classList.add("visible");
    container.classList.add("links-container--flex");
    alertNotice.textContent = "";
    inputText.classList.remove("input--alert");
  } else {
    removeChildNode(container, document.querySelector("ul"));
    inputText.classList.add("input--alert");
    alertNotice.textContent = "URL format is incorrect, please adjust";
  }
});

inputNumber.addEventListener("change", (evt) => {
  if (Number(evt.target.value) > 300) {
    inputNumber.value = 300;
  }
});

const crawlSite = (url, linksAmount) => {
  console.log({ linksAmount });
  fetch("http://localhost:3000/crawlSite", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ url, linksAmount }),
  })
    .then((res) => res.json())
    .then((res) => {
      createLinksList(res, container);
      spinner.classList.remove("visible");
      waitNotice.classList.remove("visible");
      container.classList.remove("links-container--flex");
      inputText.value = "";
      inputNumber.value = "";
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

const removeChildNode = (parentNode, childNode) => {
  if (childNode && parentNode) {
    parentNode.removeChild(childNode);
  }
};
