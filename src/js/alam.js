/**
 * 작성자 : 오황석
 * 이 파일의 역할 : 파이어베이스 DB로 부터 알람 데이터를 불러온다.
 * 작성 일 : 2022. 10. 10
 * 수정 일 : 2022. 10. 10
 */

import { db } from "./firebase";
import { collection, getDoc, getDocs } from "firebase/firestore";
import alamImgURL from "../images/alam.png";

const alamBtn = document.getElementById("alamBtn");
const alamWrapperEl = document.querySelector(".alam-wrapper");
const alamOverlayEl = document.querySelector(".alam-overlay");

const openAlam = () => {
  alamWrapperEl.classList.remove("hidden");
  alamBtn.setAttribute("name", "notifications");
};

const closeAlam = () => {
  alamWrapperEl.classList.add("hidden");
  alamBtn.setAttribute("name", "notifications-outline");
};

alamBtn.addEventListener("click", openAlam);
alamOverlayEl.addEventListener("click", closeAlam);

const alamDetailWrapperEl = document.querySelector(".alam__detail-wrapper");

async function alamInit() {
  const querySnapshot = await getDocs(collection(db, "alam"));

  querySnapshot.forEach(doc => {
    alamDetailWrapperEl.innerHTML += `
        <div class="alam__detail">
            <img src=${alamImgURL} alt="alams" />
            <div class="alam_detail-desc">
              <h1>${doc.id}</h1>
              <p>
              ${doc.data().desc}
              </p>
            </div>
        </div>
    `;
  });
}
alamInit();
