import { searchAddressToCoordinate } from "./map";
import titleimgURL from "../images/titleimg.png";
import anotherimgURL from "../images/another-title.png";
import { deleteLike, likeCheck, saveLike } from "./like";

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
  const facilityName = document.createElement("p");
  const address = document.createElement("p");
  const phoneNumber = document.createElement("p");
  const updatedAt = document.createElement("p");

  infoTitle.textContent = info.centerName.substring(6);
  facilityName.textContent = info.facilityName;
  address.textContent = info.address;
  phoneNumber.textContent = info.phoneNumber;
  updatedAt.textContent = info.updatedAt;

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
