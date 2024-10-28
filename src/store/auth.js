import { ref } from "vue";

import {
  createUserWithEmailAndPassword,
  getAdditionalUserInfo,
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
    provider.addScope("https://www.googleapis.com/auth/user.birthday.read");
    try {
      const result = await signInWithPopup(auth, provider);
      

      const scope = await fetch(
        "https://www.googleapis.com/auth/user.birthday.read",
        {
          headers: { Authorization: "Bearer " + result.user.accessToken },
          mode: "no-cors",
        }
      );
      const birthday = await scope.json();
      
      
      return result.user;
      // const { displayName, email, uid, photoURL } = result.user;
      // user.value = {
      //   uid,
      //   displayName,
      //   email,
      //   photoURL,
      // };
      // loggedIn.value = true;
      // 
      // 
      // message.value = `Successfully Logged In. Welcome ${displayName} (${email}) `;
      // return user.value;
      // if (route.query.redirect && route.query.redirect !== "") {
      //   
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
      
      const { displayName, email, uid, photoURL } = result.user;
      user.value = {
        uid,
        displayName,
        email,
        photoURL,
      };
      loggedIn.value = true;
      
      
      message.value = `Successfully Logged In. Welcome ${displayName} (${email}) `;
      return user.value;
      // if (route.query.redirect && route.query.redirect !== "") {
      //   
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
      
      const firebaseResponse = await firebase.registerUser(userState);
      

      await updateProfile(userCredential.user, { displayName: userState.name });
      

      return {
        ok: true,
        data: userCredential.user,
        notify: firebaseResponse.notify,
      };
    } catch (error) {
      
      return {
        ok: false,
        error,
      };
    }
  }
  async function logout() {
    
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
      
    }
  }

  function init() {
    
    onAuthStateChanged(auth, async (userState) => {
      
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
