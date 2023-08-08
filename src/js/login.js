/**
 * 작성자 : 오황석
 * 이 파일의 역할 : 사용자의 로그인을 처리한다.
 * 작성 일 : 2022. 10. 10
 * 수정 일 : 2023. 10. 10
 */

import {
  getAuth,
  signInWithPopup,
  FacebookAuthProvider,
  TwitterAuthProvider,
  GoogleAuthProvider,
  GithubAuthProvider,
  signOut,
} from "firebase/auth";
import UserInfo from "../utils/userInfo";
import { closeModal } from "./loginModal";

const facebookProvider = new FacebookAuthProvider();
const googleProvider = new GoogleAuthProvider();
const twitterProvider = new TwitterAuthProvider();
const githubProvider = new GithubAuthProvider();
const auth = getAuth();

const facebookBtn = document.getElementById("facebook-login-btn");
const googleBtn = document.getElementById("google-login-btn");
const twitterBtn = document.getElementById("twitter-login-btn");
const githubBtn = document.getElementById("github-login-btn");

const facbookLogin = () => {
  commonLogin(auth, facebookProvider);
};

const googleLogin = () => {
  commonLogin(auth, googleProvider);
};

const twitterLogin = () => {
  commonLogin(auth, twitterProvider);
};

const githubLogin = () => {
  commonLogin(auth, githubProvider);
};

googleBtn.addEventListener("click", googleLogin);
facebookBtn.addEventListener("click", facbookLogin);
twitterBtn.addEventListener("click", twitterLogin);
githubBtn.addEventListener("click", githubLogin);

/**
 * 공통적인 로그인 처리
 * @param {*} authInfo
 * @param {*} provider
 */
function commonLogin(authInfo, provider) {
  signInWithPopup(authInfo, provider)
    .then(result => {
      // The signed-in user info.
      const user = result.user;
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      const userInfo = new UserInfo(
        user.displayName,
        user.email,
        user.photoURL,
        user.uid
      );
      sessionStorage.setItem("user", JSON.stringify(userInfo));
      loginCheck();
      closeModal();
    })
    .catch(error => {
      const errorCode = error.code;
      const errorMessage = error.message;
      const email = error.customData.email;
      const credential = FacebookAuthProvider.credentialFromError(error);
      console.log(errorCode, errorMessage, email, credential);
    });
}

const loginBtn = document.getElementById("loginBtn");
const logoutBtn = document.getElementById("logoutBtn");

document.addEventListener("DOMContentLoaded", loginCheck);

logoutBtn.addEventListener("click", () => {
  signOut(auth)
    .then(() => {
      sessionStorage.clear();
      loginCheck();
      window.location.reload();
    })
    .catch(error => {
      alert("something error", error);
    });
});

/**
 * 로그인 체크 확인
 */
function loginCheck() {
  if (!sessionStorage.getItem("user")) {
    loginBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
  } else {
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
  }
}
