import {
  computed,
  ref,
  watch,
} from 'vue';

import { defineStore } from 'pinia';

import $genres from '@/assets/genres';
import $eventCategories from '@/assets/eventCategories';
import { useVuelidate } from '@vuelidate/core';
import { required } from '@vuelidate/validators';

import { useAppStore } from './app';
import { useFirebaseStore } from './firebase';

export const useEventStore = defineStore("event", () => {
  const firebaseStore = useFirebaseStore();
  const appStore = useAppStore();

  const event = ref({
    name: null,
    startDate: new Date().toISOString().split("T")[0],
    startTime: null,
    endDate: new Date().toISOString().split("T")[0],
    endTime: null,
    // location: null,
    location: {
      name: null,
      id: null,
      country: "BR",
      region: null,
      address: null,
      city: null,
    },
    genres: null,
    categories: null,
    lineup: null,
    price: null,
    description: null,
    age: "+18",
    links: null,
    medias: null,
    image: null,
    promoter: firebaseStore.getCurrentUser(),
    producer: null,
  });
  const files = ref({
    flyerFront: null,
    flyerBack: null,
    image: null,
  });

  const genres = ref($genres);
  const eventCategories = ref($eventCategories);
  
  const ages = ref([
    { name: "+18", value: "+18" },
    { name: "+19", value: "+19" },
    { name: "+20", value: "+20" },
    { name: "+21", value: "+21" },
  ]);

  const sections = ref({
    1: null,
    2: null,
    3: null,
    4: null,
  });

  const sectionBasicComplete = computed(() => {
    return !!(event.value["name"] && event.value["name"] !== "");
  });

  const rules = {
    name: { required },
    startDate: { required },
  };

  const $v = useVuelidate(rules, event);

  async function createEvent() {
    appStore.loading = true;
    appStore.loadingText = "Creating event...";
    try {
      const id = firebaseStore.getPostDocRef("events").id;

      const entries = Object.entries(files.value);
      

      const filesToUpload = entries.reduce((total, [name, value]) => {
        if (!value) return total;
        if (Array.isArray(value)) {
          if (value[0]) {
            total.push({
              name: name,
              path: `events/${id}/${name}.${value[0].type.split("/").pop()}`,
              file: value[0],
            });
          }
        } else {
          total.push({
            name: name,
            path: `events/${id}/${name}.${value.type.split("/").pop()}`,
            file: value,
          });
        }

        return total;
      }, []);
      

      const pictures = await firebaseStore.uploadPictures(filesToUpload);
      

      pictures.forEach((p) => {
        event.value[p.name] = {
          path: p.path,
          url: p.url,
        };
      });
      event.value.id = id;

      event.value.promoter = firebaseStore.getCurrentUser();
      

      const response = await firebaseStore.postDocument(
        "events",
        event.value,
        "events"
      );
      response.notify(
        "Event created",
        `Event ${event.value.name ? event.value.name : ""} created successfully`
      );
      return { ok: true };
    } catch (error) {
      
      return { ok: false, error };
    } finally {
      appStore.loading = false;
      appStore.loadingText = null;
    }
  }

  async function updateEvent() {
    appStore.loading = true;
    appStore.loadingText = "Updating event...";
    try {
      const id = event.value.id;
      const entries = Object.entries(files.value);
      

      const filesToUpload = entries.reduce((total, [name, value]) => {
        if (!value) return total;
        if (Array.isArray(value)) {
          if (value[0]) {
            total.push({
              name: name,
              path: `events/${id}/${name}.${value[0].type.split("/").pop()}`,
              file: value[0],
            });
          }
        } else {
          total.push({
            name: name,
            path: `events/${id}/${name}.${value.type.split("/").pop()}`,
            file: value,
          });
        }

        return total;
      }, []);
      

      const pictures = await firebaseStore.uploadPictures(filesToUpload);
      

      pictures.forEach((p) => {
        event.value[p.name] = {
          path: p.path,
          url: p.url,
        };
      });

      const response = await firebaseStore.putDocument(
        "events",
        id,
        event.value
      );
      if (response.ok) {
        response.notify();
        return { ok: true };
      }
      return { ok: false };
    } catch (error) {
      
      return { ok: false, error };
    } finally {
      appStore.loading = false;
      appStore.loadingText = null;
    }
  }

  function $reset() {
    event.value = {
      name: null,
      startDate: new Date().toISOString().split("T")[0],
      startTime: "19:00",
      endDate: new Date().toISOString().split("T")[0],
      endTime: "23:00",
      // location: null,
      location: {
        name: null,
        id: null,
        country: "BR",
        region: null,
        address: null,
        city: null,
      },
      genres: null,
      lineup: null,
      price: null,
      description: null,
      age: "+18",
      links: [],
      medias: [],
      flyerFront: null,
      flyerBack: null,
      image: null,
    };
    files.value = {
      flyerFront: null,
      flyerBack: null,
      image: null,
    };
    sections.value = {
      1: null,
      2: null,
      3: null,
      4: null,
    };
  }

  async function getEventById(id) {
    return await firebaseStore.getDocumentById("events", id);
  }

  watch(
    () => event.value.startDate,
    (newValue) => {
      if (event.value.endDate < newValue) {
        event.value.endDate = newValue;
      }
    }
  );

  return {
    event,
    genres,
    ages,
    files,
    eventCategories,
    sectionBasicComplete,
    createEvent,
    $reset,
    sections,
    $v,
    getEventById,
    updateEvent,
    eventCategories
  };
});
