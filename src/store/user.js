import {
  ref,
  watch,
} from 'vue';

import { onAuthStateChanged } from 'firebase/auth';
// Utilities
import { defineStore } from 'pinia';
import { useRouter } from 'vue-router';

import { auth } from '@/plugins/firebase';

import { useFirebaseStore } from './firebase';

export const useUserStore = defineStore("user", () => {
  const user = ref(null);
  const follows = ref({
    events: null,
    promoters: null,
    locations: null,
  });
  const usernameLocked = ref(false);
  const firebaseStore = useFirebaseStore();
  const router = useRouter();

  async function getUser(uid) {
    console.log("getUser");
    const response = await firebaseStore.getDocumentById("users", uid);
    console.log(response?.data);
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
    console.log(entityFollows?.data);
    if (entityFollows.ok) {
      follows.value[entity] = entityFollows.data?.following;
    }
  }

  function resetUser() {
    console.log("resetUser");
    user.value = null;
    follows.value = {
      events: null,
      promoters: null,
      locations: null,
    };
  }

  async function init() {
    const unsubscribe = onAuthStateChanged(auth, async (userState) => {
      console.log("init onauthchange user");
      if (userState) {
        try {
          const response = await firebaseStore.getDocumentById(
            "users",
            userState.uid
          );
          if (response.ok) {
            console.log({ response }, response.data.username);
            if (response.data.username) {
              console.log("locking username");
              usernameLocked.value = true;
            }
            user.value = response.data;
            await getFollows(userState.uid);
          }
        } catch (error) {
          console.log("init auth", { error });
          resetUser();
        } finally {
          console.log("user", user.value);
        }
      } else {
        console.log("else userstate", user.value);
        resetUser();
      }
    });
  }

  init();

  watch(
    () => user.value?.name,
    (newValue) => {
      if (newValue && !usernameLocked.value) {
        user.value.username = newValue;
      }
    }
  );

  return { user, follows, getUser, getFollows };
});
