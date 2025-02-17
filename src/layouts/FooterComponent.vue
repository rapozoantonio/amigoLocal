<template>
  <v-footer
    class="flex-grow-0 py-2 footer-container"
    :class="{ 'mb-14': $vuetify.display.mobile }"
    role="contentinfo"
  >
    <v-container>
      <!-- First Row: Location, Language and Links -->
      <v-row align="center" justify="space-between" no-gutters>
        <v-col cols="auto">
          <div class="d-flex align-center text-caption text-grey">
            <v-icon size="14" class="mr-1">
              <flag-icon 
                country="br"
                style="width: 14px; height: 14px;"
              />
            </v-icon>
            <span>BR | PT</span>
          </div>
        </v-col>

        <v-col cols="auto">
          <div class="d-flex align-center">
            <v-menu location="top" transition="slide-y-transition">
              <template v-slot:activator="{ props }">
                <v-btn
                  v-bind="props"
                  variant="text"
                  density="compact"
                  class="text-caption text-grey"
                  height="24"
                >
                  Legal
                  <v-icon size="16">mdi-chevron-up</v-icon>
                </v-btn>
              </template>
              <v-list density="compact">
                <v-list-item
                  v-for="item in items"
                  :key="item.title"
                  :href="item.href"
                  :title="item.title"
                  class="text-caption"
                />
              </v-list>
            </v-menu>
          </div>
        </v-col>
      </v-row>

      <!-- Second Row: Copyright and Social -->
      <v-row align="center" justify="space-between" no-gutters class="mt-2">
        <v-col>
          <p 
            class="copyright-text text-caption text-grey mb-0"
            role="contentinfo"
            aria-label="Copyright information"
          >
            © 2025 Jubilos Ltd. Todos os direitos reservados.
          </p>
        </v-col>
        <v-col cols="auto">
          <v-btn
            href="https://www.instagram.com/jubilos.you/"
            target="_blank"
            rel="noopener noreferrer"
            variant="text"
            density="compact"
            height="24"
            class="text-grey"
            aria-label="Visit our Instagram page"
          >
            <v-icon size="16">mdi-instagram</v-icon>
          </v-btn>
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
    href: "/termos-de-privacidade",
  },
  {
    title: "Termos de Uso",
    href: "/termos-de-uso",
  },
  {
    title: "Mapa do site",
    href: "/sitemap.xml",
  },
];
</script>

<style lang="scss" scoped>
.footer-container {
  margin-top: -1px;
  padding-bottom: env(safe-area-inset-bottom);
}

.copyright-text {
  line-height: 1.2;
}

:deep(.v-btn) {
  text-transform: none;
}
</style>