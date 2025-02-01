<template>
  <v-footer
    class="flex-grow-0 flex-column"
    :class="{ 'mb-14': $vuetify.display.mobile }"
    role="contentinfo"
    aria-label="Site footer"
  >
    <v-container>
      <!-- First Row: Location and Language -->
      <v-row>
        <v-col>
          <div 
            class="text-grey"
            role="region"
            aria-label="Location and language information"
          >
            <p class="d-flex align-center">
              <v-icon 
                size="x-small" 
                class="mr-2"
                aria-hidden="true"
              >
                <flag-icon 
                  country="br"
                  aria-label="Brazil flag"
                ></flag-icon>
              </v-icon>
              <span class="text-body-2">
                <span class="visually-hidden">Country: </span>Brasil
              </span>
              <span class="ml-10 text-caption" aria-hidden="true">Idioma</span>
              <span class="text-body-2 ml-2">
                <span class="visually-hidden">Language: </span>Português
              </span>
            </p>
          </div>
        </v-col>
        <!-- Links -->
        <v-col cols="auto">
          <nav 
            aria-label="Footer navigation"
            class="pa-0 text-grey"
          >
            <v-breadcrumbs
              divider="-"
              :items="items"
              role="list"
            >
              <template v-slot:item="{ item }">
                <v-btn
                  variant="plain"
                  class="text-caption px-1 text-grey"
                  :href="item.href"
                  height="24"
                  :aria-label="item.title"
                  role="listitem"
                >
                  {{ item.title }}
                </v-btn>
              </template>
            </v-breadcrumbs>
          </nav>
        </v-col>
      </v-row>
      <v-divider aria-hidden="true"></v-divider>
      <!-- Second Row: Copyright and Social -->
      <v-row>
        <v-col class="mt-2">
          <p 
            class="text-caption text-grey"
            role="contentinfo"
            aria-label="Copyright information"
          >
            © 2025 Jubilos Ltd. Todos os direitos reservados.
          </p>
        </v-col>
        <v-col cols="auto" class="mt-2">
          <div 
            class="d-flex text-grey" 
            style="gap: 20px"
            role="navigation"
            aria-label="Social media links"
          >
            <v-btn
              href="https://www.instagram.com/jubilos.you/"
              target="_blank"
              rel="noopener noreferrer"
              variant="text"
              icon
              aria-label="Visit our Instagram page"
            >
              <v-icon aria-hidden="true">mdi-instagram</v-icon>
            </v-btn>
          </div>
        </v-col>
      </v-row>
    </v-container>
  </v-footer>
</template>

<style scoped>
.visually-hidden {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
</style>
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
