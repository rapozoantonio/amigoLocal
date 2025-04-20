<template>
  <section>
    <div>
      <v-container>
        <v-row>
          <v-col cols="12">
            <h2 class="text-h2 mt-10">Inscrever-se</h2>
          </v-col>
        </v-row>
      </v-container>
    </div>
    <v-container>
      <v-row v-if="auth.user">
        <v-col>
          <v-alert border="start" border-color="primary">
            <p>
              Ja tem uma sessão iniciada com
              <span class="text-subtitle-1">{{ auth.user.email }}</span>
            </p>
            <div class="d-flex gap-3 mt-4">
              <v-btn class="mr-2" to="/" color="primary" variant="tonal">
                <v-icon start>mdi-home</v-icon> Ir para o início
              </v-btn>
              <v-btn @click="auth.logout" color="primary">
                <v-icon start>mdi-logout</v-icon> Finalizar sessão
              </v-btn>
            </div>
          </v-alert>
        </v-col>
      </v-row>
      <v-row v-else>
        <v-col md="6" cols="12">
          <form-box
            :dense="false"
            @submit="submitRegister"
            :schema="registrationSchema"
            action="Registrar"
            title="Novo usuario"
            labelType="up"
            v-model:model="user"
          >
          </form-box>
        </v-col>
        <v-col v-if="false" md="8" cols="12">
          <v-card color="transparent" max-width="600" flat>
            <v-card-title class="text-h4 mb-4">/ Seus dados</v-card-title>

            <!-- INFORMACOES DE LOGIN -->
            <v-card-subtitle class="text-h5 mt-5"
              >Informações de Login</v-card-subtitle
            >
            <v-card-text>
              <v-row dense>
                <v-col cols="12" sm="6" class="mb-2">
                  <!-- <label class="text-caption required" for="name">Name</label> -->
                  <v-text-field
                    id="name"
                    name="name"
                    variant="outlined"
                    rounded="pill"
                    label="Name *"
                    hide-details="auto"
                    density="compact"
                    class="mb-2"
                    v-model="user.name"
                    required
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" class="mb-2">
                  <!-- <label class="text-caption required" for="email">Email</label> -->
                  <v-text-field
                    id="email"
                    name="email"
                    type="email"
                    variant="outlined"
                    hide-details="auto"
                    label="Email *"
                    rounded="pill"
                    density="compact"
                    class="mb-2"
                    v-model="user.email"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" class="mb-2">
                  <!-- <label class="text-caption required" for="password">Senha</label> -->
                  <v-text-field
                    id="password"
                    name="password"
                    :type="showPassword ? 'text' : 'password'"
                    variant="outlined"
                    rounded="pill"
                    density="compact"
                    class="mb-2"
                    hide-details="auto"
                    label="Password *"
                    :append-inner-icon="
                      showPassword ? 'mdi-eye' : 'mdi-eye-off'
                    "
                    @click:append-inner="showPassword = !showPassword"
                    v-model="user.password"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-card-text>

            <!-- MARKETING CONSENT -->
            <v-card-subtitle class="text-h5 mt-5"
              >Junte-se a comunidade
            </v-card-subtitle>
            <v-card-text>
              <p>
                Inscreva-se a Newsletter semanal da RA para receberes
                atualizações sobre as últimas notícias e eventos
              </p>
              <v-checkbox
                label="Se increver"
                v-model="user.emailOptin"
                name="emailOptin"
                id="emailOptin"
              ></v-checkbox>
              <v-btn color="primary" type="submit" :loading="loading"
                >Registrar</v-btn
              >
              <p>
                Ao se registrar, você indica que leu e concorda com os Termos de
                Uso e a Política de Privacidade
              </p>
            </v-card-text>
          </v-card>
        </v-col>
        <v-spacer></v-spacer>
        <v-col cols="12" md="4">
          <v-card
            color="transparent"
            width="300"
            flat
            position="sticky"
            style="top: 50px; position: sticky"
          >
            <v-card-text>
              <p class="text-h5">Ja tem uma conta?</p>
              <v-btn
                color="primary"
                rounded="pill"
                class="text-capitalize mt-4"
                :to="{ name: 'login' }"
                >Entrar</v-btn
              >
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </section>
</template>

<script setup>
import { ref } from "vue";

import Swal from "sweetalert2";
import { useRouter } from "vue-router";

import FormBox from "@/core/components/form/FormBox.vue";
import registrationSchema from "@/core/schemas/registrationSchema";
import { useAuthStore } from "@/core/store/auth";

const auth = useAuthStore();
const router = useRouter();

const emailConfirm = ref(null);
const showPassword = ref(false);
// const $swal = inject("$swal");
const loading = ref(false);
const user = ref({
  name: null,
  email: null,
  password: null,
  emailOptin: false,
});

const rules = ref({
  required: (value) => !!value || "Field is required",
});

const languages = ref([
  { title: "English", value: "en" },
  { title: "Spanish", value: "es" },
  { title: "Portuguese", value: "pt" },
  { title: "Italian", value: "it" },
]);

async function submitRegister() {
  loading.value = true;
  try {
    const registeredUser = {
      name: user.value.name,
      email: user.value.email,
      emailOptin: user.value.emailOptin,
    };

    const registerResponse = await auth.registerWithEmail(
      registeredUser,
      user.value.password
    );

    if (!registerResponse.ok) {
      Swal.fire({
        icon: "error",
        title: registerResponse.error?.code,
      });
      return false;
    }
    // await timeout(2000);
    router.push({ name: "pro-profile" });
  } catch (error) {
  } finally {
    loading.value = false;
  }
}

function timeout(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
</script>

<style>
label.required:after {
  content: "*";
  color: red;
  margin-left: 2px;
}
</style>
