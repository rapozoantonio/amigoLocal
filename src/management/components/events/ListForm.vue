<template>
  <v-form v-model="formValid" @submit.prevent="save">
    <v-text-field
      v-model="listForm.name"
      label="Nome da lista"
      :rules="[(v) => !!v || 'Nome é obrigatório']"
      variant="outlined"
      class="mb-3"
      aria-required="true"
    />
    <v-text-field
      v-model.number="listForm.quota"
      label="Cota"
      type="number"
      min="0"
      variant="outlined"
      class="mb-3"
    />
    <v-text-field
      v-model="listForm.owner"
      label="Responsável"
      variant="outlined"
      class="mb-3"
    />
    <v-checkbox
      v-model="listForm.hasCutoff"
      label="Definir horário de corte"
      class="mb-3"
    />
    <v-text-field
      v-if="listForm.hasCutoff"
      v-model="listForm.cutoffTime"
      label="Horário de corte"
      type="time"
      variant="outlined"
      class="mb-3"
    />
    <v-select
      v-model="listForm.bracelet"
      :items="['Ouro', 'Prata', 'Bronze']"
      label="Pulseira"
      variant="outlined"
      class="mb-3"
    />
    <v-textarea
      v-model="listForm.notes"
      label="Notas"
      variant="outlined"
      rows="2"
      class="mb-3"
    />
    <v-card-actions>
      <v-spacer />
      <v-btn
        color="grey-darken-1"
        variant="text"
        @click="emit('close')"
        :disabled="submitting"
      >
        Cancelar
      </v-btn>
      <v-btn
        color="primary"
        type="submit"
        :disabled="!formValid || submitting"
        :loading="submitting"
      >
        {{ editMode ? "Salvar Alterações" : "Criar Lista" }}
      </v-btn>
    </v-card-actions>
  </v-form>
</template>

<script setup>
import { ref, watch } from "vue";

const props = defineProps({
  list: { type: Object, default: null },
  editMode: { type: Boolean, default: false },
  submitting: { type: Boolean, default: false },
});

const emit = defineEmits(["save", "close"]);

const formValid = ref(false);
const listForm = ref({
  name: "",
  quota: 0,
  owner: "Gerente",
  hasCutoff: false,
  cutoffTime: "",
  bracelet: "Ouro",
  active: true,
  notes: "",
});

const save = () => {
  emit("save", { ...listForm.value });
};

watch(
  () => props.list,
  (newVal) => {
    if (newVal) {
      listForm.value = { ...newVal };
    } else {
      listForm.value = {
        name: "",
        quota: 0,
        owner: "Gerente",
        hasCutoff: false,
        cutoffTime: "",
        bracelet: "Ouro",
        active: true,
        notes: "",
      };
    }
  },
  { immediate: true }
);
</script>
