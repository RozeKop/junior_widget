const numElementsInRow = { 2: "elements-2", 4: "elements-2", 6: "elements-3" };
dataForWidget();

function getApi(count) {
  if (typeof count !== "number") {
    return;
  }
  return `http://api.taboola.com/1.0/json/taboola-templates/recommendations.get?app.type=desktop&app.apikey=f9040ab1b9c802857aa783c469d0e0ff7e7366e4&count=${count}&source.type=video&source.id=214321562187&source.url=http://www.site.com/videos/214321562187.html`;
}

async function getData(apiURL) {
  try {
    const response = await fetch(apiURL);
    const data = await response.json();
    return data;
  } catch (error) {
    console.log("Error fetching data:", error.message);
    return;
  }
}

async function dataForWidget(count = 6) {
  const data = await getData(getApi(count));

  if (!data || !data.list || data.list.length === 0) {
    return;
  }

  const dataToRender = createDataObj(data.list);
  createWidget(dataToRender, count);
}

function createDataObj(data) {
  const dataToRender = data.map((ad) => ({
    title: ad.name,
    image: ad.thumbnail[0].url,
    url: ad.url,
    branding: ad.branding,
    origin: ad.origin,
  }));

  return dataToRender;
}

function createWidget(data) {
  const container = document.querySelector(".container");
  if (!container || !data || !data.length) {
    return;
  }

  const title = document.createElement("h2");
  title.innerHTML = "You May Like";
  container.appendChild(title);

  const adContainer = document.createElement("div");
  adContainer.className = `ad-container ${numElementsInRow[data.length]}`;
  container.appendChild(adContainer);

  data.forEach((ad) => {
    const adElement = createAd(ad);
    adContainer.appendChild(adElement);
  });
}

function createAd(ad) {
  const adElement = document.createElement("div");
  adElement.className = "ad";
  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", ad.url);
  linkElement.setAttribute("title", ad.title);
  if (ad.origin === "sponsored") {
    linkElement.target = "_blank";
  } else {
    linkElement.target = "_self";
  }

  const imageElement = createImage(ad.image);
  linkElement.appendChild(imageElement);

  const infoElement = document.createElement("div");
  infoElement.className = "info";

  const titleElement = createTitle(ad.title);
  infoElement.appendChild(titleElement);

  const brandingElement = createBranding(ad.branding);
  infoElement.appendChild(brandingElement);

  linkElement.appendChild(infoElement);
  adElement.appendChild(linkElement);
  return adElement;
}

function createImage(image) {
  const imageElement = document.createElement("img");
  imageElement.setAttribute("src", image);
  return imageElement;
}

function createTitle(title) {
  const titleElement = document.createElement("h3");
  titleElement.textContent = title;
  return titleElement;
}

function createBranding(branding) {
  const brandingElement = document.createElement("p");
  brandingElement.textContent = branding;
  return brandingElement;
}

if (typeof module === "object") {
  module.exports = {
    getApi,
    getData,
    dataForWidget,
    createDataObj,
    createWidget,
    createAd,
    createImage,
    createTitle,
    createBranding,
  };
}
