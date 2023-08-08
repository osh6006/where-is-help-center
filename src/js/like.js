/**
 * 작성자 : 오황석
 * 이 파일의 역할 : 사용자가 센터를 즐겨찾기와 즐겨찾기 취소 로직을 수행한다.
 * 작성 일 : 2022. 10. 10
 * 수정 일 : 2023. 8. 8
 */

import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

/**
 * 좋아요 저장
 * @param {object} info
 */
export async function saveLike(info) {
  if (sessionStorage.getItem("user") === null) {
    alert("로그인을 해주세요");
    return;
  }

  const user = JSON.parse(sessionStorage.getItem("user"));
  const likeDocRef = doc(db, "likes", user.uid, "place", info.id.toString());
  try {
    await setDoc(likeDocRef, {
      lat: info.lat,
      lng: info.lng,
      title: info.centerName,
      desc: info.facilityName,
      address: info.address,
    });
    console.log("success");
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

/**
 * 좋아요 삭제
 * @param {object} info
 */
export async function deleteLike(info) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  await deleteDoc(doc(db, "likes", user.uid, "place", info.id.toString()));
}

/**
 * 좋아요 여부 확인
 * @param {object} info
 */
export async function likeCheck(info) {
  if (sessionStorage.getItem("user") === null) {
    alert("로그인을 해주세요");
    return;
  }
  const user = JSON.parse(sessionStorage.getItem("user"));

  const querySnapshot = await getDocs(
    collection(db, "likes", user.uid, "place")
  );

  let temp = false;

  querySnapshot.forEach(doc => {
    const docLocation = parseFloat(doc.data().lat) + parseFloat(doc.data().lng);
    const infoLocation = parseFloat(info.lat) + parseFloat(info.lng);
    if (docLocation === infoLocation) {
      temp = true;
    }
  });

  return temp;
}
