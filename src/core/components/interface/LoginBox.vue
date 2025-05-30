<template>
  <section>
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
        <form-box :error="errors" @submit="loginEmail" :schema="loginSchema" action="Entrar" button-position="center"
          title="Login" labelType="up" v-model:model="login">
          <template #append>
            <div class="d-flex my-4 align-center">
              <v-divider />
              <span class="flex-shrink-0 mx-2 text-caption text-grey">Ou entre com</span>
              <v-divider />
            </div>

            <div class="text-center">
              <v-btn color="white" rounded="lg" class="text-capitalize mt-2" @click="loginGoogle" block>
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
            <v-btn color="primary" rounded="lg" class="text-capitalize" :to="{ name: 'register' }" block>
              Inscrever-se
            </v-btn>
          </v-card-text>

          <pre>{{ errors }}</pre>
        </v-card>
      </v-col>
    </v-row>
  </section>
</template>

<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import FormBox from "@/core/components/form/FormBox.vue";
import IconGoogle from "@/promotion/components/icons/IconGoogle.vue";
import loginSchema from "@/core/schemas/loginSchema";
import { useAuthStore } from "@/core/store/auth";
const emit = defineEmits(["success"]);

const auth = useAuthStore();
const router = useRouter();
const route = useRoute();

const login = ref({
  email: "",
  password: "",
});

const errors = ref(null);

async function loginEmail() {
  console.log("loginWithEmail")
  if (login.value.email && login.value.password) {
    try {
      errors.value = null;
      const response = await auth.loginWithEmail(
        login.value.email,
        login.value.password
      );
      if (response.ok) {
        console.log("emit success");
        emit("success");
      }
    } catch (error) {
      alert(error)
      errors.value = error.message;
    }
  }
}

async function loginGoogle() {
  try {
    const response = await auth.loginWithGoogle();
    errors.value = response.error.message;

    if (response.ok) {
      console.log("emit success");
      emit("success");
    }
  } catch (error) {
    errors.value = error.message;
  }
}
</script>

<style scoped>
.v-btn {
  letter-spacing: normal;
}
</style>
