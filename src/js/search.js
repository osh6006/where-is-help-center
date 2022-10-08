import { searchAddressToCoordinate } from "./map";
import titleimgURL from "../images/titleimg.png";
import anotherimgURL from "../images/another-title.png";

const searchBtn = document.getElementById("searchBtn");
const searchInputEl = document.getElementById("search");

searchInputEl.addEventListener("keyup", event => {
  const value = document.getElementById("search").value;
  if (event.key === "Enter") {
    searchAddressToCoordinate(value);
  }
});

const cardWrapper = document.querySelector(".card-wrapper");
const card = document.querySelector(".card");
let filterArray = [];

export const readCenterInfo = (info, infoArray) => {
  console.log(info);

  filterArray = infoArray.filter(
    data =>
      data.sido === info.sido &&
      data.sigungu === info.sigungu &&
      info.id !== data.id
  );
  console.log(filterArray);
  removeEmpty();
  card.innerHTML = `
        <div class="title-wrapper">
          <img src=${titleimgURL} alt="asdf" />
          <span class="icon-wrapper">
            <ion-icon id="favoriteBtn" name="heart-outline"></ion-icon>
          </span>
        </div>
        <h1>${info.centerName.substring(6)}</h1>
        <p>${info.facilityName}</p>
        <p>${info.address}</p>
        <p>${info.phoneNumber}</p>
        <p>${info.updatedAt}</p>
      `;
  drawAnotherCenter();
};

const anotherCardEl = document.querySelector(".another-wrapper");
function drawAnotherCenter() {
  anotherCardEl.innerHTML = "";
  filterArray.forEach(data => {
    anotherCardEl.innerHTML += `
        <li class="another-card">
          <img src=${anotherimgURL} alt="another-title" />
            <div class="another-card__desc">
              <h1>${data.centerName.substring(6)}</h1>
              <p>${data.address}</p>
            </div>
        </li>
    `;
  });
}

const emptyEl = document.querySelector(".empty-wrapper");
function removeEmpty() {
  emptyEl.classList.add("hidden");
  cardWrapper.classList.remove("hidden");
}
