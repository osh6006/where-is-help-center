/**
 * 작성자 : 오황석
 * 이 파일의 역할 : 사용자가 즐겨찾기 한 센터를 불러와서 DOM에 그려준다.
 * 작성 일 : 2022. 10. 10
 * 수정 일 : 2023. 8. 8
 */

import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { moveMap } from "./map";
import likeImgURL from "../images/another-title.png";

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

const likeDetailWrapperEl = document.querySelector(".like__detail-wrapper");

async function likeInit() {
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    return;
  }

  const querySnapshot = await getDocs(
    collection(db, "likes", user.uid, "place")
  );

  likeDetailWrapperEl.innerHTML = "";

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
      moveMap(parseFloat(doc.data().lat), parseFloat(doc.data().lng));
    });
  });
}
