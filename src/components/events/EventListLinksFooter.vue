<template>
  <v-container class="pb-16">
    <v-row class="pt-10">
      <v-col cols="12">
        <p class="text-h5 mb-4">Você é um promoter?</p>
        <v-btn
          :to="{ name: 'pro-events-create' }"
          style="text-transform: none"
          color="primary"
          variant="elevated"
          rounded="pill"
        >
          <span> Enviar evento </span>
        </v-btn>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
const items = [
  {
    title: "About",
    disabled: false,
    href: "breadcrumbs_dashboard",
  },
  {
    title: "Ticket",
    disabled: false,
    href: "breadcrumbs_link_1",
  },
  {
    title: "Resale",
    disabled: false,
    href: "breadcrumbs_link_2",
  },
];
</script>