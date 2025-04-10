<template>
  <v-container class="cta-container" fluid>
    <v-row align="center" justify="center" class="fill-height">
      <v-col cols="12" sm="8" md="6" class="text-center">
        <!-- Sad face icon -->
        <v-icon size="80" color="grey" class="mb-4">
          mdi-emoticon-confused-outline
        </v-icon>
        <!-- Headline -->
        <h2 class="mb-2">Vamos ampliar sua busca!</h2>
        <!-- Supporting text -->
        <p class="mb-4">
          Siga alguns eventos, promoters e localizações para que os eventos
          apareçam aqui.
        </p>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
.cta-container {
  min-height: 80vh; /* Ensures the container fills most of the viewport */
}
.fill-height {
  min-height: 40vh;
}
</style>
