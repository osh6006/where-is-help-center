import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import likeImgURL from "../images/another-title.png";
import { map } from "./map";

const likeBtn = document.getElementById("likeBtn");
const likeWrapperEl = document.querySelector(".like-wrapper");
const likeOverlayEl = document.querySelector(".like-overlay");

const openLike = () => {
  if (sessionStorage.getItem("user") === null) {
    alert("로그인을 해주세요");
    return;
  }
  likeWrapperEl.classList.remove("hidden");
  likeBtn.setAttribute("name", "heart");
  likeInit();
};

const closeLike = () => {
  likeWrapperEl.classList.add("hidden");
  likeBtn.setAttribute("name", "heart-outline");
};

likeBtn.addEventListener("click", openLike);
likeOverlayEl.addEventListener("click", closeLike);

// get Like data

const likeDetailWrapperEl = document.querySelector(".like__detail-wrapper");

// 알람 데이터 받아오기
async function likeInit() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const querySnapshot = await getDocs(
    collection(db, "likes", user.uid, "place")
  );

  likeDetailWrapperEl.innerHTML = "";

  // doc.id
  // doc.data()
  querySnapshot.forEach(doc => {
    const likeDetail = document.createElement("div");
    likeDetail.classList.add("like__detail");

    const likeImg = document.createElement("img");
    likeImg.src = likeImgURL;

    const likeDetailDesc = document.createElement("div");
    likeDetailDesc.classList.add("like_detail-desc");

    const likeTitle = document.createElement("h1");
    likeTitle.textContent = doc.data().title.substring(6);

    const likeDesc = document.createElement("p");
    likeDesc.textContent = doc.data().address + doc.data().desc;
    likeDetailDesc.appendChild(likeTitle);
    likeDetailDesc.appendChild(likeDesc);

    likeDetail.appendChild(likeImg);
    likeDetail.appendChild(likeDetailDesc);

    likeDetailWrapperEl.appendChild(likeDetail);

    likeDetail.addEventListener("click", () => {
      console.log("click!");
      const lat = parseFloat(doc.data().lat);
      const lng = parseFloat(doc.data().lng);
      const point = new naver.maps.LatLng(lat, lng);
      map.setZoom(15);
      map.panTo(point);
    });
  });
}
