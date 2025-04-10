import {
  ref,
  watch,
} from 'vue';

// import { ref, } from 'vue'
import { defineStore } from 'pinia';

import { useFirebaseStore } from './firebase';

export const useProducerStore = defineStore("producer", () => {
  const firebaseStore = useFirebaseStore();

  const producer = ref({
    name: null,
    username: null,
    country: "BR",
    description: null,
    links: null,
    followers: 0,
    approved: false,
    featured: false,
    owner: firebaseStore.getCurrentUser(),
  });

  function reset() {
    producer.value = {
      name: null,
      username: null,
      country: "BR",
      description: null,
      links: null,
      followers: 0,
      approved: false,
      featured: false,
      owner: firebaseStore.getCurrentUser(),
    };
  }

  async function createProducer(notify = true) {
    try {
      const response = await firebaseStore.postDocument(
        "producers",
        producer.value
      );
      if (response.ok) {
        if (notify) {
          response.notify();
        }
        reset();
        return response;
      }
    } catch (error) {
      
      return error;
    }
  }

  watch(
    () => producer.value?.name,
    (newValue) => {
      if (newValue) {
        producer.value.username = newValue;
      }
    }
  );

  return {
    createProducer,
    producer,
    reset,
  };
});
