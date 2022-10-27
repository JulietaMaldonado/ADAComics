const searchType = document.querySelector("#selectorCoPer");
//const elemento = (el) => document.querySelector(el);

const apiPublic = "4042da033c40ee19fedd46375607e22d";
const apiPrivate = "8b730cb45245a845720f6fad875bf0fbba96df20";

//const url = `http://gateway.marvel.com/v1/public/comics?apikey=${apiPublic}`;
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
