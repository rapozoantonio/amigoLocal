import { computed, ref } from "vue";
import {
  collection,
  doc,
  getCountFromServer,
  getDoc,
  getDocs,
  query,
  where,
} from "firebase/firestore";
import { defineStore } from "pinia";
import Swal from "sweetalert2";
import { firestore } from "@/plugins/firebase";

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const eventCache = new Map();

// Date formatters
const dateFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "short",
});

const yearFormatter = new Intl.DateTimeFormat("pt-BR", {
  weekday: "short",
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export const useEventsStore = defineStore("events", () => {
  // State
  const events = ref(null);
  const event = ref(null);
  const loadingStates = ref(new Map());
  const selectedGenres = ref(null);

  // Loading state management
  const setLoading = (operation, state) => {
    loadingStates.value.set(operation, state);
  };

  const isLoading = computed(() => 
    operation => loadingStates.value.get(operation) ?? false
  );

  // Computed properties
  const filteredEvents = computed(() => {
    if (!events.value) return null;
    if (!selectedGenres.value?.length) return events.value;
    
    return events.value.filter(event => 
      event.genres.some(genre => selectedGenres.value.includes(genre))
    );
  });

  const featuredEvents = computed(() => {
    if (!events.value) return null;
    
    const result = {
      featured: [],
      regular: []
    };

    filteredEvents.value.forEach(event => {
      event.featured ? 
        result.featured.push(event) : 
        result.regular.push(event);
    });

    result.regular.sort((a, b) => b.followers - a.followers);
    return [...result.featured, ...result.regular];
  });

  const getCountByGenre = computed(() => genre => 
    events.value?.filter(e => e.genres.includes(genre)).length ?? 0
  );

  const formatEventDate = (dateString, currentYear) => {
    const date = new Date(dateString);
    const formatter = date.getFullYear() === currentYear ? 
      dateFormatter : yearFormatter;
    return formatter.format(date).toUpperCase();
  };

  const nextEvents = computed(() => {
    if (!events.value) return null;

    const currentYear = new Date().getFullYear();
    return filteredEvents.value.reduce((acc, event) => {
      const date = formatEventDate(event.startDate, currentYear);
      
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {});
  });

  const eventsDateList = computed(() => eventsList => {
    if (!eventsList) return null;

    const currentYear = new Date().getFullYear();
    return eventsList.reduce((acc, event) => {
      const date = formatEventDate(event.startDate, currentYear);
      
      if (!acc[date]) {
        acc[date] = [];
      }
      acc[date].push(event);
      return acc;
    }, {});
  });

  // Query helpers
  const buildQueries = (config) => {
    const queries = [];
    
    if (config.country) {
      queries.push(where("location.country", "==", config.country));
    }
    if (config.region) {
      queries.push(where("location.region.id", "==", config.region));
    }
    if (config.categories?.length) {
      queries.push(where("categories", "array-contains-any", config.categories));
    }
    if (config.promoterId) {
      queries.push(where("promoter.id", "==", config.promoterId));
    }
    if (config.producerId) {
      queries.push(where("producer.id", "==", config.producerId));
    }
    if (config.locationId) {
      queries.push(where("location.id", "==", config.locationId));
    }

    return queries;
  };

  const executeQuery = async (queries) => {
    const q = query(collection(firestore, "events"), ...queries);
    const snapshot = await getDocs(q);
    return snapshot.docs.map(d => d.data())
      .sort((a, b) => a.startDate.localeCompare(b.startDate));
  };

  // Main query function
  const getEvents = async (queryConfig) => {
    const operationId = 'getEvents';
    setLoading(operationId, true);

    try {
      const cacheKey = JSON.stringify(queryConfig);
      const cached = eventCache.get(cacheKey);

      if (cached?.timestamp > Date.now() - CACHE_DURATION) {
        events.value = cached.data;
        return { ok: true, data: { events: cached.data } };
      }

      const queries = buildQueries(queryConfig);
      const eventsData = await executeQuery(queries);

      eventCache.set(cacheKey, {
        data: eventsData,
        timestamp: Date.now()
      });

      events.value = eventsData;
      return { ok: true, data: { events: eventsData } };

    } catch (error) {
      console.error('Error fetching events:', error);
      notifyError(error);
      return { ok: false, error };
    } finally {
      setLoading(operationId, false);
    }
  };

  // Specific query methods
  const getEventsByCategories = (country, region, categories) => 
    getEvents({ country, region, categories });

  const getEventsByRegion = (country, region) => 
    getEvents({ country, region });

  const getEventsByPromoterId = (promoterId) => 
    getEvents({ promoterId });

  const getEventsByProducerId = (producerId) => 
    getEvents({ producerId });

  const getEventsByLocationId = (locationId) => 
    getEvents({ locationId });

  // Single event query
  async function getEventById(id) {
    const operationId = 'getEventById';
    setLoading(operationId, true);

    try {
      const cacheKey = `event-${id}`;
      const cached = eventCache.get(cacheKey);

      if (cached?.timestamp > Date.now() - CACHE_DURATION) {
        event.value = cached.data;
        return { ok: true, data: cached.data };
      }

      const documentSnapshot = await getDoc(doc(firestore, "events/" + id));
      if (!documentSnapshot.empty) {
        const eventData = documentSnapshot.data();
        
        eventCache.set(cacheKey, {
          data: eventData,
          timestamp: Date.now()
        });

        event.value = eventData;
        return { ok: true, data: eventData };
      }
      
      return { ok: false, error: 'Event not found' };

    } catch (error) {
      console.error('Error fetching event:', error);
      notifyError(error);
      return { ok: false, error };
    } finally {
      setLoading(operationId, false);
    }
  }

  // Count documents helper
  async function countDocuments(col, condition) {
    const operationId = 'countDocuments';
    setLoading(operationId, true);

    try {
      const cacheKey = `count-${col}-${JSON.stringify(condition)}`;
      const cached = eventCache.get(cacheKey);

      if (cached?.timestamp > Date.now() - CACHE_DURATION) {
        return cached.data;
      }

      const coll = collection(firestore, col);
      const q = query(coll, where(...condition));
      const snapshot = await getCountFromServer(q);
      const count = snapshot.data().count;

      eventCache.set(cacheKey, {
        data: count,
        timestamp: Date.now()
      });

      return count;
    } catch (error) {
      console.error('Error counting documents:', error);
      notifyError(error);
      return 0;
    } finally {
      setLoading(operationId, false);
    }
  }

  function notifyError(error) {
    Swal.fire({
      title: error.code,
      text: error.message,
      icon: "error",
    });
  }

  return {
    getEventsByRegion,
    getEventsByCategories,
    featuredEvents,
    events: filteredEvents,
    nextEvents,
    getEventById,
    event,
    loading: isLoading,
    selectedGenres,
    getCountByGenre,
    getEventsByPromoterId,
    getEventsByProducerId,
    getEventsByLocationId,
    eventsDateList,
    countDocuments,
  };
});