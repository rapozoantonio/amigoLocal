<template>
    <v-dialog
      v-model="dialogVisible"
      :fullscreen="isMobile"
      max-width="600"
      transition="dialog-bottom-transition"
      :retain-focus="false"
    >
      <v-card>
        <!-- Header -->
        <v-toolbar dark :color="headerColor" flat>
          <v-btn icon @click="closeDialog" class="me-2">
            <v-icon>mdi-close</v-icon>
          </v-btn>
          <v-toolbar-title>{{ modalTitle }}</v-toolbar-title>
          <v-spacer></v-spacer>
        </v-toolbar>
  
        <!-- Loading overlay -->
        <v-overlay :model-value="loading" class="align-center justify-center" persistent>
          <v-progress-circular indeterminate color="primary" />
        </v-overlay>
  
        <!-- Form Content -->
        <v-card-text>
          <v-form ref="form" v-model="formValid" @submit.prevent="saveEntity">
            <v-container fluid>
              <!-- Hostess Form -->
              <template v-if="mode === 'hostess'">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="entityData.search"
                      label="Buscar Hostess (nome, e-mail ou telefone)"
                      placeholder="Digite para buscar..."
                      variant="outlined"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="entityData.name"
                      label="Nome completo"
                      :rules="[v => !!v || 'Nome é obrigatório']"
                      variant="outlined"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="entityData.phone"
                      label="Telefone"
                      :rules="[v => !!v || 'Telefone é obrigatório']"
                      variant="outlined"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-select
                      v-model="entityData.area"
                      :items="areaOptions"
                      label="Área de atuação (opcional)"
                      variant="outlined"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="entityData.startTime"
                      label="Horário de entrada (opcional)"
                      type="time"
                      variant="outlined"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="entityData.endTime"
                      label="Horário de saída (opcional)"
                      type="time"
                      variant="outlined"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="entityData.payment"
                      label="Pagamento (opcional)"
                      type="number"
                      variant="outlined"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-switch
                      v-model="entityData.confirmed"
                      label="Presença confirmada / Ativo"
                      hide-details
                      class="mb-3"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="entityData.notes"
                      label="Observações (opcional)"
                      variant="outlined"
                      rows="3"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                </v-row>
              </template>
  
              <!-- Promoter Form -->
              <template v-else-if="mode === 'promoter'">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="entityData.search"
                      label="Buscar Promotor (nome, e-mail ou telefone)"
                      placeholder="Digite para buscar..."
                      variant="outlined"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="entityData.name"
                      label="Nome completo"
                      :rules="[v => !!v || 'Nome é obrigatório']"
                      variant="outlined"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="entityData.email"
                      label="E-mail"
                      :rules="[
                        v => !!v || 'E-mail é obrigatório',
                        v => /.+@.+\..+/.test(v) || 'E-mail inválido'
                      ]"
                      variant="outlined"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                  <v-col cols="12" sm="4">
                    <v-text-field
                      v-model="entityData.phone"
                      label="Telefone"
                      variant="outlined"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                </v-row>
                <v-row v-if="editMode">
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="entityData.quota"
                      label="Cota de convidados"
                      type="number"
                      variant="outlined"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="entityData.commission"
                      label="Comissão (%)"
                      type="number"
                      variant="outlined"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-switch
                      v-model="entityData.active"
                      label="Ativo para este evento"
                      hide-details
                      class="mb-3"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-textarea
                      v-model="entityData.notes"
                      label="Observações (opcional)"
                      variant="outlined"
                      rows="3"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                </v-row>
              </template>
  
              <!-- List Form -->
              <template v-else-if="mode === 'list'">
                <v-row>
                  <v-col cols="12">
                    <v-text-field
                      v-model="entityData.name"
                      label="Nome da lista"
                      :rules="[v => !!v || 'Nome é obrigatório']"
                      variant="outlined"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12">
                    <v-select
                      v-model="entityData.promoters"
                      :items="promotersOptions"
                      label="Selecione os promotores"
                      multiple
                      variant="outlined"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="entityData.quota"
                      label="Cota"
                      type="number"
                      min="0"
                      variant="outlined"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="entityData.price"
                      label="Preço"
                      type="number"
                      min="0"
                      variant="outlined"
                      prefix="$"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6">
                    <v-text-field
                      v-model="entityData.cutoffTime"
                      label="Horário de corte"
                      type="time"
                      variant="outlined"
                      hide-details="auto"
                      class="mb-3"
                    />
                  </v-col>
                  <v-col cols="12" sm="6">
                    <v-switch
                      v-model="entityData.active"
                      label="Ativo"
                      hide-details
                      class="mb-3"
                    />
                  </v-col>
                </v-row>
              </template>
            </v-container>
          </v-form>
        </v-card-text>
  
        <!-- Action Buttons -->
        <v-divider />
        <v-card-actions class="pa-4">
          <v-row>
            <v-col cols="12" sm="6" class="d-flex justify-center justify-sm-start mb-2 mb-sm-0">
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
    mode: {
      type: String,
      required: true, // 'hostess', 'promoter', or 'list'
    },
    editMode: {
      type: Boolean,
      default: false,
    },
    areaOptions: {
      type: Array,
      default: () => ["Bar", "Restaurante", "Lobby"],
    },
    promotersOptions: {
      type: Array,
      default: () => [],
    },
  });
  
  const emit = defineEmits(["update:modelValue", "saved"]);
  const router = useRouter();
  
  // Responsive behavior: mobile-first approach
  const isMobile = computed(() => window.innerWidth < 600);
  
  // Dialog visibility
  const dialogVisible = computed({
    get: () => props.modelValue,
    set: (val) => emit("update:modelValue", val),
  });
  
  // Form and loading states
  const form = ref(null);
  const formValid = ref(false);
  const loading = ref(false);
  
  // Compute modal title and header color based on mode and editMode
  const modalTitle = computed(() => {
    if (props.mode === "hostess") {
      return props.editMode ? "Editar Hostess" : "Adicionar Hostess";
    } else if (props.mode === "promoter") {
      return props.editMode ? "Editar Promotor" : "Adicionar Promotor";
    } else if (props.mode === "list") {
      return props.editMode ? `Editar: ${entityData.name || ""}` : "Nova Lista";
    }
    return "Modal";
  });
  
  const headerColor = computed(() => {
    return props.mode === "promoter" ? (props.editMode ? "primary" : "secondary") : "primary";
  });
  
  // Initial entity data per mode
  const createEntityData = () => {
    return props.mode === "hostess"
      ? {
          search: "",
          name: "",
          phone: "",
          area: null,
          startTime: "",
          endTime: "",
          payment: "",
          confirmed: false,
          notes: "",
        }
      : props.mode === "promoter"
      ? {
          search: "",
          name: "",
          email: "",
          phone: "",
          quota: null,
          commission: null,
          active: false,
          notes: "",
        }
      : {
          name: "",
          promoters: [],
          quota: null,
          price: null,
          cutoffTime: "",
          active: false,
        };
  };
  
  const entityData = ref(createEntityData());
  
  // Reset form data and validation
  const resetForm = () => {
    entityData.value = createEntityData();
    form.value && form.value.resetValidation();
  };
  
  const closeDialog = () => {
    dialogVisible.value = false;
    resetForm();
  };
  
  const validateForm = async () => {
    if (!form.value) return false;
    const { valid } = await form.value.validate();
    return valid;
  };
  
  const saveEntity = async () => {
    if (!(await validateForm())) return;
    loading.value = true;
    try {
      const newEntity = { ...entityData.value, status: "active" };
      console.log("Entity saved:", newEntity);
      const savedEntity = { ...newEntity, id: Date.now() };
      emit("saved", savedEntity);
      return savedEntity;
    } catch (error) {
      console.error("Error saving entity:", error);
      return null;
    } finally {
      loading.value = false;
    }
  };
  
  const saveAndContinue = async () => {
    const savedEntity = await saveEntity();
    if (savedEntity) {
      if (props.mode !== "list") {
        router.push(`/${props.mode}/${savedEntity.id}`);
      }
      closeDialog();
    }
  };
  
  const saveAndClose = async () => {
    const savedEntity = await saveEntity();
    savedEntity && closeDialog();
  };
  
  // Reset form on dialog open
  watch(dialogVisible, (newVal) => {
    if (newVal) nextTick(resetForm);
  });
  </script>
  
  <style scoped>
  /* Mobile-first: ensure content scrolls and is padded on larger screens */
  .v-card-text {
    max-height: 70vh;
    overflow-y: auto;
  }
  
  @media (min-width: 600px) {
    .v-card-text,
    .v-card-actions {
      padding-left: 24px;
      padding-right: 24px;
    }
  }
  </style>
  