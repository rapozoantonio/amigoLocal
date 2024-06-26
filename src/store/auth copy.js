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

import { useFirebaseStore } from "@/store/firebase";

import { auth, functions, httpsCallable } from "../plugins/firebase";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    loggedIn: false,
    user: null,
    error: {
      message: "",
      code: 0,
    },
    profile: null,
    message: "",
  }),
  actions: {
    async loginWithGoogle() {
      const provider = new GoogleAuthProvider();
      try {
        const result = await signInWithPopup(auth, provider);
        console.log({ result });
        const { displayName, email, uid } = result.user;
        this.user = {
          uid,
          displayName,
          email,
        };
        this.loggedIn = true;
        console.log(
          `Successfully Logged In. Welcome ${displayName} (${email}) `
        );
        console.log("route", this.route);
        this.message = `Successfully Logged In. Welcome ${displayName} (${email}) `;
        if (this.route.query.redirect && this.route.query.redirect !== "") {
          console.log("redirect");
          this.router.push(atob(this.route.query.redirect));
        }
      } catch (error) {
        this.error.message = error.message;
        this.error.code = error.code;
      }
    },
    async loginWithEmail(email, password) {
      try {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          password
        );
        const user = userCredential.user;
        if (user) {
          this.user = {
            displayName: user.displayName,
            email: user.email,
            uid: user.uid,
            photoURL: user.photoURL,
          };
          this.loggedIn = true;
          if (this.route.query.redirect && this.route.query.redirect !== "") {
            this.router.push(atob(this.route.query.redirect));
          }
          console.log({ user });
        }
      } catch (error) {
        console.log({ error });
      }
    },
    async registerWithEmail(user, password) {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          user.email,
          password
        );
        user.id = userCredential.user.uid;
        console.log("credencials");
        const firebase = useFirebaseStore();
        const firebaseResponse = await firebase.registerUser(user);
        console.log("registeruser");

        await updateProfile(userCredential.user, { displayName: user.name });
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
    },
    async registerWithEmail2(user, password) {
      const createUser = httpsCallable(functions, "createUser");
      const { data } = await createUser({ user, password });
      console.log({ data });
    },
    logout() {
      console.log("logout");
      signOut(auth)
        .then(() => {
          this.loggedIn = false;
          this.user = null;
          this.message = "Successfully logged out";
          this.router.push({ name: "home" });
        })
        .catch((error) => {
          this.error.message = error.message;
          this.error.code = error.code;
        });
    },
    getCurrentUser() {
      return new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          console.log("onAuthStateChanged");
          if (user) {
            this.loggedIn = true;
            this.user = {
              displayName: user.displayName,
              email: user.email,
              uid: user.uid,
              photoURL: user.photoURL,
            };
          } else {
            this.loggedIn = false;
            this.user = null;
          }
          unsubscribe();
          resolve(user);
        });
      });
    },
    setCurrentUser(user) {
      console.log("setCurrentUser", user);
      this.user = user;
      this.loggedIn = user ? true : false;
    },
    async getUserClaims() {
      const user = await this.getCurrentUser();
      if (user) {
        return await getIdTokenResult(user);
      }
      return null;
    },
    async getUserProfile() {
      if (this.user) {
        const firebase = useFirebaseStore();
        const response = await firebase.getDocumentById("users", this.user.uid);
        console.log({ response });
      }
    },
  },
});
