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
      console.log(comic, comic.id);
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

comics.forEach((comic) => {
  const card = document.createElement("div");
  const cardImg = document.createElement("img");
  const cardBody = document.createElement("div");
  const col = document.createElement("div");
  const title = document.createElement("h2");

  card.addEventListener("click", () => {});
});

/*const titleText = document.createTextNode(comic.title);

card.appendChild(cardImg);
card.appendChild(cardBody);
col.appendChild(card);
cardBody.appendChild(title);
title.appendChild(titleText);

card.classList.add("card");
card.classList.add("card-img");
card.classList.add("card");
card.classList.add("card");
card.classList.add("card");
*/
const loadDetail = (comic) => {
  const comicDetail = document.getElementById("comic-detail");

  const title = document.createElement("h3");
  const text = document.createTextNode(comic.title);
  const div = document.createElement("div");

  title.appendChild(text);
  div.appendChild(document.createTextNode(JSON.stringify(comic)));

  comicDetail.appendChild(title);
  comicDetail.appendChild(div);
};
