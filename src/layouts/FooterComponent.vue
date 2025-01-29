<template>
  <v-footer
    class="flex-grow-0 flex-column"
    :class="{ 'mb-14': $vuetify.display.mobile }"
  >
    <v-container>
      <!-- First Row: Location and Language -->
      <v-row>
        <v-col>
          <p>
            <v-icon size="x-small" class="mr-2">
              <flag-icon country="br"></flag-icon>
            </v-icon>
            <span class="text-body-2">Brasil</span>
            <span class="ml-10 text-caption">Idioma</span>
            <span class="text-body-2 ml-2">Português</span>
          </p>
        </v-col>
        <!-- Links -->
        <v-col cols="auto">
          <v-breadcrumbs
            density="compact"
            class="pa-0 text-grey"
            divider="-"
            :items="items"
          >
            <template v-slot:item="{ item }">
              <v-btn
                variant="plain"
                color="grey"
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
      <v-divider></v-divider>
      <!-- Second Row: Copyright and Social -->
      <v-row>
        <v-col class="mt-2">
          <p class="text-caption">
            © 2025 Jubilos Ltd. Todos os direitos reservados.
          </p>
        </v-col>
        <v-col cols="auto" class="mt-2">
          <div class="d-flex" style="gap: 20px">
            <v-btn
              href="https://www.instagram.com/jubilos.you/"
              target="_blank"
              rel="noopener noreferrer"
              variant="text"
              icon
            >
              <v-icon>mdi-instagram</v-icon>
            </v-btn>
          </div>
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
    title: "Termos de Uso",
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
// Ensure no gap between content and footer
.v-footer {
  margin-top: -1px;
  padding-bottom: env(safe-area-inset-bottom);
}

// Remove default button padding in breadcrumbs
:deep(.v-breadcrumbs) {
  .v-btn {
    padding: 0;
    min-width: 0;
    height: auto;
    color: white;

    &:hover {
      color: rgb(var(--v-theme-primary));
    }
  }
}
</style>
