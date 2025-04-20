import { ref } from 'vue';

import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
} from 'firebase/firestore';
// import { ref, } from 'vue'
import { defineStore } from 'pinia';
import Swal from 'sweetalert2';

import { firestore } from '@/core/plugins/firebase';

export const useProducersStore = defineStore("producers", () => {
  const producer = ref(null);
  const producers = ref(null);
  const loading = ref(false);

  async function getProducers() {
    loading.value = true;
    producers.value = null;

    try {
      const q = query(collection(firestore, "producers"));
      const querySnapshot = await getDocs(q);
      
      //   querySnapshot.forEach((document) => {
      //     
      //     events.value.push(document.data());
      //   });
      producers.value = querySnapshot.docs.map((d) => d.data());
      return {
        ok: true,
        data: { producers: producers.value },
      };
    } catch (error) {
      
      notifyError(error);
      return {
        ok: false,
        error,
      };
    } finally {
      loading.value = false;
    }
  }

  async function getProducerById(id) {
    try {
      const documentSnapshot = await getDoc(doc(firestore, "producers/" + id));
      if (!documentSnapshot.empty) {
        producer.value = documentSnapshot.data();
      }
    } catch (error) {
      
      notifyError(error);
      return {
        ok: false,
        error,
      };
    }
  }

  async function pushProducer(loc) {
    if (!producers.value || !Array.isArray(producers.value)) {
      producers.value = [];
    }
    producers.value.push(loc);
    return true;
  }

  async function init() {
    
    await getProducers();
  }

  init();

  function notifyError(error) {
    Swal.fire({
      title: error.code,
      text: error.message,
      icon: "error",
    });
  }

  return {
    producers,
    loading,
    getProducers,
    getProducerById,
    producer,
    pushProducer,
  };
});
