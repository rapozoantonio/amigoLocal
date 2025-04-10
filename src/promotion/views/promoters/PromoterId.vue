<template>
  <div style="padding-top: 5px">
    <promoter-id-header v-if="promoter" :promoter="promoter"></promoter-id-header>
    <promoter-event-list :id="props.id"></promoter-event-list>
  </div>
</template>

<script setup>
import PromoterIdHeader from "@/promotion/components/promoters/PromoterIdHeader.vue";
import PromoterEventList from "@/promotion/components/promoters/PromoterEventList.vue";
import { useEventsStore } from "@/promotion/store/events";
import { usePromotersStore } from "@/promotion/store/promoters";
import { onMounted } from "vue";
import { storeToRefs } from "pinia";

const props = defineProps(["id", "entity"]);
const eventsStore = useEventsStore();
const promotersStore = usePromotersStore();
const { promoter } = storeToRefs(promotersStore);
const { event } = storeToRefs(eventsStore);

onMounted(async () => {
  await promotersStore.getPromoterById(props.id);
});
</script>
