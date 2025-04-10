<template>
  <v-data-table
    :headers="headers"
    :items="eventsData"
    :sort-by="[{ key: 'startDate', order: 'asc' }]"
    density="compact"
  >
    <template v-slot:top>
      <v-toolbar flat density="compact">
        <v-toolbar-title class="text-subtitle-1">Seus Eventos</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialogDelete" max-width="90vw">
          <v-card>
            <v-card-text class="pa-4">
              Tem certeza que deseja excluir este evento?
            </v-card-text>
            <v-card-actions class="pa-4">
              <v-spacer></v-spacer>
              <v-btn variant="text" size="small" @click="closeDelete"
                >Não</v-btn
              >
              <v-btn color="error" size="small" @click="deleteItemConfirm"
                >Sim</v-btn
              >
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>

    <template v-slot:item.actions="{ item }">
      <v-btn
        icon="mdi-delete"
        size="x-small"
        variant="text"
        color="error"
        @click="deleteItem(item)"
        :loading="loading && itemToDelete?.id === item.id"
      ></v-btn>
    </template>

    <template v-slot:no-data>
      <span class="text-subtitle-2">Nenhum evento encontrado</span>
    </template>
  </v-data-table>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { storeToRefs } from "pinia";
import { useEventsStore } from "@/promotion/store/events";
import { useUserStore } from "@/promotion/store/user"; 
import { useEventStore } from "@/promotion/store/event";
import { useAppStore } from "@/promotion/store/app";

const props = defineProps(["id"]);

// Store setups
const eventsStore = useEventsStore();
const eventStore = useEventStore();
const userStore = useUserStore();
const { events } = storeToRefs(eventsStore);
const { promoter } = storeToRefs(userStore); 
const appStore = useAppStore();
const { loading } = storeToRefs(appStore);

const itemToDelete = ref(null);
const dialogDelete = ref(false);

const headers = [
  {
    title: "Nome",
    align: "start",
    key: "name",
    width: "65%",
  },
  {
    title: "Data",
    key: "startDate", // Changed to match the store data structure
    width: "30%",
  },
  {
    title: "Ações",
    key: "actions",
    sortable: false,
    width: "5%",
  },
];

// Transform events data for the table
const eventsData = computed(() => {
  if (!events.value) return [];

  return events.value.map((event) => ({
    id: event.id,
    name: truncateText(event.name),
    startDate: new Date(event.startDate).toLocaleDateString('pt-BR'),
  }));
});

// Fetch events on component mount using promoter ID from user store
onMounted(async () => {
  try {
    if (promoter.value?.id) {
      await eventsStore.getEventsByPromoterId(promoter.value.id);
    }
  } catch (error) {
    console.error("Failed to fetch events:", error);
  }
});

function truncateText(text, limit = 25) {
  return text.length > limit ? text.slice(0, limit) + '...' : text;
}

function deleteItem(item) {
  itemToDelete.value = item;
  dialogDelete.value = true;
}

async function deleteItemConfirm() {
  if (itemToDelete.value) {
    try {
      const response = await eventStore.deleteEvent(itemToDelete.value.id);
      if (response.ok) {
        // Update local events list by filtering out the deleted event
        eventsStore.removeEventFromList(itemToDelete.value.id);
      } else {
        console.error("Failed to delete event");
      }
    } catch (error) {
      console.error("Error during event deletion:", error);
    }
  }
  closeDelete();
}

function closeDelete() {
  dialogDelete.value = false;
  itemToDelete.value = null;
}
</script>

<style scoped>
:deep(.v-data-table) {
  font-size: 0.875rem;
}

:deep(.v-data-table-header) {
  background-color: #f5f5f5;
}
</style>