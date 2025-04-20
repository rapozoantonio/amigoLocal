<template>
  <v-dialog
    v-model="dialogVisible"
    fullscreen
    :scrim="true"
    transition="dialog-bottom-transition"
    :retain-focus="false"
  >
    <v-card class="new-event-modal">
      <!-- Modal header with close button -->
      <v-toolbar dark color="primary">
        <v-btn icon @click="closeDialog" class="me-2">
          <v-icon>mdi-close</v-icon>
        </v-btn>
        <v-toolbar-title>Novo Evento</v-toolbar-title>
        <v-spacer></v-spacer>
      </v-toolbar>

      <!-- Loading overlay -->
      <v-overlay
        :model-value="loading"
        class="align-center justify-center"
        persistent
      >
        <v-progress-circular
          indeterminate
          color="primary"
        ></v-progress-circular>
      </v-overlay>

      <!-- Form content -->
      <v-card-text class="pt-4">
        <v-form ref="form" v-model="formValid" @submit.prevent="saveEvent">
          <v-container>
            <!-- Event name -->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="eventData.name"
                  :rules="nameRules"
                  label="Nome do evento"
                  placeholder="Digite o nome do evento"
                  required
                  variant="outlined"
                  density="comfortable"
                  bg-color="surface"
                  autofocus
                  hide-details="auto"
                  class="mb-3"
                ></v-text-field>
              </v-col>
            </v-row>

            <!-- Date and Time -->
            <v-row>
              <v-col cols="12" sm="6">
                <v-menu
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  location="bottom"
                  transition="scale-transition"
                  min-width="auto"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="formattedDate"
                      label="Data"
                      readonly
                      v-bind="props"
                      :rules="dateRules"
                      variant="outlined"
                      hide-details="auto"
                      prepend-inner-icon="mdi-calendar"
                      class="mb-3"
                    ></v-text-field>
                  </template>
                  <v-date-picker
                    v-model="eventData.date"
                    @update:model-value="dateMenu = false"
                    min="2023-01-01"
                  ></v-date-picker>
                </v-menu>
              </v-col>

              <v-col cols="12" sm="6">
                <v-menu
                  v-model="timeMenu"
                  :close-on-content-click="false"
                  location="bottom"
                  transition="scale-transition"
                  min-width="auto"
                >
                  <template v-slot:activator="{ props }">
                    <v-text-field
                      v-model="eventData.time"
                      label="Horário"
                      readonly
                      v-bind="props"
                      :rules="timeRules"
                      variant="outlined"
                      hide-details="auto"
                      prepend-inner-icon="mdi-clock-outline"
                      class="mb-3"
                    ></v-text-field>
                  </template>
                  <v-time-picker
                    v-model="eventData.time"
                    @update:model-value="timeMenu = false"
                    format="24hr"
                  ></v-time-picker>
                </v-menu>
              </v-col>
            </v-row>

            <!-- Location -->
            <v-row>
              <v-col cols="12">
                <v-text-field
                  v-model="eventData.location"
                  :rules="locationRules"
                  label="Local"
                  placeholder="Digite o local do evento"
                  required
                  variant="outlined"
                  density="comfortable"
                  hide-details="auto"
                  prepend-inner-icon="mdi-map-marker"
                  class="mb-3"
                ></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-form>
      </v-card-text>

      <!-- Action buttons -->
      <v-divider></v-divider>
      <v-card-actions class="pa-4">
        <v-row>
          <!-- On smaller screens, stack buttons -->
          <v-col
            cols="12"
            sm="6"
            class="d-flex justify-center justify-sm-start mb-2 mb-sm-0"
          >
            <v-btn
              color="primary"
              variant="flat"
              width="100%"
              :disabled="!formValid || loading"
              @click="saveAndContinue"
              class="text-none"
            >
              <v-icon start>mdi-content-save</v-icon>
              Salvar e continuar
            </v-btn>
          </v-col>
          <v-col cols="12" sm="6" class="d-flex justify-center justify-sm-end">
            <v-btn
              color="grey-darken-1"
              variant="flat"
              width="100%"
              :disabled="!formValid || loading"
              @click="saveAndClose"
              class="text-none"
            >
              <v-icon start>mdi-content-save-outline</v-icon>
              Salvar e fechar
            </v-btn>
          </v-col>
        </v-row>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch, nextTick } from "vue";
import { useRouter } from "vue-router";

const props = defineProps({
  modelValue: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["update:modelValue", "saved"]);
const router = useRouter();

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

// Form data
const eventData = ref({
  name: "",
  date: new Date().toISOString().substr(0, 10), // Current date in YYYY-MM-DD format
  time: "20:00", // Default time
  location: "",
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

// Methods
const resetForm = () => {
  eventData.value = {
    name: "",
    date: new Date().toISOString().substr(0, 10),
    time: "20:00",
    location: "",
  };

  // Reset validation
  if (form.value) {
    form.value.resetValidation();
  }
};

const closeDialog = () => {
  dialogVisible.value = false;
  resetForm();
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
    const newEvent = {
      name: eventData.value.name,
      date: datetime,
      location: eventData.value.location,
      status: "upcoming",
      totalGuests: 0,
      checkInCount: 0,
      vipListsCount: 0,
      promotersCount: 0,
      revenue: 0,
      revenuePrediction: 0,
    };

    // In a real app, this would be an API call
    // await eventService.createEvent(newEvent);
    console.log("Event created:", newEvent);

    // Emit saved event with mock ID for demo
    const savedEvent = { ...newEvent, id: Date.now() };
    emit("saved", savedEvent);

    return savedEvent;
  } catch (error) {
    console.error("Error creating event:", error);
    // Handle error (show toast notification, etc.)
    return null;
  } finally {
    loading.value = false;
  }
};

const saveAndContinue = async () => {
  const savedEvent = await saveEvent();
  if (savedEvent) {
    // Navigate to the event details page
    router.push(`/event/${savedEvent.id}`);
    closeDialog();
  }
};

const saveAndClose = async () => {
  const savedEvent = await saveEvent();
  if (savedEvent) {
    closeDialog();
  }
};

// Reset form when dialog opens
watch(dialogVisible, (newValue) => {
  if (newValue) {
    nextTick(() => {
      if (form.value) {
        resetForm();
      }
    });
  }
});
</script>