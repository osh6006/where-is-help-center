import { searchAddressToCoordinate } from "./map";
import titleimgURL from "../images/titleimg.png";
import anotherimgURL from "../images/another-title.png";
import { deleteLike, likeCheck, saveLike } from "./like";
import { drawReserveSection } from "./reserve";

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
let isLike = false;

export const readCenterInfo = (info, infoArray) => {
  console.log(info);

  filterArray = infoArray.filter(
    data =>
      data.sido === info.sido &&
      data.sigungu === info.sigungu &&
      info.id !== data.id
  );
  removeEmpty();

  card.innerHTML = "";
  const titleWrapperEl = document.createElement("div");
  titleWrapperEl.classList.add("title-wrapper");

  const titleImg = document.createElement("img");
  titleImg.src = `${titleimgURL}`;
  titleWrapperEl.appendChild(titleImg);

  const iconWrapper = document.createElement("span");
  iconWrapper.classList.add("icon-wrapper");
  const icon = document.createElement("ion-icon");
  icon.setAttribute("name", "heart-outline");
  icon.id = "favoriteBtn";
  iconWrapper.appendChild(icon);

  titleWrapperEl.appendChild(iconWrapper);

  const infoTitle = document.createElement("h1");
  const facilityName = document.createElement("span");
  const address = document.createElement("span");
  const phoneNumber = document.createElement("span");
  const updatedAt = document.createElement("span");

  // <ion-icon name="fitness-outline"></ion-icon>

  infoTitle.textContent = info.centerName.substring(6);
  facilityName.innerHTML = `
  <ion-icon name="fitness-outline" class="heart-icon"></ion-icon> 
  <p>${info.facilityName}</p> `;
  address.innerHTML = `<ion-icon name="reader-outline" class="address-icon"></ion-icon>
  <p>${info.address}</p>`;
  phoneNumber.innerHTML = `<ion-icon name="call-outline" class="phone-icon"></ion-icon>
  <p>${info.phoneNumber}</p>`;
  updatedAt.innerHTML = `<ion-icon name="information-circle-outline" class="updete-icon"></ion-icon>
  <p>${info.updatedAt} Updated ! </p>`;

  card.appendChild(titleWrapperEl);
  card.appendChild(infoTitle);
  card.appendChild(facilityName);
  card.appendChild(address);
  card.appendChild(phoneNumber);
  card.appendChild(updatedAt);

  if (!(sessionStorage.getItem("user") === null)) {
    // 좋아요를 클릭 했었는지 안했는지 체크
    Promise.all([likeCheck(info)]).then(result => {
      isLike = result[0];
      isLike && icon.setAttribute("name", "heart");
    });

    icon.addEventListener("click", () => {
      let like;
      // 좋아요를 클릭 했었는지 안했는지 체크
      Promise.all([likeCheck(info)]).then(result => {
        like = result[0];
        if (like) {
          deleteLike(info);
          icon.setAttribute("name", "heart-outline");
        } else {
          saveLike(info);
          icon.setAttribute("name", "heart");
        }
      });
    });
  }

  // draw reserve section....
  drawReserveSection(info);
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
