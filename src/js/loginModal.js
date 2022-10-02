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
