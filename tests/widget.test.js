const fetchMock = require("jest-fetch-mock");
fetchMock.enableMocks();

const {
  getApi,
  getData,
  createDataObj,
  createWidget,
  createAd,
  createImage,
  createTitle,
  createBranding,
} = require("../widget");


describe("getApi", () => {
  test("Returns api as a string", function () {
    expect(typeof getApi(4)).toBe("string");
  });

  test("Returns undefined if not getting a param", function () {
    expect(typeof getApi()).toBe("undefined");
  });

  test("Returns undefined if not getting a number", function () {
    expect(typeof getApi("str")).toBe("undefined");
  });

  test("Returns api as a string", function () {
    expect(typeof getApi(6)).toBe("string");
  });

  test("count should be 6", function () {
    const apiURL6 = `http://api.taboola.com/1.0/json/taboola-templates/recommendations.get?app.type=desktop&app.apikey=f9040ab1b9c802857aa783c469d0e0ff7e7366e4&count=6&source.type=video&source.id=214321562187&source.url=http://www.site.com/videos/214321562187.html`;
    expect(getApi(6)).toBe(apiURL6);
  });

  test("count should be 4", function () {
    const apiURL6 = `http://api.taboola.com/1.0/json/taboola-templates/recommendations.get?app.type=desktop&app.apikey=f9040ab1b9c802857aa783c469d0e0ff7e7366e4&count=4&source.type=video&source.id=214321562187&source.url=http://www.site.com/videos/214321562187.html`;
    expect(getApi(4)).toBe(apiURL6);
  });

  test("count should be 0", function () {
    const apiURL6 = `http://api.taboola.com/1.0/json/taboola-templates/recommendations.get?app.type=desktop&app.apikey=f9040ab1b9c802857aa783c469d0e0ff7e7366e4&count=0&source.type=video&source.id=214321562187&source.url=http://www.site.com/videos/214321562187.html`;
    expect(getApi(0)).toBe(apiURL6);
  });
});

describe("getData", function () {
  const apiURL2 = `http://api.taboola.com/1.0/json/taboola-templates/recommendations.get?app.type=desktop&app.apikey=f9040ab1b9c802857aa783c469d0e0ff7e7366e4&count=2&source.type=video&source.id=214321562187&source.url=http://www.site.com/videos/214321562187.html`;
  const apiURL0 = `http://api.taboola.com/1.0/json/taboola-templates/recommendations.get?app.type=desktop&app.apikey=f9040ab1b9c802857aa783c469d0e0ff7e7366e4&count=0&source.type=video&source.id=214321562187&source.url=http://www.site.com/videos/214321562187.html`;

  beforeEach(() => {
    fetchMock.resetMocks();
  });

  test("should recive an object with len 2", async () => {
    fetchMock.mockResponse(
      JSON.stringify({
		"id": 1,
		"list": [
			{
				"type": "video",
				"name": "Jeep",
				"created": "Wed",
				"branding": "da Jeep",
				"duration": "0",
				"views": "0",
				"thumbnail": [
					{
						"url": "https.jpg"
					}
				],
				"categories": [
					"it"
				],
				"id": "1",
				"origin": "sponsored",
				"url": "https:8lrUx"
			},
			{
				"type": "video",
				"name": "Jeep",
				"created": "Wed",
				"branding": "da Jeep",
				"duration": "0",
				"views": "0",
				"thumbnail": [
					{
						"url": "https.jpg"
					}
				],
				"categories": [
					"it"
				],
				"id": "1",
				"origin": "sponsored",
				"url": "https:8lrUx"
			}
		]
	}, {"status": 200, 
	"headers": { 'Content-Type': 'application/json' } })
    );
    const data = await getData(apiURL2);
    expect(typeof data).toBe("object");
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("list");
    expect(data).not.toHaveProperty("otherKey");
    expect(data.list).toHaveLength(2);
    expect(fetchMock).toHaveBeenCalledWith(apiURL2);
  });

  test("should recive an object with len 0", async () => {
    fetchMock.mockResponse(JSON.stringify({ "id": 1, "list": [] }));
    const data = await getData(apiURL0);
    expect(typeof data).toBe("object");
    expect(data).toHaveProperty("id");
    expect(data).toHaveProperty("list");
    expect(data).not.toHaveProperty("otherKey");
    expect(data.list).toHaveLength(0);
    expect(fetchMock).toHaveBeenCalledWith(apiURL0);
  });

  test("empty api", async function () {
    const spy = jest.spyOn(console, "log");
    await getData("");
    expect(spy).toHaveBeenCalledTimes(1);
    spy.mockRestore();
  });
});

describe("createDataObj", () => {
  data = [
    {
      type: "video",
      name: "Jeep",
      created: "Wed",
      branding: "da Jeep",
      duration: "0",
      views: "0",
      thumbnail: [{ url: "https.jpg" }],
      categories: ["it"],
      id: "1",
      origin: "sponsored",
      url: "https:8lrUx",
    },
    {
      type: "video",
      name: "Jeep",
      created: "Wed",
      branding: "da Jeep",
      duration: "0",
      views: "0",
      thumbnail: [{ url: "https.jpg" }],
      categories: ["it"],
      id: "1",
      origin: "sponsored",
      url: "https:8lrUx",
    },
  ];

  const dataToRender = createDataObj(data);
  test("should return 2 object with 5 keys each", () => {
    expect(dataToRender.length).toBe(2);

    expect(typeof dataToRender[0]).toBe("object");
    expect(Object.keys(dataToRender[0]).length).toBe(5);
    expect(dataToRender[0]).toHaveProperty("title");
    expect(dataToRender[0]).toHaveProperty("image");
    expect(dataToRender[0]).toHaveProperty("url");
    expect(dataToRender[0]).toHaveProperty("branding");
    expect(dataToRender[0]).toHaveProperty("origin");
    expect(dataToRender[0]).not.toHaveProperty("created");

    expect(Object.keys(dataToRender[1]).length).toBe(5);
    expect(dataToRender[1]).toHaveProperty("title");
    expect(dataToRender[1]).toHaveProperty("image");
    expect(dataToRender[1]).toHaveProperty("url");
    expect(dataToRender[1]).toHaveProperty("branding");
    expect(dataToRender[1]).toHaveProperty("origin");
    expect(dataToRender[1]).not.toHaveProperty("created");
  });
});

describe("createWidget function", () => {
  beforeEach(() => {
    document.body.innerHTML = '<div class="container"></div>';
  });

  test("should create and append elements to the container", () => {
    const sampleData = [
      {
        title:
          "7 ciudades europeas que enamorarán a tu pareja en San Valentín (FOTOS)",
        image:
          "http://images.taboola.com/taboola/image/fetch/f_jpg%2Cq_auto%2Cc_fill%2Cg_faces:auto%2Ce_sharpen/http%3A%2F%2Fi.huffpost.com%2Fgen%2F1609694%2Fthumbs%2Fs-SEVILLA-large.jpg",
        url: "http://api.taboola.com/1.0/json/taboola-templates/recommendations.notify-click?app.type=desktop&app.apikey=f9040ab1b9c802857aa783c469d0e0ff7e7366e4&response.id=__7785355c078cae8155180d44502cc8a5__733bd40b94df29269f7ec61750e7ea6a&response.session=v2_01a9f997f75615f01266074c90b044d3_64aa43c4-9052-4ce3-8fc8-00c5e9a8ea15-tuctc2d7aca_1697903946_1697903946_CNawjgYQswsYxtbYl7UxIAEoATAmOInoB0Cy8QdI7NnYA1D___________8BWABgAGjWkOqRw7GC-sMBcAE&item.id=%7E%7EV1%7E%7E6808366351814514581%7E%7E29WbEmBqULidQjQhJ5tF5kE3sGlgLZ3kfkQ8lghCsMTaxJUMYN6PI0G8UwQ4xoq4BNTe-Zc-jkR3zbXih2M1To5ikTz-Mob5uCOXpcUllNMwnjg_Q9VklbHUcjy1llynGXLwsS3fkWtpBPA0sLI4oo6zhr_uog6GC70OqLAd6RE&item.type=video&sig=1f66c47af1b1edd63e03d79399f908697e14b7452dd6&redir=http%3A%2F%2Fwww.huffingtonpost.es%2F2014%2F02%2F08%2Fciudades-san-valentin_n_4747198.html%3Futm_hp_ref%3Dviajes%26utm_source%3Dtaboola%26utm_medium%3Dreferral%26tblci%3DGiAx5cIv3KfFQxEujn-fRFruYALbbM1bhnbijBtgOZsDuSC5BCiDsKvm_O2Gyzc%23tblciGiAx5cIv3KfFQxEujn-fRFruYALbbM1bhnbijBtgOZsDuSC5BCiDsKvm_O2Gyzc&ui=64aa43c4-9052-4ce3-8fc8-00c5e9a8ea15-tuctc2d7aca&cpb=GIkFIJz__________wEqGWNoLnRhYm9vbGFzeW5kaWNhdGlvbi5jb20yCHRyYzgwNDE3OICo9vIIQInoB0iy8QdQ7NnYA1j___________8BYwjQNxCfTxgwZGMIv0gQ5V8YMmRjCN7__________wEQ3v__________ARgiZGMI3f__________ARDd__________8BGCNkYwjs__________8BEOz__________wEYFGRjCNIDEOAGGAhkYwiWFBCgHBgYZGMI9BQQnh0YH2RjCKQnEIM1GC9keAGAAeIjiAHf1trnAZABGJgBxtbYl7Ux",
        branding: "Huffingtonpost",
        origin: "sponsored",
      },
      {
        title: "겨드랑이 땀 냄새가 대인관계에 미치는 영향",
        image:
          "http://images.taboola.com/taboola/image/fetch/f_jpg%2Cq_auto%2Cc_fill%2Cg_faces:auto%2Ce_sharpen/http%3A%2F%2Fcdn.taboolasyndication.com%2Flibtrc%2Fstatic%2Fthumbnails%2F3e6d895130e9cb549ec1e6bb3b60dbd2.jpg",
        url: "http://api.taboola.com/1.0/json/taboola-templates/recommendations.notify-click?app.type=desktop&app.apikey=f9040ab1b9c802857aa783c469d0e0ff7e7366e4&response.id=__7785355c078cae8155180d44502cc8a5__733bd40b94df29269f7ec61750e7ea6a&response.session=v2_01a9f997f75615f01266074c90b044d3_64aa43c4-9052-4ce3-8fc8-00c5e9a8ea15-tuctc2d7aca_1697903946_1697903946_CNawjgYQswsYxtbYl7UxIAEoATAmOInoB0Cy8QdI7NnYA1D___________8BWABgAGjWkOqRw7GC-sMBcAE&item.id=%7E%7EV1%7E%7E-7865348845551501842%7E%7E_1gN6sgenhLRg3SBEC5YlXgEqsl8ynEPWU6g_gQg9GWKANNcaafC-0QP27WPePejFjdyaAfJpxf93xCM8jBXM3NvVRSOQU3KG74h40zV1xGpV3Z1Ztcx-QMqUo3jY_8lLx0gTtVNOVC-HpbsOw_bsVAiIXIoAyi6n12oQC2Cgup97eOaAdlcLTgaAQKb66iN&item.type=video&sig=cfd8dee649d9dfc88e44bfa0c74bbbecc8e514684fb8&redir=http%3A%2F%2Fm.blog.naver.com%2Fdrhomes%2F220743926289%3Fctnakey%3D02-1526-141-304951%26utm_source%3DTaboola%26utm_source%3Dtaboola%26utm_medium%3Dreferral%26tblci%3DGiAx5cIv3KfFQxEujn-fRFruYALbbM1bhnbijBtgOZsDuSC5BCjtmIbhtZHg6gM%23tblciGiAx5cIv3KfFQxEujn-fRFruYALbbM1bhnbijBtgOZsDuSC5BCjtmIbhtZHg6gM&ui=64aa43c4-9052-4ce3-8fc8-00c5e9a8ea15-tuctc2d7aca&cpb=GIkFIJz__________wEqGWNoLnRhYm9vbGFzeW5kaWNhdGlvbi5jb20yCHRyYzgwNDE3OICo9vIIQInoB0iy8QdQ7NnYA1j___________8BYwjQNxCfTxgwZGMIv0gQ5V8YMmRjCN7__________wEQ3v__________ARgiZGMI3f__________ARDd__________8BGCNkYwjs__________8BEOz__________wEYFGRjCNIDEOAGGAhkYwiWFBCgHBgYZGMI9BQQnh0YH2RjCKQnEIM1GC9keAGAAeIjiAHf1trnAZABGJgBxtbYl7Ux",
        branding: "연세클리닉",
        origin: "sponsored",
      },
    ];
    createWidget(sampleData);

    const titleElement = document.querySelector("h2");
    const adContainerElement = document.querySelector(".ad-container");

    expect(titleElement).not.toBeNull();
    expect(adContainerElement).not.toBeNull();

    const adElements = document.querySelectorAll(".ad");
    expect(adElements.length).toBe(2);
  });

  test("should create and append elements to the container", () => {
    const sampleData = [];
    createWidget(sampleData);

    const titleElement = document.querySelector("h2");
    const adContainerElement = document.querySelector(".ad-container");

    expect(titleElement).toBeNull();
    expect(adContainerElement).toBeNull();

    const adElements = document.querySelectorAll(".ad");
    expect(adElements.length).toBe(0);
  });
});

describe("createAd function", () => {
  test("should create an ad element", () => {
    const ad = {
      title:
        "7 ciudades europeas que enamorarán a tu pareja en San Valentín (FOTOS)",
      image:
        "http://images.taboola.com/taboola/image/fetch/f_jpg%2Cq_auto%2Cc_fill%2Cg_faces:auto%2Ce_sharpen/http%3A%2F%2Fi.huffpost.com%2Fgen%2F1609694%2Fthumbs%2Fs-SEVILLA-large.jpg",
      url: "http://api.taboola.com/1.0/json/taboola-templates/recommendations.notify-click?app.type=desktop&app.apikey=f9040ab1b9c802857aa783c469d0e0ff7e7366e4&response.id=__7785355c078cae8155180d44502cc8a5__733bd40b94df29269f7ec61750e7ea6a&response.session=v2_01a9f997f75615f01266074c90b044d3_64aa43c4-9052-4ce3-8fc8-00c5e9a8ea15-tuctc2d7aca_1697903946_1697903946_CNawjgYQswsYxtbYl7UxIAEoATAmOInoB0Cy8QdI7NnYA1D___________8BWABgAGjWkOqRw7GC-sMBcAE&item.id=%7E%7EV1%7E%7E6808366351814514581%7E%7E29WbEmBqULidQjQhJ5tF5kE3sGlgLZ3kfkQ8lghCsMTaxJUMYN6PI0G8UwQ4xoq4BNTe-Zc-jkR3zbXih2M1To5ikTz-Mob5uCOXpcUllNMwnjg_Q9VklbHUcjy1llynGXLwsS3fkWtpBPA0sLI4oo6zhr_uog6GC70OqLAd6RE&item.type=video&sig=1f66c47af1b1edd63e03d79399f908697e14b7452dd6&redir=http%3A%2F%2Fwww.huffingtonpost.es%2F2014%2F02%2F08%2Fciudades-san-valentin_n_4747198.html%3Futm_hp_ref%3Dviajes%26utm_source%3Dtaboola%26utm_medium%3Dreferral%26tblci%3DGiAx5cIv3KfFQxEujn-fRFruYALbbM1bhnbijBtgOZsDuSC5BCiDsKvm_O2Gyzc%23tblciGiAx5cIv3KfFQxEujn-fRFruYALbbM1bhnbijBtgOZsDuSC5BCiDsKvm_O2Gyzc&ui=64aa43c4-9052-4ce3-8fc8-00c5e9a8ea15-tuctc2d7aca&cpb=GIkFIJz__________wEqGWNoLnRhYm9vbGFzeW5kaWNhdGlvbi5jb20yCHRyYzgwNDE3OICo9vIIQInoB0iy8QdQ7NnYA1j___________8BYwjQNxCfTxgwZGMIv0gQ5V8YMmRjCN7__________wEQ3v__________ARgiZGMI3f__________ARDd__________8BGCNkYwjs__________8BEOz__________wEYFGRjCNIDEOAGGAhkYwiWFBCgHBgYZGMI9BQQnh0YH2RjCKQnEIM1GC9keAGAAeIjiAHf1trnAZABGJgBxtbYl7Ux",
      branding: "Huffingtonpost",
      origin: "sponsored",
    };
    const adElement = createAd(ad);

    expect(adElement).toBeDefined();
    expect(adElement.tagName).toBe("DIV");
    expect(adElement.classList.contains("ad")).toBe(true);

    const childNodes = adElement.childNodes;
    expect(childNodes.length).toBe(1);
    expect(childNodes[0].tagName).toBe("A");
  });
});

describe("createImage function", () => {
  test("should create an image element", () => {
    const image = "image.jpg";
    const imageElement = createImage(image);

    expect(imageElement).toBeDefined();
    expect(imageElement.tagName).toBe("IMG");
    expect(imageElement.getAttribute("src")).toBe(image);
  });
});

describe("createTitle function", () => {
  test("should create a title element", () => {
    const title = "Title";
    const titleElement = createTitle(title);

    expect(titleElement).toBeDefined();
    expect(titleElement.tagName).toBe("H3");
    expect(titleElement.textContent).toBe(title);
  });
});

describe("createBranding function", () => {
  test("should create a branding element", () => {
    const branding = "Branding";
    const brandingElement = createBranding(branding);

    expect(brandingElement).toBeDefined();
    expect(brandingElement.tagName).toBe("P");
    expect(brandingElement.textContent).toBe(branding);
  });
});