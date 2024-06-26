import { ref } from "vue";

import {
  createUserWithEmailAndPassword,
  getIdTokenResult,
  GoogleAuthProvider,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signInWithPopup,
  signOut,
  updateProfile,
} from "firebase/auth";
// Utilities
import { defineStore } from "pinia";
import { useRoute, useRouter } from "vue-router";

import { useFirebaseStore } from "@/store/firebase";

import { auth } from "../plugins/firebase";

export const useAuthStore = defineStore("auth", () => {
  const loggedIn = ref(false);
  const user = ref(null);
  const error = ref({ message: "", code: 0 });
  const message = ref("");

  const route = useRoute();
  const router = useRouter();
  const firebase = useFirebaseStore();

  async function loginWithGoogle() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log({ result });
      return result.user;
      // const { displayName, email, uid, photoURL } = result.user;
      // user.value = {
      //   uid,
      //   displayName,
      //   email,
      //   photoURL,
      // };
      // loggedIn.value = true;
      // console.log(`Successfully Logged In. Welcome ${displayName} (${email}) `);
      // console.log("route", route);
      // message.value = `Successfully Logged In. Welcome ${displayName} (${email}) `;
      // return user.value;
      // if (route.query.redirect && route.query.redirect !== "") {
      //   console.log("redirect");
      //   router.push(atob(route.query.redirect));
      // }
    } catch (error) {
      error.value.message = error.message;
      error.value.code = error.code;
      return null;
    }
  }

  async function loginWithGoogle2() {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log({ result });
      const { displayName, email, uid, photoURL } = result.user;
      user.value = {
        uid,
        displayName,
        email,
        photoURL,
      };
      loggedIn.value = true;
      console.log(`Successfully Logged In. Welcome ${displayName} (${email}) `);
      console.log("route", route);
      message.value = `Successfully Logged In. Welcome ${displayName} (${email}) `;
      return user.value;
      // if (route.query.redirect && route.query.redirect !== "") {
      //   console.log("redirect");
      //   router.push(atob(route.query.redirect));
      // }
    } catch (error) {
      error.value.message = error.message;
      error.value.code = error.code;
    }
  }
  async function loginWithEmail(email, password) {
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const userState = userCredential.user;
      if (userState) {
        user.value = {
          displayName: userState.displayName,
          email: userState.email,
          uid: userState.uid,
          photoURL: userState.photoURL,
        };
        loggedIn.value = true;
        if (route.query.redirect && route.query.redirect !== "") {
          router.push(atob(route.query.redirect));
        }
        return userState;
      }
    } catch (error) {
      console.log({ error });
      throw new Error(error.message);
    }
  }
  async function registerWithEmail(userState, password) {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userState.email,
        password
      );
      userState.id = userCredential.user.uid;
      console.log("credencials");
      const firebaseResponse = await firebase.registerUser(userState);
      console.log("registeruser");

      await updateProfile(userCredential.user, { displayName: userState.name });
      console.log("updateProfile");

      return {
        ok: true,
        data: userCredential.user,
        notify: firebaseResponse.notify,
      };
    } catch (error) {
      console.log({ error });
      return {
        ok: false,
        error,
      };
    }
  }
  async function logout() {
    console.log("logout");
    try {
      await signOut(auth);
      loggedIn.value = false;
      user.value = null;
      message.value = "Successfully logged out";
      // router.push({ name: "home" });
    } catch (error) {
      error.value.message = error.message;
      error.value.code = error.code;
    }
  }
  function getCurrentUser() {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (userState) => {
        console.log("onAuthStateChanged", userState);
        if (userState) {
          const { claims } = await getIdTokenResult(userState);
          loggedIn.value = true;
          user.value = {
            displayName: userState.displayName,
            email: userState.email,
            uid: userState.uid,
            photoURL: userState.photoURL,
            admin: claims.admin || false,
            role: claims.role || "user",
            levelAccess: claims.levelAccess || 1,
          };
        } else {
          loggedIn.value = false;
          user.value = null;
        }
        unsubscribe();
        resolve(user.value);
      });
    });
  }

  function setCurrentUser(userState) {
    console.log("setCurrentUser", userState);
    user.value = userState;
    loggedIn.value = userState ? true : false;
  }
  async function getUserClaims() {
    const userState = await getCurrentUser();
    if (userState) {
      const token = await getIdTokenResult(userState);
      return token;
    }
    return null;
  }
  async function getUserProfile() {
    if (user.value) {
      const firebase = useFirebaseStore();
      const response = await firebase.getDocumentById("users", user.value.uid);
      console.log({ response });
    }
  }

  function init() {
    console.log("init AuthStore");
    onAuthStateChanged(auth, async (userState) => {
      console.log("onAuthStateChanged init", userState);
      if (userState) {
        const { claims } = await getIdTokenResult(userState);
        loggedIn.value = true;
        user.value = {
          displayName: userState.displayName,
          email: userState.email,
          uid: userState.uid,
          photoURL: userState.photoURL,
          admin: claims.admin || false,
          role: claims.role || "user",
          levelAccess: claims.levelAccess || 1,
        };
      } else {
        loggedIn.value = false;
        user.value = null;
      }
    });
  }

  init();

  return {
    loggedIn,
    user,
    error,
    message,
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
    getCurrentUser,
    setCurrentUser,
    getUserClaims,
    getUserProfile,
  };
});
