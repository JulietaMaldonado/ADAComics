const searchType = document.querySelector("#selectorCoPer");
const elemento = (el) => document.querySelector(el);

const apiPublic = "4042da033c40ee19fedd46375607e22d";
const apiPrivate = "8b730cb45245a845720f6fad875bf0fbba96df20";

//const url = `http://gateway.marvel.com/v1/public/comics?apikey=${apiPublic}`;
const baseUrl = "http://gateway.marvel.com/v1/public/";
let offset = 0;

const getSearchParams = (isSearch) => {
  let url = baseUrl;
  let searchParams = `?apikey=${apiPublic}&offset=${offset}`;

  if (searchType.value === "comics") {
    url += +searchType.value + searchParams;
  }
  fetch(url)
    .then((resp) => resp.json())
    .then((json) => console.log(json))
    .catch((err) => console.error(err));
};

getSearchParams();
