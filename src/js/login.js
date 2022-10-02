import { getAuth, signInWithPopup, FacebookAuthProvider } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { app } from "./firebase";

const facebookProvider = new FacebookAuthProvider();
const googleProvider = new GoogleAuthProvider();

const facebookBtn = document.getElementById("facebook-login-btn");
const googleBtn = document.getElementById("google-login-btn");

const facbooklogin = () => {
  const auth = getAuth();
  signInWithPopup(auth, facebookProvider)
    .then(result => {
      // The signed-in user info.
      const user = result.user;
      // This gives you a Facebook Access Token. You can use it to access the Facebook API.
      const credential = FacebookAuthProvider.credentialFromResult(result);
      const accessToken = credential.accessToken;
      console.log(user);
      console.log(accessToken);
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
};
facebookBtn.addEventListener("click", facbooklogin);
