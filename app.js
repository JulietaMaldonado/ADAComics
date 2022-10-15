const searchType = document.querySelector("#selectorCoPer");
//const elemento = (el) => document.querySelector(el);

const apiPublic = "4042da033c40ee19fedd46375607e22d";
const apiPrivate = "8b730cb45245a845720f6fad875bf0fbba96df20";

//const url = `http://gateway.marvel.com/v1/public/comics?apikey=${apiPublic}`;
const baseUrl = `https://gateway.marvel.com/v1/public/`;
let offset = 0;

const getSearchParams = (isSearch) => {
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
  console.log(response);
};

const fetchComics = async () => {
  const {
    data: { results, total },
  } = await fetchUrl(getApiUrl("comics"));
  printComics(results);
};

const printComics = (comics) => {
  if (comics.length === 0) {
    results.innerHtml = "<h4 No hemos encontrado ningun resultado</h4>";
  }
  for (const comic of comics) {
    const comicCard = document.createElement("div");
    comicCard.tabIndex = 0;
    comicCard.classList.add("comic");
    comicCard.onclick = () => {
      console.log(comic, comic.id);
    };
    comicCard.innerHTML = `<div class="comic-img-container">
    <img src="${comic.thumbnail.path}/portrait_uncanny${comic.thumbnail.extension}" alt="" class="comic-thumbnail" />
  </div>
  <h3 class="comic-title">${comic.title}</h3>
`;
    results.append(comicCard);
  }
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
