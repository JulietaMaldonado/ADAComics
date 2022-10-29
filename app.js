const searchType = document.querySelector("#selectorCoPer");

const apiPublic = "4042da033c40ee19fedd46375607e22d";
const apiPrivate = "8b730cb45245a845720f6fad875bf0fbba96df20";

const baseUrl = `https://gateway.marvel.com/v1/public/`;
let offset = 0;

const getSearchParams = (isSearch) => {
  let url = baseUrl;
  let searchParams = `?apikey=${apiPublic}&offset=${offset}`;
  if (!isSearch) {
    return searchParams;
  }

  return searchParams;
};

const getApiUrl = (resourse, resourseId, subResourse) => {
  const isSearch = !resourseId && !subResourse;
  let url = `${baseUrl}${resourse}`;
  if (resourseId) {
    url += subResourse;
  }
  if (subResourse) {
    url += subResourse;
  }
  url += getSearchParams(isSearch);
  console.log(url);
  return url;
};

const fetchUrl = async (url) => {
  const response = await fetch(url);
  const json = await response.json();
  return json;
};

const fetchComics = async () => {
  const {
    data: { results, total },
  } = await fetchUrl(getApiUrl("comics"));
  printComics(results);
  console.log(results);
};

const printComics = (comics) => {
  if (comics.length == 0) {
    results.innerHtml = `<h4> No hemos encontrado ningun resultado</h4>`;
  }
  for (const comic of comics) {
    const comicCard = document.createElement("div");
    comicCard.tabIndex = 0;
    comicCard.classList.add("comic");
    comicCard.onclick = () => {
      loadDetail(comic);
    };

    comicCard.innerHTML = `<div class="comic-img-container">
    <img src="${comic.thumbnail.path}/portrait_fantastic.${comic.thumbnail.extension}" alt="${comic.title}" class="comic-thumbnail" />
  </div>
  <h6 class="comic-title">${comic.title}</h6>
`;
    results.append(comicCard);
  }
};

const fetchComic = async (comicId) => {
  const {
    data: {
      results: [comic],
    },
  } = await fetchUrl(getApiUrl("comics", comicId));

  const coverPath = `${comic.thumbnail.path}${comic.thumbnail.extension}`;
  const releaseDate = new Intl.DateTimeFormat("es-Ar").format(
    new Date(comic.dates.find((date) => date.type === "onsaleDate").date)
  );
  const writers = comic.creators.items
    .filter((creator) => creator.role === "writer")
    .map((creator) => creator.name)
    .join(", ");
  updateComicDetails(
    coverPath,
    comic.title,
    releaseDate,
    writers,
    comic.description
  );
  showComicDetail();
};

const updateComicDetails = (img, title, releaseDate, writers, description) => {
  comicCover.src = img;
  comicTitle.innerHTML = title;
  comicPublished.innerHTML = releaseDate;
  comicWriters.innerHTML = writers;
  comicDescription.innerHTML = description;
};

const showComicDetail = () => {
  comicSection.classList.remove("hidden");
};

const search = () => {
  if (searchType.value === "comics") {
    fetchComics();
  }
};

const inicio = () => {
  search();
};
window.onload = inicio;

const loadDetail = (comic) => {
  const resultsContainer = document.getElementById("resultsContainer");
  resultsContainer.classList.add("hidden");

  const comicDetail = document.getElementById("comic-detail");

  const card = document.createElement("div");
  const cardImg = document.createElement("img");
  const cardBody = document.createElement("div");
  const col1 = document.createElement("div");
  const col2 = document.createElement("div");
  const column = document.createElement("div");
  const cardTitle = document.createElement("h2");
  const cardLabel1 = document.createElement("p");
  const cardLabel2 = document.createElement("p");
  const cardLabel3 = document.createElement("p");
  const cardDate = document.createElement("p");
  const cardCreator = document.createElement("p");
  const cardDescription = document.createElement("p");

  const title = document.createTextNode(comic.title);
  const label1 = document.createTextNode("Publicado:");
  const label2 = document.createTextNode("Guionistas:");
  const label3 = document.createTextNode("Descripción:");
  const date = document.createTextNode(comic.dates[0].date);
  const creator = document.createTextNode(
    comic.creators.items.length
      ? comic.creators.items[0].name
      : "No hay guionistas"
  );
  const description = document.createTextNode(comic.description);

  cardImg.setAttribute(
    "src",
    `${comic.thumbnail.path}/portrait_fantastic.${comic.thumbnail.extension}`
  );

  comicDetail.classList.add("comic-detail");
  card.classList.add("card");
  cardImg.classList.add("card-img");
  cardBody.classList.add("card-body");
  column.classList.add("column");
  col1.classList.add("col1");
  col2.classList.add("col2");
  cardLabel1.classList.add("label");
  cardLabel2.classList.add("label");
  cardLabel3.classList.add("label");
  cardDate.classList.add("text");
  cardCreator.classList.add("text");
  cardDescription.classList.add("text");

  cardTitle.appendChild(title);

  comicDetail.appendChild(column);
  column.appendChild(card);
  card.appendChild(cardBody);
  cardBody.appendChild(col1);
  cardBody.appendChild(col2);
  col1.appendChild(cardImg);
  col2.appendChild(cardTitle);
  col2.appendChild(cardLabel1);
  cardLabel1.appendChild(label1);
  col2.appendChild(cardDate);
  cardDate.appendChild(date);

  col2.appendChild(cardLabel2);
  cardLabel2.appendChild(label2);
  col2.appendChild(cardCreator);

  cardCreator.appendChild(creator);
  col2.appendChild(cardLabel3);
  cardLabel3.appendChild(label3);
  col2.appendChild(cardDescription);
  cardDescription.appendChild(description);
};

const loadComics = async (page) => {
  const params = new URLSearchParams(window.location.search);

  // const comicsRsponse = await getComics(
  //     params.get('offset') ||  0,
  //     params.get('order') || "title"
  // );

  const comicsRsponse = await getComics((page - 1) * 20, "title");

  const data = comicsRsponse.data;
  const comics = data.results;

  const results = document.getElementById("comics-results");
  results.innerHTML = "";
  const backButton = document.getElementById("back-button");
  const container = document.createElement("div");
  const row = document.createElement("div");

  results.appendChild(container);
  container.appendChild(row);

  container.classList.add("container");
  row.classList.add("row");

  comics.forEach((comic) => {
    // console.log(comic)

    const card = document.createElement("div");
    const cardImg = document.createElement("img");
    const cardBody = document.createElement("div");
    const col = document.createElement("div");
    const title = document.createElement("h2");

    card.addEventListener("click", () => {
      params.set("comicId", comic.id);

      window.location.href =
        window.location.pathname + "/../detail.html?" + params.toString();
    });

    backButton.addEventListener("click", () => {
      results.classList.remove("d-none");
      backButton.classList.add("d-none");
    });

    const titleText = document.createTextNode(comic.title);

    card.appendChild(cardImg);
    card.appendChild(cardBody);
    col.appendChild(card);
    cardBody.appendChild(title);
    title.appendChild(titleText);

    card.classList.add("card");
    cardImg.classList.add("card-img-top");
    cardBody.classList.add("card-body");
    col.classList.add("col-6");
    title.classList.add("h5");

    row.appendChild(col);

    cardImg.setAttribute(
      "src",
      `${comic.thumbnail.path}.${comic.thumbnail.extension}`
    );
  });
  renderPagination(pagination, page);
};

const formSearch = document.getElementById("search-comics");

formSearch.addEventListener("submit", (e) => {
  e.preventDefault();

  const orderBy = e.target["control-order-by"].value;

  const params = new URLSearchParams(window.location.search);

  params.set("order", orderBy);
  params.set("offset", 20);

  window.location.href = window.location.pathname + "?" + params.toString();
});

const renderPagination = (pagination, page) => {
  const buttons = [
    {
      text: "<<",
      class: "btn",
      onClick: function () {
        page = 1;
        loadComics(page);
      },
    },
    {
      text: page - 1,
      class: "btn",
      onClick: function () {
        page = page - 1;
        loadComics(page);
      },
    },
    {
      text: page,
      class: "btn",
    },
    {
      text: page + 1,
      class: "btn",
      onClick: function () {
        page = page + 1;
        loadComics(page);
      },
    },
    {
      text: ">>",
      class: "btn",
      onClick: function () {
        page = 400;
        loadComics(page);
      },
    },
  ];

  pagination.innerHTML = "";

  buttons.forEach((button) => {
    const buttonNode = document.createElement("button");
    const textNode = document.createTextNode(button.text);
    buttonNode.appendChild(textNode);
    buttonNode.classList.add(button.class);

    buttonNode.addEventListener("click", button.onClick);

    pagination.appendChild(buttonNode);
  });
  document.body.appendChild(pagination);
};

let page = 1;

const pagination = document.createElement("div");
pagination.setAttribute("id", "pagination");
pagination.classList.add("pagination");

const init = () => {
  renderPagination(pagination, page);
  loadComics(page);
};

init();
