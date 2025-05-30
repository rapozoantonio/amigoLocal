<template>
  <v-dialog v-model="isVisible" max-width="800" max-height="90vh">
    <v-card class="bulk-modal-card">
      <v-toolbar flat color="primary" dark>
        <v-toolbar-title>
          <template v-if="step === 'input'">
            Adicionar Convidados (Bulk)
          </template>
          <template v-else> Pré-Visualização de Convidados </template>
        </v-toolbar-title>
        <v-spacer />
        <v-btn icon @click="closeModal">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-toolbar>

      <v-card-text class="bulk-modal-content">
        <v-row dense>
          <!-- Input Step  -->
          <template v-if="step === 'input'">
            <v-col cols="12">
              <v-autocomplete v-model="selectedList" clearable return-object item-value="id" item-title="name"
                :items="listOptions" label="Lista" variant="outlined" hide-details class="mb-1" />
            </v-col>
            <v-col cols=" 12">
              <v-textarea v-model="inputText" label="Convidados (cole os nomes ou dados em formato livre)"
                variant="outlined" rows="10" hide-details />
            </v-col>
          </template>

          <!-- Preview Step -->
          <v-col v-else cols="12">
            <div>
              <v-row>
                <v-col cols="12">
                  <p class="preview-info mb-3">
                    Confira os convidados abaixo. Use o ícone de lápis ao lado do nome
                    para editar e toque no botão de gênero para alternar entre masculino
                    e feminino.
                  </p>
                </v-col>
              </v-row>
              <v-row>
                <v-col cols="12">
                  <div v-if="xs || sm">
                    <bulk-add-guest-card v-model:guest="finalGuests[index]" v-for="(guest, index) in finalGuests"
                      :eventId="eventId" :key="guest.name" :index="index" v-model:status="statusOkGuests[index]"
                      @guest:remove="removeGuest"></bulk-add-guest-card>
                  </div>
                  <v-table v-else dense class="preview-table">
                    <thead>
                      <tr>
                        <th class="num-col text-center">#</th>
                        <th class="name-col">Nome</th>
                        <th class="gender-col text-center">Gênero</th>
                        <th class="gender-col text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <bulk-add-guest-item v-model:guest="finalGuests[index]" v-for="(guest, index) in finalGuests"
                        :eventId="eventId" :key="guest.name" :index="index" v-model:status="statusOkGuests[index]"
                        @guest:remove="removeGuest"></bulk-add-guest-item>
                    </tbody>

                  </v-table>
                </v-col>
              </v-row>
            </div>
          </v-col>
          <v-col cols="12" v-if="errors">
            <v-alert type="error" density="compact" variant="tonal">{{ !errors ? "" : errors }}</v-alert>
          </v-col>
        </v-row>
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <template v-if="step === 'preview'">
          <v-btn text color="grey-darken-1" @click="backToInput">Voltar</v-btn>
          <v-btn color="primary" :disabled="!statusOkGuests.every(g => g) || !formValid" :loading="processing"
            :variant="formValid ? 'elevated' : 'tonal'" @click="confirmImport">
            Confirmar Importação
          </v-btn>
        </template>
        <template v-else>
          <v-btn color="grey-darken-1" @click="closeModal">Cancelar</v-btn>
          <v-btn color="primary" :disabled="!formValid" :loading="processing" @click="processInput"
            :variant="formValid ? 'elevated' : 'tonal'">
            Adicionar
          </v-btn>
        </template>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed, watch } from "vue";
import { useChatgptStore } from "@/core/store/chatgpt";
import { useEventListStore } from "@/management/store/eventList";
import BulkAddGuestItem from "./BulkAddGuestItem.vue";
import BulkAddGuestCard from "./BulkAddGuestCard.vue";
import { toRefs } from "vue";
import { useDisplay } from "vuetify/lib/framework.mjs";
const props = defineProps({
  modelValue: { type: Boolean, default: false },
  listOptions: { type: Array, default: () => [] },
  existingGuests: { type: Array, default: () => [] },
  defaultList: { type: [String, Object], default: "" },
  eventId: { type: String, default: "" }
});

const { existingGuests } = toRefs(props);

const emit = defineEmits(["update:modelValue", "guestsAdded"]);
const chatgptStore = useChatgptStore();
const eventListStore = useEventListStore();
const { xs, sm } = useDisplay();
const isVisible = computed({
  get: () => props.modelValue,
  set: (val) => emit("update:modelValue", val),
});

// Steps: "input" or "preview"
const step = ref("input");

const selectedList = ref(props.defaultList);
watch(
  () => props.defaultList,
  (newVal) => {
    selectedList.value = newVal;
  },
  { immediate: true }
);

const inputText = ref("");
const processing = ref(false);
// const formValid = ref(false);
const finalGuests = ref([]);
const statusOkGuests = ref([]);

const errors = computed(() => {
  if (!selectedList.value) {
    return "Selecione uma lista";
  }
  // parsedGuests
  const guestsFromSelectedList = existingGuests.value.filter((guest) => guest.list?.id === selectedList.value.id);
  const quota = selectedList.value.quota;

  if (!quota || quota === 0) {
    return false;
  }
  if (guestsFromSelectedList.length >= quota) {
    return "Essa lista ja atingiu a quota estabelecida";
  }
  if ((guestsFromSelectedList.length + parsedGuests.value.length) > quota) {
    const spareGuests = (guestsFromSelectedList.length + parsedGuests.value.length) - quota;
    const stayGuests = parsedGuests.value.length - spareGuests;
    return "Não cabem todos esses convidados na lista, somente podem entrar " + stayGuests
  }
  return false;
})

// Array for preview: parsed guests with extra 'gender' field.
const parsedGuests = ref([]);

// For inline editing – store currently editing row index.
const editingIndex = ref(null);


// // Validate: require nonempty input and selected list.
// watch([inputText, selectedList], () => {
//   formValid.value = inputText.value.trim().length > 0 && !!selectedList.value;
// });

const formValid = computed(() => {
  if (errors.value || inputText.value.trim().length <= 0) {
    return false;
  }
  return true;

});

/**
 * Parses a single line of input into a guest object.
 * Expected fields: name, instagram, email, phone, taxId.
 * Returns an object with an extra 'gender' property (initially blank).
 */
const parseLineToGuest = (line) => {
  const trimmed = line.trim();
  if (!trimmed) return null;
  if (!trimmed.includes(" ")) {
    return {
      name: trimmed,
      instagram: "",
      email: "",
      phone: "",
      taxId: "",
      list: selectedList.value,
      gender: "",
    };
  }
  const tokens = trimmed.split(/\s+/);
  let guest = {
    name: tokens[0],
    instagram: "",
    email: "",
    phone: "",
    taxId: "",
    list: selectedList.value,
    gender: "",
  };
  let nameTokens = [];
  for (const token of tokens) {
    if (
      token.startsWith("@") ||
      /.+@.+\..+/.test(token) ||
      /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(token) ||
      /^\(?\d{2,}\)?[-.\s]?\d+/.test(token)
    ) {
      break;
    }
    nameTokens.push(token);
  }
  if (nameTokens.length) guest.name = nameTokens.join(" ");
  const insta = tokens.find((t) => t.startsWith("@"));
  if (insta) guest.instagram = insta;
  const email = tokens.find((t) => /.+@.+\..+/.test(t));
  if (email) guest.email = email;
  const taxId = tokens.find((t) => /^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(t));
  if (taxId) guest.taxId = taxId;
  const phone = tokens.find((t) => /^\(?\d{2,}\)?[-.\s]?\d+/.test(t));
  if (phone) guest.phone = phone;
  return guest;
};

const processInput2 = () => {
  processing.value = true;
  const lines = inputText.value
    .split(/\n|,/)
    .map((l) => l.trim())
    .filter((l) => l.length > 0);
  const newGuests = [];
  lines.forEach((line) => {
    const guest = parseLineToGuest(line);
    if (guest) newGuests.push(guest);
  });
  // Merge new guests with existing ones (update if same name exists, case-insensitive)
  const mergedGuests = [...props.existingGuests];
  newGuests.forEach((newGuest) => {
    const idx = mergedGuests.findIndex(
      (g) => g.name.toLowerCase() === newGuest.name.toLowerCase()
    );
    if (idx !== -1) {
      mergedGuests[idx] = { ...mergedGuests[idx], ...newGuest };
    } else {
      mergedGuests.push(newGuest);
    }
  });
  console.log("Parsed/Merged Guests:", mergedGuests);
  parsedGuests.value = mergedGuests;
  processing.value = false;
  step.value = "preview";
};


const toggleGender = (index) => {
  const current = parsedGuests.value[index].gender;
  parsedGuests.value[index].gender =
    current === "Feminino" ? "Masculino" : "Feminino";
};

const confirmImport = () => {
  const newGuests = parsedGuests.value.map((g) => ({ ...g, list: { name: selectedList.value?.name, id: selectedList.value?.id } }))
  processing.value = true;
  console.log("Final Guests:", newGuests);
  emit("guestsAdded", newGuests);
  inputText.value = "";
  parsedGuests.value = [];
  processing.value = false;
  step.value = "input";
  isVisible.value = false;
};

const backToInput = () => {
  step.value = "input";
};

const closeModal = () => {
  isVisible.value = false;
  step.value = "input";
  inputText.value = "";
  parsedGuests.value = [];
  processing.value = false;
  editingIndex.value = null;
};

const enableEditing = (index) => {
  editingIndex.value = index;
};

const disableEditing = () => {
  editingIndex.value = null;
};

function removeGuest(index) {
  parsedGuests.value.splice(index, 1);
  statusOkGuests.value.splice(index, 1);
}

async function processInput() {

  try {
    processing.value = true;
    const response = await chatgptStore.getGuestList(inputText.value);
    console.log("chatgpt", { response });
    if (response.choices && response.choices.length > 0) {
      const content = JSON.parse(response.choices[0].message.content);
      console.log({ content });

      parsedGuests.value = Array.isArray(content) ? content : [content];
      processing.value = false;
      step.value = "preview";

      // const promisesExistInEvent = parsedGuests.value.map(async (g) => {
      //   return await eventListStore.checkIfGuestExistsInServer(g, props.eventId)
      // })

      // const promisesExistCustomer = parsedGuests.value.map(async (g) => {
      //   return await eventListStore.checkIfCustomerExists(g)
      // })


      // const resultExistInEvent = await Promise.all(promisesExistInEvent);
      // const resultExistCustomer = await Promise.all(promisesExistCustomer);

      // finalGuests.value = parsedGuests.value.map((g, i) => {


      //   return {
      //     guest: g,
      //     existingGuest: resultExistInEvent[i].result,
      //     existingCustomer: resultExistCustomer[i].result
      //   }
      // })


      finalGuests.value = parsedGuests.value;
      statusOkGuests.value = parsedGuests.value.map(() => (false));

    }
  } catch (error) {
    console.log({ error })
  }
  finally {
    processing.value = false;
  }




}





</script>
