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

// get alamdata

const alamDetailWrapperEl = document.querySelector(".alam__detail-wrapper");

// 알람 데이터 받아오기
async function alamInit() {
  const querySnapshot = await getDocs(collection(db, "alam"));
  // doc.id 알람제목
  // doc.data() 알람
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
