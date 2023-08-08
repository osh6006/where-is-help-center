/**
 * 작성자 : 오황석
 * 이 파일의 역할 : 로그인 팝업을 toggle한다.
 * 작성 일 : 2022. 10. 10
 * 수정 일 : 2023. 10. 10
 */

const openButton = document.getElementById("loginBtn");
const modal = document.querySelector(".loginModal");
const overlay = modal.querySelector(".overlay");
const closeBtn = modal.querySelector("ion-icon");
const openModal = () => {
  modal.classList.remove("hidden");
};
export const closeModal = () => {
  modal.classList.add("hidden");
};
openButton.addEventListener("click", openModal);
closeBtn.addEventListener("click", closeModal);
overlay.addEventListener("click", closeModal);
