import { async } from "@firebase/util";
import {
  doc,
  setDoc,
  getDocs,
  collection,
  deleteDoc,
} from "firebase/firestore";
import { db } from "./firebase";

export async function saveLike(info) {
  console.log(info);
  console.log(info.lat);
  console.log(info.lng);
  console.log(info.id);

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
    console.log("Document written : ", likeDocRef);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}

export async function deleteLike(info) {
  const user = JSON.parse(sessionStorage.getItem("user"));
  await deleteDoc(doc(db, "likes", user.uid, "place", info.id.toString()));
}

export async function likeCheck(info) {
  // get data to server
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
