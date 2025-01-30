<template>
  <div style="padding-top: 5px">
    <promoter-id-header
      v-if="promoter"
      :promoter="promoter"
    ></promoter-id-header>
    <promoter-event-list></promoter-event-list>
  </div>
</template>

<script setup>
import PromoterIdHeader from "@/components/promoters/PromoterIdHeader.vue";
import PromoterEventList from "@/components/promoters/PromoterEventList.vue";
import { useEventsStore } from "@/store/events";
import { usePromotersStore } from "@/store/promoters";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

const props = defineProps(["id", "entity"]);
const eventsStore = useEventsStore();
const promotersStore = usePromotersStore();
const { promoter } = storeToRefs(promotersStore);
const { event } = storeToRefs(eventsStore);

onMounted(async () => {
  await promotersStore.getPromoterById(props.id);
  await eventsStore.getEventsByPromoterId(props.id);
});
</script>
