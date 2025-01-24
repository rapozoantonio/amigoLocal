<template>
  <v-footer
    class="flex-grow-0 flex-column mt-auto"
    :class="{ 'mb-14': $vuetify.display.mobile }"
  >
    <v-container class="pa-2">
      <!-- Location and Language - Stack on mobile -->
      <v-row dense>
        <v-col cols="12" sm="6">
          <div class="d-flex align-center">
            <v-icon size="x-small" class="mr-2">
              <flag-icon country="br"></flag-icon>
            </v-icon>
            <span class="text-body-2">Rio de Janeiro</span>
            <span class="mx-2 text-caption">•</span>
            <span class="text-caption">Idioma</span>
            <span class="text-body-2 ml-1">Português</span>
          </div>
        </v-col>

        <!-- Links - Responsive layout -->
        <v-col cols="12" sm="6" class="d-flex justify-start justify-sm-end">
          <v-breadcrumbs
            density="compact"
            class="pa-0"
            divider="-"
            :items="items"
          >
            <template v-slot:item="{ item }">
              <v-btn
                variant="text"
                color="onSurface"
                class="text-caption px-1"
                :href="item.href"
                height="24"
              >
                {{ item.title }}
              </v-btn>
            </template>
          </v-breadcrumbs>
        </v-col>
      </v-row>

      <v-divider class="my-2"></v-divider>

      <!-- Copyright and Social - Stack on mobile -->
      <v-row dense>
        <v-col cols="12" sm="6" class="text-center text-sm-start">
          <p class="text-caption mb-0">
            © 2025 Jubilos Ltd. Todos os direitos reservados.
          </p>
        </v-col>
        <v-col cols="12" sm="6" class="d-flex justify-center justify-sm-end">
          <v-btn
            href="https://www.instagram.com/jubilos.you/"
            target="_blank"
            rel="noopener noreferrer"
            variant="text"
            icon="mdi-instagram"
            size="small"
          ></v-btn>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<script setup>
import FlagIcon from "@/components/FlagIcon.vue";

const items = [
  {
    title: "Privacidade",
    disabled: false,
    href: "/termos-de-privacidade",
  },
  {
    title: "Termos",
    disabled: false,
    href: "/termos-de-uso",
  },
  {
    title: "Mapa do site",
    disabled: false,
    href: "/sitemap.xml",
  },
];
</script>

<style lang="scss" scoped>
.v-footer {
  margin-top: -1px;
  padding-bottom: env(safe-area-inset-bottom);
}

:deep(.v-breadcrumbs) {
  .v-btn {
    color: white;

    &:hover {
      color: rgb(var(--v-theme-primary));
    }
  }
}

@media (max-width: 600px) {
  :deep(.v-breadcrumbs) {
    padding: 0;
    justify-content: center;
  }
}
</style>
