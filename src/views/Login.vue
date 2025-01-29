<template>
  <section>
    <v-container>
      <v-row>
        <v-col cols="12" class="text-center">
          <h2 class="text-h4 text-md-h3 mt-4">Entrar</h2>
        </v-col>
      </v-row>

      <v-row v-if="auth.user" justify="center">
        <v-col cols="12" md="6">
          <v-alert border="start" border-color="primary">
            <p class="mb-2">
              Sessão ativa com
              <span class="text-subtitle-1 font-weight-medium">{{
                auth.user.email
              }}</span>
            </p>
            <v-btn @click="auth.logout" color="primary" class="mt-2">
              <v-icon start>mdi-logout</v-icon>
              Finalizar sessão
            </v-btn>
          </v-alert>
        </v-col>
      </v-row>
      <v-row v-else justify="center">
        <!-- Login Form -->
        <v-col cols="12" md="6">
          <form-box
            :error="errors"
            @submit="loginEmail"
            :schema="loginSchema"
            action="Entrar"
            button-position="center"
            title="Login"
            labelType="up"
            v-model:model="login"
          >
            <template #append>
              <div class="d-flex my-4 align-center">
                <v-divider />
                <span class="flex-shrink-0 mx-2 text-caption text-grey"
                  >Ou entre com</span
                >
                <v-divider />
              </div>

              <div class="text-center">
                <v-btn
                  color="white"
                  rounded="lg"
                  class="text-capitalize mt-2"
                  @click="loginGoogle"
                  block
                >
                  <v-icon class="mr-2">
                    <icon-google />
                  </v-icon>
                  Entrar com Google
                </v-btn>
              </div>
            </template>
          </form-box>
        </v-col>

        <!-- Registration CTA -->
        <v-col cols="12" md="6" class="text-center mt-8 mt-md-0">
          <v-card color="transparent" flat>
            <v-card-text>
              <p class="text-h5 mb-4">Novo por aqui?</p>
              <v-btn
                color="primary"
                rounded="lg"
                class="text-capitalize"
                :to="{ name: 'register' }"
                block
              >
                Inscrever-se
              </v-btn>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import FormBox from "@/components/form/FormBox.vue";
import IconGoogle from "@/components/icons/IconGoogle.vue";
import loginSchema from "@/schemas/loginSchema";
import { useAuthStore } from "@/store/auth";

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const login = ref({
  email: "",
  password: "",
});

const errors = ref(null);

async function loginEmail() {
  if (login.value.email && login.value.password) {
    try {
      errors.value = null;
      await auth.loginWithEmail(login.value.email, login.value.password);
      handlePostLoginRedirect();
    } catch (error) {
      errors.value = error.message;
    }
  }
}

async function loginGoogle() {
  try {
    await auth.loginWithGoogle();
    handlePostLoginRedirect();
  } catch (error) {
    errors.value = error.message;
  }
}

function handlePostLoginRedirect() {
  if (route.query.redirect && route.query.redirect !== "") {
    router.push(atob(route.query.redirect));
  }
}
</script>

<style scoped>
.v-btn {
  letter-spacing: normal;
}
</style>
