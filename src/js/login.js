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
import { app } from "./firebase";
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
      // Handle Errors here.
      const errorCode = error.code;
      const errorMessage = error.message;
      // The email of the user's account used.
      const email = error.customData.email;
      // The AuthCredential type that was used.
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
      // An error happened.
      alert("something error", error);
    });
});

function loginCheck() {
  if (!sessionStorage.getItem("user")) {
    loginBtn.classList.remove("hidden");
    logoutBtn.classList.add("hidden");
  } else {
    loginBtn.classList.add("hidden");
    logoutBtn.classList.remove("hidden");
  }
}
