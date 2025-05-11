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
        <!-- Input Step -->
        <div v-if="step === 'input'">
          <v-form ref="bulkForm" v-model="formValid">
            <v-autocomplete v-model="selectedList" return-object item-value="id" item-title="name" :items="listOptions"
              label="Lista" variant="outlined" hide-details class="mb-4" />
            <v-textarea v-model="inputText" label="Convidados (cole os nomes ou dados em formato livre)"
              variant="outlined" rows="10" hide-details />
          </v-form>
        </div>

        <!-- Preview Step -->
        <div v-else>
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
              <v-table dense class="preview-table">
                <thead>
                  <tr>
                    <th class="num-col text-center">#</th>
                    <th class="name-col">Nome</th>
                    <th class="gender-col text-center">Gênero</th>
                    <th class="gender-col text-center">Status</th>
                  </tr>
                </thead>
                <tbody v-if="false">
                  <tr v-for="(guest, index) in parsedGuests" :key="index">
                    <td class="num-col text-center">{{ index + 1 }}</td>
                    <td class="name-col">
                      <div class="editable-row">
                        <div v-if="editingIndex === index" class="edit-input">
                          <v-text-field v-model="guest.name" dense hide-details solo autofocus @blur="disableEditing"
                            @keyup.enter="disableEditing" />
                        </div>
                        <div v-else class="editable-content">
                          <span>{{ guest.name }}</span>
                          <v-btn icon size="x-small" class="edit-icon ml-4" @click.stop="enableEditing(index)">
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </td>
                    <td class="gender-col text-center">
                      <v-btn icon @click="toggleGender(index)" size="small" :color="guest.gender === 'Feminino'
                        ? 'pink'
                        : guest.gender === 'Masculino'
                          ? 'blue'
                          : 'grey'
                        ">
                        <v-icon>
                          {{
                            guest.gender === "Feminino"
                              ? "mdi-gender-female"
                              : "mdi-gender-male"
                          }}
                        </v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>

                <tbody v-if="false">
                  <tr v-for="(final, index) in finalGuests" :key="index">
                    <td class="num-col text-center">{{ index + 1 }}</td>
                    <td class="name-col">
                      <div class="editable-row">
                        <div v-if="editingIndex === index" class="edit-input">
                          <v-text-field v-model="final.guest.name" dense hide-details solo autofocus
                            @blur="disableEditing" @keyup.enter="disableEditing" />
                        </div>
                        <div v-else class="editable-content">
                          <span>{{ final.guest.name }}</span>



                          <v-chip v-if="final.existingGuest && final.existingGuest.length > 0">
                            Convidado ja existe em outra lista

                            <v-menu activator="parent" location="top">
                              <v-card variant="tonal">

                                <v-list>
                                  <template #prepend>
                                    <p>{{ final.existingGuest[0].name }}</p>
                                  </template>
                                  <v-list-item>
                                    <v-list-item-title>ja exus</v-list-item-title>
                                  </v-list-item>
                                </v-list>
                              </v-card>

                            </v-menu>
                          </v-chip>
                          <v-chip v-if="final.existingCustomer && final.existingCustomer.length > 0">
                            Esse convidado ja é um usuario

                            <v-menu activator="parent">

                              <v-list> <template #prepend>
                                  <p>{{ final.existingCustomer[0].name }}</p>
                                </template>
                                <v-list-item>
                                  <v-list-item-title>Test</v-list-item-title>
                                </v-list-item>
                              </v-list>
                            </v-menu>
                          </v-chip>
                          <v-btn icon size="x-small" class="edit-icon ml-4" @click.stop="enableEditing(index)">
                            <v-icon>mdi-pencil</v-icon>
                          </v-btn>
                        </div>
                      </div>
                    </td>
                    <td class="gender-col text-center">
                      <v-btn icon @click="toggleGender(index)" size="small" :color="final.guest.gender === 'Feminino'
                        ? 'pink'
                        : final.guest.gender === 'Masculino'
                          ? 'blue'
                          : 'grey'
                        ">
                        <v-icon>
                          {{
                            final.guest.gender === "Feminino"
                              ? "mdi-gender-female"
                              : "mdi-gender-male"
                          }}
                        </v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>

                <tbody>
                  <bulk-add-guest-item v-model:guest="finalGuests[index]" v-for="(guest, index) in finalGuests"
                    :eventId="eventId" :key="guest.name" :index="index" v-model:status="statusOkGuests[index]"
                    @guest:remove="removeGuest"></bulk-add-guest-item>
                </tbody>

              </v-table>
            </v-col>
          </v-row>


        </div>
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <template v-if="step === 'preview'">
          <v-btn text color="grey-darken-1" @click="backToInput">Voltar</v-btn>
          <v-btn color="primary" :disabled="processing || !statusOkGuests.every(g => g)" @click="confirmImport">
            <v-icon left v-if="processing" spin>mdi-loading</v-icon>
            Confirmar Importação
          </v-btn>
        </template>
        <template v-else>
          <v-btn text color="grey-darken-1" @click="closeModal">Cancelar</v-btn>
          <v-btn color="primary" :disabled="!formValid || processing" @click="processInput">
            <v-icon left v-if="processing" spin>mdi-loading</v-icon>
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

const props = defineProps({
  modelValue: { type: Boolean, default: false },
  listOptions: { type: Array, default: () => [] },
  existingGuests: { type: Array, default: () => [] },
  defaultList: { type: [String, Object], default: "" },
  eventId: { type: String, default: "" }
});

const emit = defineEmits(["update:modelValue", "guestsAdded"]);
const chatgptStore = useChatgptStore();
const eventListStore = useEventListStore();

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
const formValid = ref(false);
const finalGuests = ref([]);
const statusOkGuests = ref([]);

// Array for preview: parsed guests with extra 'gender' field.
const parsedGuests = ref([]);

// For inline editing – store currently editing row index.
const editingIndex = ref(null);


// Validate: require nonempty input and selected list.
watch([inputText, selectedList], () => {
  formValid.value = inputText.value.trim().length > 0 && !!selectedList.value;
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




}





</script>
