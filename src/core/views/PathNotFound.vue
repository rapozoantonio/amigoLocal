<template>
  <v-container fluid class="pa-0 bg-black min-h-screen">
    <v-row align="center" justify="center" class="ma-0 fill-height">
      <v-col cols="12" sm="8" md="6" class="pa-4">
        <v-card flat color="transparent" class="text-center pa-4">
          <v-card-item>
            <div class="d-flex justify-center align-center gap-4 mb-8">
              <v-icon
                icon="mdi-party-popper"
                :size="isSmallScreen ? 32 : 48"
                color="primary"
              />
              <v-icon
                icon="mdi-music"
                :size="isSmallScreen ? 32 : 48"
                color="primary"
                class="bounce-animation"
              />
            </div>
            <v-card-title class="text-h3 text-sm-h1 font-weight-bold mb-6">
              404
            </v-card-title>
            <v-card-subtitle class="text-h5 text-sm-h3 mb-6">
              Eita! Party not found
            </v-card-subtitle>
            <v-card-text class="text-body-1 text-sm-h5 mb-8">
              Poxa, essa festa não tá mais rolando... Mas bora que tem várias
              pistas quentes pra você curtir! 🔥
            </v-card-text>
            <v-btn
              to="/"
              block
              color="primary"
              variant="tonal"
              :size="isSmallScreen ? 'large' : 'x-large'"
              prepend-icon="mdi-calendar"
              class="mb-8"
            >
              Voltar para agenda de festas
            </v-btn>
            <v-divider class="mb-8"></v-divider>
            <v-card-text class="text-body-2 text-sm-subtitle-1">
              Enquanto isso, que tal conferir os próximos eventos?
            </v-card-text>
          </v-card-item>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { computed } from "vue";
import { useDisplay } from "vuetify";

const { smAndDown } = useDisplay();
const isSmallScreen = computed(() => smAndDown.value);
</script>

<style scoped>
.bounce-animation {
  animation: bounce 2s infinite;
  transform-origin: center;
  position: relative;
  top: 12px;
}

@keyframes bounce {
  0%,
  100% {
    transform: translateY(-25%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}

.v-card {
  background: rgba(18, 18, 18, 0.8) !important;
  backdrop-filter: blur(12px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.min-h-screen {
  min-height: 100vh;
}
</style>
