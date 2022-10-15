import { db } from "./firebase";
import { collection, getDocs } from "firebase/firestore";
import { doc, deleteDoc } from "firebase/firestore";
import { moveMap } from "./map";
import likeImgURL from "../images/another-title.png";
import reserveImgURL from "../images/reserve.png";

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

  if (!user) {
    return;
  }

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
      moveMap(parseFloat(doc.data().lat), parseFloat(doc.data().lng));
    });
  });
}

const reserveBtn = document.getElementById("reserveBtn");
const reserveWrapperEl = document.querySelector(".reserve-modal-wrapper");
const reserveOverlayEl = document.querySelector(".reserve-modal-overlay");

const openreserve = () => {
  if (sessionStorage.getItem("user") === null) {
    alert("로그인을 해주세요");
    return;
  }
  reserveWrapperEl.classList.remove("hidden");
  reserveBtn.setAttribute("name", "calendar");
  reserveInit();
};

const closereserve = () => {
  reserveWrapperEl.classList.add("hidden");
  reserveBtn.setAttribute("name", "calendar-outline");
};

reserveBtn.addEventListener("click", openreserve);
reserveOverlayEl.addEventListener("click", closereserve);

const reserveDetailWrapperEl = document.querySelector(
  ".reserve__detail-wrapper"
);

async function reserveInit() {
  reserveDetailWrapperEl.innerHTML = "";
  const user = JSON.parse(sessionStorage.getItem("user"));

  if (!user) {
    return;
  }

  const querySnapshot = await getDocs(
    collection(db, "userReserves", user.uid, "myReserve")
  );

  // doc.id
  // doc.data()
  querySnapshot.forEach(doc => {
    console.log(doc.data());
    const reserveDetail = document.createElement("div");
    reserveDetail.classList.add("reserve__detail");

    const reserveImg = document.createElement("img");
    reserveImg.src = reserveImgURL;

    const reserveDetailDesc = document.createElement("div");
    reserveDetailDesc.classList.add("reserve__detail-desc");

    const reserveTitle = document.createElement("h1");
    reserveTitle.textContent = doc.data().centerName.substring(6);

    const reserveDesc = document.createElement("p");
    reserveDesc.textContent = doc.data().centerAddress;

    const reserveDesc2 = document.createElement("p");
    reserveDesc2.textContent = `건물 명 : ${doc.data().centerFacilityName}`;

    const reserveDesc3 = document.createElement("p");
    reserveDesc3.textContent = `예약 일 : ${doc.data().day} ${
      doc.data().time
    }분 까지`;

    reserveDetailDesc.appendChild(reserveTitle);
    reserveDetailDesc.appendChild(reserveDesc);
    reserveDetailDesc.appendChild(reserveDesc2);
    reserveDetailDesc.appendChild(reserveDesc3);
    reserveDetail.appendChild(reserveImg);
    reserveDetail.appendChild(reserveDetailDesc);

    reserveDetailWrapperEl.appendChild(reserveDetail);

    // button
    const reserveCancelBtn = document.createElement("button");
    reserveCancelBtn.textContent = "예약 취소하기";
    const moveBtn = document.createElement("button");
    moveBtn.textContent = "지도 보기";

    const buttonWrapper = document.createElement("div");
    buttonWrapper.classList.add("btn-wrapper");
    buttonWrapper.appendChild(moveBtn);
    buttonWrapper.appendChild(reserveCancelBtn);

    reserveDetailWrapperEl.appendChild(buttonWrapper);

    // 데이터 삭제
    reserveCancelBtn.addEventListener("click", () => {
      const id = doc.data().id;
      const day = doc.data().day;
      const time = doc.data().time;
      const uid = JSON.parse(sessionStorage.getItem("user")).uid;
      deleteReserve(id, uid, day, time);
      closereserve();
    });

    moveBtn.addEventListener("click", () => {
      moveMap(doc.data().lat, doc.data().lng);
    });
  });
}

async function deleteReserve(id, uid, day, time) {
  await deleteDoc(
    doc(db, "reserves", id.toString(), "resevedDay", day + "-" + time)
  );
  await deleteDoc(doc(db, "userReserves", uid, "myReserve", id.toString()));
}
