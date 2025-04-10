import { ref, watch } from "vue";

import { onAuthStateChanged, getIdTokenResult } from "firebase/auth";
// Utilities
import { defineStore } from "pinia";
import { useRouter } from "vue-router";

import { auth } from "@/plugins/firebase";

import { useFirebaseStore } from "./firebase";

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const follows = ref({
    events: null,
    promoters: null,
    locations: null,
  });
  const promoter = ref(null);
  const usernameLocked = ref(false);
  const firebaseStore = useFirebaseStore();
  const router = useRouter();

  async function getUser(uid) {
    const response = await firebaseStore.getDocumentById("users", uid);

    if (response.ok) {
      user.value = response.data;
    }
    await getFollows(uid);
    return user.value;
  }

  async function getFollows(uid) {
    await getFollowsByEntity("events", uid);
    await getFollowsByEntity("locations", uid);
    await getFollowsByEntity("producers", uid);
    await getFollowsByEntity("promoters", uid);
  }

  async function getFollowsByEntity(entity, uid) {
    const entityFollows = await firebaseStore.getDocumentById(
      "users/" + uid + "/follows",
      entity
    );

    if (entityFollows.ok) {
      follows.value[entity] = entityFollows.data?.following;
    }
  }

  function resetUser() {
    user.value = null;
    follows.value = {
      events: null,
      promoters: null,
      locations: null,
    };
  }

  async function init() {
    const unsubscribe = onAuthStateChanged(auth, async (userState) => {
      if (userState) {
        try {
          const response = await firebaseStore.getDocumentById(
            "users",
            userState.uid
          );
          if (response.ok) {
            user.value = response.data;
            await getFollows(userState.uid);

            const { claims } = await getIdTokenResult(userState);
            if (claims.role === "pro" || claims.role === "admin") {
              const promoterResponse = await firebaseStore.getDocumentById(
                "promoters",
                userState.uid
              );
              if (promoterResponse.ok) {
                console.log("promoter", promoterResponse.data);
                promoter.value = promoterResponse.data;
              }
            }
          }
        } catch (error) {
          console.log({ error });
          resetUser();
        } finally {
        }
      } else {
        resetUser();
      }
    });
  }

  init();

  return { user, follows, getUser, getFollows, promoter };
});
