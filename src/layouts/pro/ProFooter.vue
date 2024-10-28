<template>
  <v-footer class="flex-grow-0 flex-column">
    <!-- <event-list-links-footer></event-list-links-footer> -->
    <v-container>
      <v-row>
        <v-col>
          <p>
            <v-icon size="x-small" class="mr-2">
              <flag-icon country="br"></flag-icon>
            </v-icon>
            <span class="text-body-2">Rio de Janeiro</span>
            <span class="text-grey ml-10 text-caption">Idioma</span>
            <span class="text-body-2 ml-2">Português</span>
          </p>
        </v-col>
        <v-col cols="auto">
          <v-breadcrumbs
            density="compact"
            class="pt-0"
            divider="-"
            :items="items"
          >
            <template v-slot:item="{ item }">
              <a class="text-caption" :href="item.href"> {{ item.title }}</a>
            </template>
          </v-breadcrumbs>
        </v-col>
      </v-row>
      <v-divider></v-divider>
      <v-row>
        <v-col class="mt-2">
          <p class="text-caption text-grey">
            © 2024 Jubilos Ltd. Todos os direitos reservados.
          </p>
        </v-col>
        <v-col cols="auto" class="mt-2">
          <div class="d-flex" style="gap: 20px">
            <a
              href="https://www.instagram.com/jubilos.you/"
              target="_blank"
              rel="noopener noreferrer"
            >
              <v-icon>mdi-instagram</v-icon>
            </a>
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
    href: "breadcrumbs_dashboard",
  },
  {
    title: "Termos",
    disabled: false,
    href: "breadcrumbs_link_1",
  },
  {
    title: "Mapa do site",
    disabled: false,
    href: "breadcrumbs_link_2",
  },
];
</script>

<style lang="scss" scoped>
a {
  text-decoration: none;
  color: white;
}

a:hover {
  text-decoration: none;
  color: red;
}
</style>
