<template>
  <v-dialog v-model="dialogVisible" :fullscreen="$vuetify.display.xs"
    :max-width="$vuetify.display.xs ? '100%' : '600px'" :scrim="true" transition="dialog-bottom-transition"
    :retain-focus="false">
    <v-card class="edit-event-modal">
      <!-- Modal header with close button -->
      <v-toolbar dark color="primary">
        <v-btn icon @click="closeDialog" class="me-2">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Editar Evento</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <!-- Loading overlay -->
      <v-overlay :model-value="loading" class="align-center justify-center" persistent>
        <v-progress-circular indeterminate color="primary"></v-progress-circular>
      </v-overlay>

      <!-- Form content -->
      <v-card-text class="pt-4">
        <v-form ref="form" v-model="formValid" @submit.prevent="saveEvent">
          <v-container>
            <!-- Event name -->
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="eventData.name" :rules="nameRules" label="Nome do evento"
                  placeholder="Digite o nome do evento" required variant="outlined" density="comfortable"
                  bg-color="surface" autofocus hide-details="auto" class="mb-3"></v-text-field>
              </v-col>
            </v-row>

            <!-- Date and Time -->
            <v-row>
              <v-col cols="12" sm="6">
                <v-menu v-model="dateMenu" :close-on-content-click="false" location="bottom"
                  transition="scale-transition" min-width="auto">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-model="formattedDate" label="Data" readonly v-bind="props" :rules="dateRules"
                      variant="outlined" hide-details="auto" prepend-inner-icon="mdi-calendar"
                      class="mb-3"></v-text-field>
                  </template>
                  <v-date-picker v-model="eventData.date" @update:model-value="dateMenu = false"
                    min="2023-01-01"></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" sm="6">
                <v-menu v-model="timeMenu" :close-on-content-click="false" location="bottom"
                  transition="scale-transition" min-width="auto">
                  <template v-slot:activator="{ props }">
                    <v-text-field v-model="eventData.time" label="Horário" readonly v-bind="props" :rules="timeRules"
                      variant="outlined" hide-details="auto" prepend-inner-icon="mdi-clock-outline"
                      class="mb-3"></v-text-field>
                  </template>
                  <v-time-picker v-model="eventData.time" @update:model-value="timeMenu = false"
                    format="24hr"></v-time-picker>
                </v-menu>
              </v-col>
            </v-row>

            <!-- Location -->
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="eventData.location" :rules="locationRules" label="Local"
                  placeholder="Digite o local do evento" required variant="outlined" density="comfortable"
                  hide-details="auto" prepend-inner-icon="mdi-map-marker" class="mb-3"></v-text-field>
              </v-col>
            </v-row>

            <!-- Status selector -->
            <v-row>
              <v-col cols="12">
                <v-select v-model="eventData.status" :items="statusOptions" :rules="statusRules" label="Status"
                  variant="outlined" density="comfortable" hide-details="auto" prepend-inner-icon="mdi-tag"
                  class="mb-3"></v-select>
              </v-col>
            </v-row>

            <!-- Revenue prediction -->
            <v-row>
              <v-col cols="12">
                <v-text-field v-model="eventData.revenuePrediction" label="Meta de receita (R$)"
                  placeholder="Digite a meta de receita" variant="outlined" density="comfortable" hide-details="auto"
                  prepend-inner-icon="mdi-currency-usd" type="number" class="mb-3"></v-text-field>
              </v-col>
            </v-row>

            <!-- Image upload -->
            <v-row>
              <v-col cols="12">
                <v-file-input v-model="eventData.thumbnailFile" label="Imagem de capa" variant="outlined"
                  density="comfortable" hide-details="auto" prepend-inner-icon="mdi-image" accept="image/*" class="mb-3"
                  placeholder="Selecione uma imagem" truncate-length="15">
                  <template v-slot:selection="{ fileNames }">
                    <template v-for="(fileName, index) in fileNames" :key="index">
                      <v-chip size="small" label color="primary" class="me-2">
                        {{ fileName }}
                      </v-chip>
                    </template>
                  </template>
                </v-file-input>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <!-- Action buttons -->
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-spacer></v-spacer>
        <v-btn color="grey-darken-1" variant="text" @click="closeDialog" :disabled="loading">
          Cancelar
        </v-btn>
        <v-btn color="primary" variant="flat" :disabled="!formValid || loading" @click="saveEvent">
          Salvar alterações
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
  event: {
    type: Object,
    required: true,
  },
});

const emit = defineEmits(["update:modelValue", "saved"]);
const { xs } = useDisplay();

// Dialog visibility state
const dialogVisible = computed({
  get: () => props.modelValue,
  set: (value) => emit("update:modelValue", value),
});

// Form references and validation
const form = ref(null);
const formValid = ref(false);
const loading = ref(false);

// Date and time pickers
const dateMenu = ref(false);
const timeMenu = ref(false);

// Status options
const statusOptions = [
  { title: "Em breve", value: "upcoming" },
  { title: "Ao vivo", value: "live" },
  { title: "Realizado", value: "completed" },
  { title: "Cancelado", value: "cancelled" },
];

// Form data - initialize with event data
const eventData = ref({
  name: "",
  date: "",
  time: "",
  location: "",
  status: "upcoming",
  revenuePrediction: 0,
  thumbnailFile: null,
});

// Format date for display
const formattedDate = computed(() => {
  if (!eventData.value.date) return "";
  const [year, month, day] = eventData.value.date.split("-");
  return `${day}/${month}/${year}`;
});

// Validation rules
const nameRules = [
  (v) => !!v || "Nome é obrigatório",
  (v) => (v && v.length >= 3) || "Nome deve ter pelo menos 3 caracteres",
];

const dateRules = [(v) => !!v || "Data é obrigatória"];

const timeRules = [(v) => !!v || "Horário é obrigatório"];

const locationRules = [
  (v) => !!v || "Local é obrigatório",
  (v) => (v && v.length >= 3) || "Local deve ter pelo menos 3 caracteres",
];

const statusRules = [(v) => !!v || "Status é obrigatório"];

// Methods
const initializeForm = () => {
  const eventDate = new Date(props.event.date);

  eventData.value = {
    name: props.event.name || "",
    date: eventDate.toISOString().substr(0, 10),
    time: eventDate.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    }),
    location: props.event.location || "",
    status: props.event.status || "upcoming",
    revenuePrediction: props.event.revenuePrediction || 0,
    thumbnailFile: null,
  };

  // Reset validation
  if (form.value) {
    form.value.resetValidation();
  }
};

const closeDialog = () => {
  dialogVisible.value = false;
};

const validateForm = async () => {
  if (!form.value) return false;
  // Validate form
  const { valid } = await form.value.validate();
  return valid;
};

const saveEvent = async () => {
  if (!(await validateForm())) return;

  loading.value = true;

  try {
    // Prepare the event data
    const datetime = new Date(
      `${eventData.value.date}T${eventData.value.time}`
    );

    // Create the event object to be saved
    const updatedEvent = {
      ...props.event,
      name: eventData.value.name,
      date: datetime,
      location: eventData.value.location,
      status: eventData.value.status,
      revenuePrediction: parseFloat(eventData.value.revenuePrediction) || 0,
    };

    // In a real app, this would be an API call to update the event
    // await eventService.updateEvent(updatedEvent.id, updatedEvent);
    console.log("Event updated:", updatedEvent);

    // Handle file upload if a new thumbnail was selected
    if (eventData.value.thumbnailFile) {
      // In a real app, upload the file to your storage service
      // const uploadResult = await fileUploadService.uploadEventThumbnail(updatedEvent.id, eventData.value.thumbnailFile);
      // updatedEvent.thumbnail = uploadResult.url;
      console.log("Would upload thumbnail:", eventData.value.thumbnailFile);
    }

    // Emit saved event with updated data
    emit("saved", updatedEvent);
    closeDialog();
  } catch (error) {
    console.error("Error updating event:", error);
    // Handle error (show toast notification, etc.)
  } finally {
    loading.value = false;
  }
};

// Initialize form when dialog opens or event changes
watch(
  () => [dialogVisible.value, props.event],
  () => {
    if (dialogVisible.value) {
      nextTick(() => {
        initializeForm();
      });
    }
  },
  { immediate: true }
);
</script>
