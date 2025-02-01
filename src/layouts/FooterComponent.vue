<template>
  <v-footer
    class="flex-grow-0 flex-column footer-container"
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
              <span class="text-body-2 preload-text">
                <span class="visually-hidden">Country: </span>Brasil
              </span>
              <span class="ml-10 text-caption" aria-hidden="true">Idioma</span>
              <span class="text-body-2 ml-2 preload-text">
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
              class="footer-breadcrumbs"
            >
              <template v-slot:item="{ item }">
                <v-btn
                  variant="plain"
                  class="text-caption px-1 text-grey footer-link"
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
            class="copyright-text"
            role="contentinfo"
            aria-label="Copyright information"
          >
            © 2025 Jubilos Ltd. Todos os direitos reservados.
          </p>
        </v-col>
        <v-col cols="auto" class="mt-2">
          <div 
            class="d-flex text-grey social-links" 
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
              class="social-link"
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

<style lang="scss">
// Pre-load critical fonts
@font-face {
  font-family: 'Your-Font-Family';
  font-display: swap;
  src: local('Your-Font-Family');
}

.footer-container {
  margin-top: -1px;
  padding-bottom: env(safe-area-inset-bottom);
  contain: layout style paint;
}

// Optimize text rendering
.copyright-text {
  font-size: 0.75rem;
  line-height: 1.2;
  color: rgb(158, 158, 158);
  font-display: swap;
  contain: content;
  will-change: transform;
  transform: translateZ(0);
}

.preload-text {
  font-display: swap;
  contain: content;
}

// Remove default button padding in breadcrumbs
.footer-breadcrumbs {
  .v-btn {
    padding: 0;
    min-width: 0;
    height: auto;
    color: white;
    contain: content;

    &:hover {
      color: rgb(var(--v-theme-primary));
    }
  }
}

.social-links {
  contain: layout style;
}

.social-link {
  contain: layout style paint;
}

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