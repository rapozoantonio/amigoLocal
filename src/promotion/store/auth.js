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
import { defineStore } from "pinia";
import { useRoute, useRouter } from "vue-router";
import { useFirebaseStore } from "@/promotion/store/firebase";
import { auth } from "../../plugins/firebase";

export const useAuthStore = defineStore("auth", () => {
  // State
  const loggedIn = ref(false);
  const user = ref(null);
  const error = ref({ message: "", code: "" });
  const loading = ref(false);

  // Composables
  const route = useRoute();
  const router = useRouter();
  const firebase = useFirebaseStore();

  // Error mapping
  const ERROR_MESSAGES = {
    "auth/invalid-email": "Email inválido",
    "auth/user-disabled": "Conta desativada",
    "auth/user-not-found": "Usuário não encontrado",
    "auth/wrong-password": "Senha incorreta",
    "auth/email-already-in-use": "Email já está em uso",
    "auth/weak-password": "Senha muito fraca",
    "auth/network-request-failed": "Erro de conexão",
    "auth/too-many-requests": "Muitas tentativas. Tente mais tarde.",
    "auth/popup-closed-by-user": "Login cancelado",
  };

  // User state management
  function updateUserState(userState, claims = {}) {
    if (userState) {
      loggedIn.value = true;
      user.value = {
        displayName: userState.displayName,
        email: userState.email,
        uid: userState.uid,
        photoURL: userState.photoURL,
        admin: claims.admin || false,
        role: claims.role || "user",
        levelAccess: claims.levelAccess || 1,
        code: claims.code,
      };
    } else {
      loggedIn.value = false;
      user.value = null;
    }
  }

  // Authentication methods
  async function loginWithGoogle() {
    try {
      loading.value = true;
      error.value = { message: "", code: "" };

      const provider = new GoogleAuthProvider();
      provider.addScope("https://www.googleapis.com/auth/user.birthday.read");

      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        // Try to fetch birthday data if needed
        try {
          const scope = await fetch(
            "https://www.googleapis.com/auth/user.birthday.read",
            {
              headers: { Authorization: "Bearer " + result.user.accessToken },
              mode: "no-cors",
            }
          );
          const birthday = await scope.json();
          // Handle birthday data as needed
        } catch (scopeError) {
          console.warn("Could not fetch birthday scope:", scopeError);
        }

        const { claims } = await getIdTokenResult(result.user);
        updateUserState(result.user, claims);

        // if (route.query.redirect && route.query.redirect !== "") {
        //   await router.push(atob(route.query.redirect));
        // }

        return { ok: true, data: result.user };
      }
    } catch (err) {
      error.value = {
        message: ERROR_MESSAGES[err.code] || "Erro durante o login",
        code: err.code,
      };
      // throw error.value;
      return { ok: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function loginWithEmail(email, password) {
    try {
      loading.value = true;
      error.value = { message: "", code: "" };

      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      if (userCredential.user) {
        const { claims } = await getIdTokenResult(userCredential.user);
        updateUserState(userCredential.user, claims);

        if (route.query.redirect && route.query.redirect !== "") {
          await router.push(atob(route.query.redirect));
        }

        return { ok: true, data: userCredential.user };
      }
      throw new Error("nenhum usuario foi encontrado");
    } catch (err) {
      error.value = {
        message: ERROR_MESSAGES[err.code] || "Erro durante o login",
        code: err.code,
      };
      // throw error.value;
      return { ok: false, error: error.value };
    } finally {
      loading.value = false;
    }
  }

  async function registerWithEmail(userState, password) {
    try {
      loading.value = true;
      error.value = { message: "", code: "" };

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
    } catch (err) {
      error.value = {
        message: ERROR_MESSAGES[err.code] || "Erro durante o registro",
        code: err.code,
      };
      return {
        ok: false,
        error: error.value,
      };
    } finally {
      loading.value = false;
    }
  }

  async function logout() {
    try {
      loading.value = true;
      await signOut(auth);
      updateUserState(null);
    } catch (err) {
      error.value = {
        message: ERROR_MESSAGES[err.code] || "Erro ao fazer logout",
        code: err.code,
      };
      throw error.value;
    } finally {
      loading.value = false;
    }
  }

  async function getCurrentUser() {
    return new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (userState) => {
        if (userState) {
          const { claims } = await getIdTokenResult(userState);
          updateUserState(userState, claims);
        } else {
          updateUserState(null);
        }
        unsubscribe();
        resolve(user.value);
      });
    });
  }

  async function getUserProfile() {
    if (user.value) {
      return await firebase.getDocumentById("users", user.value.uid);
    }
    return null;
  }

  // Initialize auth state listener
  function init() {
    onAuthStateChanged(auth, async (userState) => {
      if (userState) {
        const { claims } = await getIdTokenResult(userState);
        updateUserState(userState, claims);
      } else {
        updateUserState(null);
      }
    });
  }

  // Initialize on store creation
  init();

  return {
    // State
    loggedIn,
    user,
    error,
    loading,

    // Methods
    loginWithGoogle,
    loginWithEmail,
    registerWithEmail,
    logout,
    getCurrentUser,
    getUserProfile,
  };
});
