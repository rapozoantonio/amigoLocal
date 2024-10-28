<template>

    <section>
        <div class="bg-grey-darken-4">
            <v-container>
                <v-row>
                    <v-col cols="12">
                        <h2 class="text-h2 mt-10">Entrar</h2>
                    </v-col>
                </v-row>
            </v-container>
        </div>
        <v-form>
            <v-container>
                <v-row v-if="auth.user">
                    <v-col>
                        <v-alert border="start" border-color="primary">
                            <p>Ja tem uma sessão iniciada com <span class="text-subtitle-1">{{ auth.user.email }}</span>

                            </p>
                            <v-btn class="mt-4" @click="auth.logout" color="primary"> <v-icon start>mdi-logout</v-icon>
                                Finalizar
                                sessão</v-btn>
                        </v-alert>
                    </v-col>
                </v-row>
                <v-row v-else justify="space-between">

                    <!-- LOGIN FORM -->
                    <v-col cols="6">

                        <form-box :error="errors" :dense="false" @submit="loginEmail" :schema="loginSchema"
                            action="Entrar" button-position="center" title="Login" labelType="up" v-model:model="login">
                            <template #append>
                                <div class="d-flex my-4 align-center">
                                    <v-divider></v-divider>
                                    <span class="flex-shrink-0 mx-2 text-caption text-grey">Ou entre com</span>
                                    <v-divider></v-divider>
                                </div>


                                <div class="text-center">
                                    <v-btn class="text-capitalize mt-2" color="white" rounded="elevated"
                                        @click="loginGoogle">
                                        <v-icon class="mr-2">
                                            <icon-google></icon-google>
                                        </v-icon>
                                        Entrar con
                                        google</v-btn>

                                </div>
                            </template>
                        </form-box>
                        <v-card v-if="false" color="transparent" min-width="300" max-width="400" flat>
                            <v-card-title>/ Seus dados</v-card-title>
                            <v-card-text>
                                <label class="text-caption" for="email">Email</label>
                                <v-text-field id="email" name="email" type="email" variant="outlined" rounded="pill"
                                    v-model="email" density="compact" hide-details="auto" class="mb-2"></v-text-field>
                                <label class="text-caption" for="password">Password</label>

                                <v-text-field id="password" name="password" type="password" variant="outlined"
                                    v-model="password" rounded="pill" density="compact" class="mb-2"
                                    hide-details="auto"></v-text-field>
                                <div class="text-center">
                                    <v-btn class="text-capitalize mt-6 " color="primary" block rounded="pill"
                                        @click="loginEmail">Entrar</v-btn>
                                </div>



                                <div class="d-flex my-4 items-center">
                                    <v-divider></v-divider>
                                    <span class="flex-shrink-0 mx-2 text-caption text-grey">Ou entre com</span>
                                    <v-divider></v-divider>
                                </div>


                                <div class="text-center">
                                    <v-btn class="text-capitalize mt-2" color="white" rounded="elevated"
                                        @click="loginGoogle">
                                        <v-icon class="mr-2">
                                            <icon-google></icon-google>
                                        </v-icon>
                                        Entrar con
                                        google</v-btn>

                                </div>
                            </v-card-text>
                        </v-card>
                    </v-col>


                    <!-- CALL TO REGISTER -->
                    <v-col cols="auto">
                        <v-card color="transparent" min-width="300" max-width="400" flat>
                            <v-card-text>
                                <p class="text-h5">
                                    Novo por aqui? Inscreva-se
                                </p>
                                <v-btn color="primary" rounded="pill" class="text-capitalize mt-4"
                                    :to="{ name: 'register' }">Inscrever-se</v-btn>
                            </v-card-text>
                        </v-card>
                    </v-col>
                </v-row>
            </v-container>
        </v-form>
    </section>
</template>

<script setup>
import { ref } from 'vue';

import {
    useRoute,
    useRouter,
} from 'vue-router';

import FormBox from '@/components/form/FormBox.vue';
import IconGoogle from '@/components/icons/IconGoogle.vue';
import loginSchema from '@/schemas/loginSchema';
import { useAuthStore } from '@/store/auth';

const auth = useAuthStore();

const login = ref({ email: "joao@astro.com", password: "qwertyui" })

const email = ref("joao@astro.com");
const password = ref("qwertyui");
const errors = ref(null);

async function loginEmail() {
    if (login.value.email && login.value.password) {
        try {
            errors.value = null;
            const response = await auth.loginWithEmail(login.value.email, login.value.password);
            

        } catch (error) {
            
            errors.value = error.message;
        }
    }
}
const router = useRouter();
const route = useRoute();
async function loginGoogle() {
    const user = await auth.loginWithGoogle();



    if (route.query.redirect && route.query.redirect !== "") {
        
        router.push(atob(route.query.redirect));
    }
}
</script>

<style></style>