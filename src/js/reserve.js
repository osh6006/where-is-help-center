/**
 * 작성자 : 오황석
 * 이 파일의 역할 : 예약 데이터 초기화 및 예약
 * 작성 일 : 2022. 10. 5
 * 수정 일 : 2023. 8. 8
 */

import { collection, doc, getDocs, setDoc } from "firebase/firestore";
import { db } from "./firebase";

export const timeData = [
  { time: "9:30", disabled: false },
  { time: "10:00", disabled: false },
  { time: "10:30", disabled: false },
  { time: "11:00", disabled: false },
  { time: "11:30", disabled: false },
  { time: "13:00", disabled: false },
  { time: "13:30", disabled: false },
  { time: "14:00", disabled: false },
  { time: "14:30", disabled: false },
  { time: "15:00", disabled: false },
  { time: "15:30", disabled: false },
  { time: "16:00", disabled: false },
  { time: "16:30", disabled: false },
  { time: "17:00", disabled: false },
  { time: "17:30", disabled: false },
];

// 오늘 날짜로 초기화
const today = new Date();
const year = today.getFullYear(); // 년도
const month = today.getMonth() + 1; // 월
const date = today.getDate() + 1; // 날짜
const day = today.getDay(); // 요일

const todayFormat = year + "-" + month + "-" + date;

/**
 * 센터 정보를 받아서 예약 화면을 그려준다.
 * @param {object} info
 */
export function drawReserveSection(info) {
  const reserveSectionEl = document.querySelector(".reserve");
  reserveSectionEl.innerHTML = "";

  const reserveTitleWrapperEl = document.createElement("div");
  reserveTitleWrapperEl.classList.add("reserve-title-wrapper");

  const reserveTitleEl = document.createElement("h1");
  reserveTitleEl.textContent = "예약하기";

  const reserveTitleIcon = document.createElement("ion-icon");
  reserveTitleIcon.setAttribute("name", "calendar-number-outline");

  reserveTitleWrapperEl.appendChild(reserveTitleEl);
  reserveTitleWrapperEl.appendChild(reserveTitleIcon);
  reserveSectionEl.appendChild(reserveTitleWrapperEl);

  const reserveDateEl = document.createElement("input");
  reserveDateEl.setAttribute("type", "date");
  reserveDateEl.setAttribute("name", "reserve-date");
  reserveDateEl.id = "reserve-date";
  reserveDateEl.value = todayFormat;
  reserveDateEl.min = todayFormat;

  const reserveTimeEl = document.createElement("select");
  reserveTimeEl.id = "reserve-time";
  const opt = document.createElement("option");
  opt.setAttribute("value", "");
  opt.innerText = "시간을 선택해 주세요";
  reserveTimeEl.appendChild(opt);

  Promise.all([checkTime(info, timeData, todayFormat)]).then(result => {
    timeInit(reserveTimeEl, timeData, result[0]);
  });

  const reserveDateWrapper = document.createElement("div");
  reserveDateWrapper.classList.add("reserve-date-wrapper");
  reserveDateWrapper.appendChild(reserveDateEl);
  reserveDateWrapper.appendChild(reserveTimeEl);

  const reserveSaveBtn = document.createElement("button");
  reserveSaveBtn.textContent = "저장하기";

  reserveSectionEl.appendChild(reserveDateWrapper);
  reserveSectionEl.appendChild(reserveSaveBtn);

  reserveSaveBtn.addEventListener("click", () => {
    const time = reserveTimeEl.value;
    const day = reserveDateEl.value;

    if (sessionStorage.getItem("user") === null) {
      alert("로그인을 해주세요");
      return;
    }

    if (time === "") {
      alert("시간을 선택해 주세요");
      return;
    }

    checkId(info).then(result => {
      if (result) {
        alert(
          "이 예방접종 센터에는 이미 예약을 하셨습니다 ! 위의 캘린더 버튼을 클릭해보세요 !"
        );
        return;
      }
      saveReserve(info, day, time);
    });
  });

  reserveDateEl.addEventListener("change", () => {
    Promise.all([checkTime(info, timeData, reserveDateEl.value)]).then(
      result => {
        timeInit(reserveTimeEl, timeData, result[0]);
      }
    );
  });
}

/**
 * 예약을 저장한다.
 * @param {object} info
 * @param {string} day
 * @param {string} time
 */
async function saveReserve(info, day, time) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  const reserveDocRef = doc(
    db,
    "reserves",
    info.id.toString(),
    "resevedDay",
    day + "-" + time
  );

  // 장소에 대한 예약 저장
  try {
    await setDoc(reserveDocRef, {
      userId: user.uid,
      id: info.id,
      userName: user.displayName,
      time: time,
      email: user.email,
      day: day,
    });
    console.log("success place");
    // option init...
  } catch (e) {
    console.error("Error :", e);
  }

  // 유저에 대한 예약 저장
  const reserveUserDocRef = doc(
    db,
    "userReserves",
    user.uid,
    "myReserve",
    info.id.toString()
  );
  try {
    await setDoc(reserveUserDocRef, {
      email: user.email,
      id: info.id,
      userName: user.displayName,
      time: time,
      day: day,
      centerName: info.centerName,
      centerAddress: info.address,
      centerPhoneNumber: info.phoneNumber,
      centerFacilityName: info.facilityName,
      lat: info.lat,
      lng: info.lng,
    });
    alert("예약이 완료되었습니다. 위에 달력 모양 아이콘을 클릭해 보세요 !");
  } catch (e) {
    console.error("Error :", e);
  }
}

/**
 * select의 시간을 초기화 한다.
 * @param {*} select
 * @param {array} array
 * @param {array} findArray
 * @returns
 */
function timeInit(select, array, findArray) {
  let temp = _.cloneDeep(array);
  findArray.forEach(element => {
    temp[element].disabled = true;
  });
  select.innerHTML = "";
  temp.forEach(element => {
    const option = document.createElement("option");
    option.setAttribute("value", element.time);
    option.textContent = element.time;
    if (element.disabled) {
      option.textContent = element.time + " 예약됨";
      option.disabled = "disabled";
    }
    select.appendChild(option);
  });
}

/**
 * 시간이 예약되어 있다면 비활성화 시킨다.
 * @param {object} info
 * @param {array} array
 * @param {string} day
 * @returns
 */
async function checkTime(info, array, day) {
  const querySnapshot = await getDocs(
    collection(db, "reserves", info.id.toString(), "resevedDay")
  );

  let temp = [];

  querySnapshot.forEach(doc => {
    if (doc.data().day === day)
      temp.push(array.findIndex(element => element.time === doc.data().time));
  });

  return temp;
}

/**
 * 예약되어있는지 여부를 boolean으로 반환한다.
 * @param {object} info
 * @returns boolean
 */
async function checkId(info) {
  const user = JSON.parse(sessionStorage.getItem("user"));

  const querySnapshot = await getDocs(
    collection(db, "reserves", info.id.toString(), "resevedDay")
  );

  let isReserved;

  querySnapshot.forEach(doc => {
    if (user.uid === doc.data().userId) isReserved = true;
  });

  return isReserved;
}
