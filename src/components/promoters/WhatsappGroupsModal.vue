<template>
  <v-dialog v-model="isOpen" width="400" class="whatsapp-groups-modal">
    <v-card class="bg-grey-darken-4">
      <!-- Header -->
      <v-card-title class="d-flex align-center justify-space-between pa-4">
        <div class="d-flex align-center">
          <v-icon size="24" color="primary" class="mr-2">mdi-whatsapp</v-icon>
          <span class="text-h6">Grupos do WhatsApp</span>
        </div>
        <v-btn
          icon="mdi-close"
          variant="text"
          @click="close"
          size="small"
          class="ml-2"
        />
      </v-card-title>

      <v-divider></v-divider>

      <!-- Empty State -->
      <template v-if="!hasGroups">
        <v-card-text class="pa-8 text-center">
          <v-icon
            icon="mdi-account-group-outline"
            size="64"
            color="grey-darken-1"
            class="mb-4"
          />
          <div class="text-grey text-body-1">Nenhum grupo disponível</div>
        </v-card-text>
      </template>

      <!-- Content State -->
      <template v-else>
        <!-- Search Input -->
        <v-card-text class="pa-4 pb-0" v-if="props.groups?.length > 5">
          <v-text-field
            v-model="searchQuery"
            prepend-inner-icon="mdi-magnify"
            placeholder="Buscar grupos..."
            variant="outlined"
            density="compact"
            hide-details
            class="mb-4"
            color="primary"
            bg-color="grey-darken-3"
          />
        </v-card-text>

        <!-- Groups List -->
        <v-card-text class="pa-4">
          <v-list
            class="bg-grey-darken-4"
            v-for="(groups, category) in groupedAndFilteredGroups"
            :key="category"
          >
            <!-- Category Header -->
            <v-list-subheader class="text-primary text-subtitle-2 px-0">
              {{ category }}
            </v-list-subheader>

            <!-- Group Items -->
            <v-list-item
              v-for="group in groups"
              :key="group.name"
              :value="group"
              :href="group.link"
              target="_blank"
              class="mb-2 rounded-lg"
              hover
              active-color="primary"
            >
              <template v-slot:prepend>
                <v-avatar
                  color="primary"
                  variant="tonal"
                  size="32"
                  class="mr-3"
                >
                  <v-icon size="16">mdi-whatsapp</v-icon>
                </v-avatar>
              </template>

              <v-list-item-title>{{ group.name }}</v-list-item-title>
            </v-list-item>
          </v-list>
        </v-card-text>

        <!-- Footer -->
        <v-divider></v-divider>
        <v-card-actions class="pa-4">
          <span class="text-grey">{{ totalGroups }} grupos disponíveis</span>
          <v-spacer></v-spacer>
          <v-btn
            variant="tonal"
            color="primary"
            @click="shareGroups"
            prepend-icon="mdi-share-variant"
          >
            Compartilhar
          </v-btn>
        </v-card-actions>
      </template>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  groups: {
    type: Array,
    default: () => [
      {
        name: "Carnaval RJ 2024",
        link: "https://chat.whatsapp.com/carnaval-rj",
        category: "Carnaval",
      },
      {
        name: "Carnaval SP 2024",
        link: "https://chat.whatsapp.com/carnaval-sp",
        category: "Carnaval",
      },
      {
        name: "Reveillon Copacabana",
        link: "https://chat.whatsapp.com/reveillon-copa",
        category: "Reveillon",
      },
      {
        name: "Festas RJ",
        link: "https://chat.whatsapp.com/rio",
        category: "Geral",
      },
    ],
  },
});

const isOpen = ref(false);
const searchQuery = ref("");

// Computed property to check if we have groups
const hasGroups = computed(() => {
  return Array.isArray(props.groups) && props.groups.length > 0;
});

// Use default groups or provided groups
const activeGroups = computed(() => {
  if (hasGroups.value) return props.groups;
  return [];
});

// Computed properties
const groupedAndFilteredGroups = computed(() => {
  if (!hasGroups.value) return {};

  const filtered = activeGroups.value.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );

  return filtered.reduce((acc, group) => {
    const category = group.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(group);
    return acc;
  }, {});
});

const totalGroups = computed(() => activeGroups.value.length);

// Methods
const open = () => {
  isOpen.value = true;
  searchQuery.value = "";
};

const close = () => {
  isOpen.value = false;
  searchQuery.value = "";
};

const shareGroups = () => {
  if (!hasGroups.value) return;

  const text = activeGroups.value
    .map((group) => `${group.name}: ${group.link}`)
    .join("\n");

  // Format text with a header
  const formattedText = `*Grupos do WhatsApp*\n\n${text}`;

  // Try WhatsApp Web first
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(formattedText)}`;
  
  if (/Android|iPhone/i.test(navigator.userAgent)) {
    // Mobile: Open in WhatsApp directly
    window.location.href = whatsappUrl;
  } else if (navigator.share) {
    // Use native share if available
    navigator.share({
      title: "Grupos do WhatsApp",
      text: formattedText,
    }).catch(() => {
      // Fallback to opening WhatsApp Web
      window.open(whatsappUrl, '_blank');
    });
  } else {
    // Desktop fallback: Open WhatsApp Web
    window.open(whatsappUrl, '_blank');
  }
};

defineExpose({ open, close });
</script>

<style lang="scss" scoped>
.whatsapp-groups-modal {
  .v-list {
    &-item {
      transition: background-color 0.2s ease;

      &:hover {
        background-color: rgba(255, 255, 255, 0.05);
      }

      &:active {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }
  }
}

@media (max-width: 600px) {
  .whatsapp-groups-modal {
    margin: 0;

    :deep(.v-card) {
      border-radius: 0;
      min-height: 100vh;
    }

    :deep(.v-list-item) {
      padding: 16px;
    }
  }
}
</style>
