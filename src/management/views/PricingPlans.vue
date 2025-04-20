<template>
  <v-container class="py-8">
    <v-container fluid class="px-0">
      <v-row justify="center">
        <v-col cols="12" class="text-center mb-8">
          <h1 class="text-h3 text-center font-weight-bold mb-4">
            Escolha o plano ideal
          </h1>
          <p class="text-h6 text-center text-medium-emphasis">
            Comece a gerenciar seus eventos de forma profissional
          </p>
        </v-col>
      </v-row>

      <v-row justify="center">
        <v-col cols="12" lg="10" xl="8">
          <v-row>
            <!-- Basic Plan -->
            <v-col cols="12" md="4">
              <v-card
                elevation="2"
                class="h-100 d-flex flex-column"
              >
                <v-card-item>
                  <v-card-title class="text-h6 font-weight-bold">
                    Inicial
                  </v-card-title>
                  <v-card-subtitle class="mb-2"> Para começar </v-card-subtitle>
                </v-card-item>

                <v-card-text class="flex-grow-1">
                  <div class="d-flex align-end mb-4">
                    <span class="text-h2 font-weight-bold">R$ 129</span>
                    <span class="text-h6 ml-1">,90</span>
                    <span class="text-body-2 text-medium-emphasis ml-2"
                      >/mês</span
                    >
                  </div>

                  <v-divider class="mb-4"></v-divider>

                  <v-list class="bg-transparent" density="compact">
                    <v-list-item
                      class="px-0"
                      v-for="feature in basicFeatures"
                      :key="feature"
                    >
                      <template v-slot:prepend>
                        <v-icon color="success" size="small"
                          >mdi-check-circle</v-icon
                        >
                      </template>
                      <v-list-item-title class="text-body-2">{{
                        feature
                      }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card-text>

                <v-card-actions class="px-4 pb-4">
                  <v-btn
                    block
                    size="large"
                    variant="outlined"
                    color="primary"
                    rounded="lg"
                    @click="selectPlan('basic')"
                  >
                    Começar agora
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <!-- Pro Plan -->
            <v-col cols="12" md="4">
              <v-card
                elevation="16"
                color="primary"
                class="h-100 d-flex flex-column"
                style="transform: scale(1.05); z-index: 10"
              >
                <v-card-item class="text-white">
                  <v-card-title class="d-flex justify-space-between align-center">
                    <span class="text-h6 font-weight-bold">Profissional</span>
                    <v-chip
                      color="white"
                      variant="flat"
                      size="small"
                      class="text-primary"
                    >
                      POPULAR
                    </v-chip>
                  </v-card-title>
                  <v-card-subtitle class="mb-2 text-white-darken-2">
                    Melhor custo-benefício
                  </v-card-subtitle>
                </v-card-item>

                <v-card-text class="bg-surface flex-grow-1">
                  <div class="d-flex align-end mb-4">
                    <span class="text-h2 font-weight-bold">R$ 690</span>
                    <span class="text-h6 ml-1">,00</span>
                    <span class="text-body-2 text-medium-emphasis ml-2"
                      >/mês</span
                    >
                  </div>

                  <v-divider class="mb-4"></v-divider>

                  <v-list class="bg-transparent" density="compact">
                    <v-list-item
                      class="px-0"
                      v-for="feature in proFeatures"
                      :key="feature"
                    >
                      <template v-slot:prepend>
                        <v-icon color="primary" size="small"
                          >mdi-check-circle</v-icon
                        >
                      </template>
                      <v-list-item-title class="text-body-2">{{
                        feature
                      }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card-text>

                <v-card-actions class="px-4 pb-4 bg-surface">
                  <v-btn
                    block
                    size="large"
                    variant="flat"
                    color="primary"
                    rounded="lg"
                    @click="selectPlan('pro')"
                  >
                    Assinar agora
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>

            <!-- Enterprise Plan -->
            <v-col cols="12" md="4">
              <v-card
                elevation="2"
                class="h-100 d-flex flex-column"
              >
                <v-card-item>
                  <v-card-title class="text-h6 font-weight-bold">
                    Empresarial
                  </v-card-title>
                  <v-card-subtitle class="mb-2">
                    Soluções personalizadas
                  </v-card-subtitle>
                </v-card-item>

                <v-card-text class="flex-grow-1">
                  <div class="d-flex align-center mb-4">
                    <span class="text-h2 font-weight-bold">Sob medida</span>
                  </div>

                  <v-divider class="mb-4"></v-divider>

                  <v-list class="bg-transparent" density="compact">
                    <v-list-item
                      class="px-0"
                      v-for="feature in enterpriseFeatures"
                      :key="feature"
                    >
                      <template v-slot:prepend>
                        <v-icon color="success" size="small"
                          >mdi-check-circle</v-icon
                        >
                      </template>
                      <v-list-item-title class="text-body-2">{{
                        feature
                      }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </v-card-text>

                <v-card-actions class="px-4 pb-4">
                  <v-btn
                    block
                    size="large"
                    variant="outlined"
                    color="secondary"
                    rounded="lg"
                    @click="contactSales"
                  >
                    Fale conosco
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>

          <!-- Footer Information -->
          <v-row class="mt-12">
            <v-col cols="12">
              <v-alert
                color="info"
                variant="tonal"
                border="start"
                class="text-body-2"
              >
                <template v-slot:prepend>
                  <v-icon>mdi-information</v-icon>
                </template>
                Todos os planos incluem suporte técnico e atualizações gratuitas.
                Check-ins adicionais são cobrados à parte conforme utilização.
              </v-alert>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
  </v-container>
</template>

<script setup>
import { useRouter } from "vue-router";

const router = useRouter();

const basicFeatures = [
  "1 evento por mês",
  "Até 600 check-ins inclusos",
  "R$ 0,30 por check-in adicional",
  "Relatórios básicos",
  "Suporte por email",
];

const proFeatures = [
  "Eventos ilimitados",
  "600 check-ins por evento",
  "R$ 0,30 por check-in adicional",
  "Relatórios avançados",
  "Suporte prioritário",
];

const enterpriseFeatures = [
  "Múltiplos produtores",
  "Check-ins personalizados",
  "Preços especiais para volume",
  "Relatórios customizados",
  "Suporte dedicado 24/7",
];

const selectPlan = (plan) => {
  console.log(`Selected plan: ${plan}`);
  router.push({ name: "dashboard" });
};

const contactSales = () => {
  console.log("Contact sales clicked");
  window.location.href =
    "mailto:sales@yourcompany.com?subject=Plano%20Empresarial";
};
</script>