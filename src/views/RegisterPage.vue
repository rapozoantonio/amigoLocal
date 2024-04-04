<template>
    <section>
        <div class="bg-grey-darken-4">
            <div class="p-fluid">
                <div class="p-grid">
                    <div class="p-col-12">
                        <h2>Inscrever-se</h2>
                    </div>
                </div>
            </div>
        </div>
        <form @submit.prevent="submitRegister" class="p-fluid">
            <div class="p-grid">
                <div class="p-col-12 p-md-8">
                    <Card>
                        <h3>/ Seus dados</h3>

                        <!-- SOBRE VOCÊ -->
                        <h4>Sobre você</h4>
                        <div class="p-grid">
                            <div class="p-col-12 p-md-6">
                                <label for="name">Name</label>
                                <InputText
                                    id="name"
                                    v-model.trim="$v.user.name.$model"
                                />
                                <small v-if="$v.user.name.$error"
                                    >Campo obrigatório</small
                                >
                            </div>
                            <div class="p-col-12 p-md-6">
                                <label for="surname">Surname</label>
                                <InputText
                                    id="surname"
                                    v-model.trim="$v.user.surname.$model"
                                />
                                <small v-if="$v.user.surname.$error"
                                    >Campo obrigatório</small
                                >
                            </div>
                            <div class="p-col-12 p-md-6">
                                <label for="gender">Gender</label>
                                <InputText id="gender" v-model="user.gender" />
                            </div>
                            <div class="p-col-12 p-md-6">
                                <label for="language">Language</label>
                                <Dropdown
                                    id="language"
                                    v-model="user.language"
                                    :options="languages"
                                    optionLabel="title"
                                    placeholder="Selecione um idioma"
                                />
                                <small v-if="$v.user.language.$error"
                                    >Campo obrigatório</small
                                >
                            </div>
                        </div>

                        <!-- INFORMAÇÕES DE LOGIN -->
                        <h4>Informações de Login</h4>
                        <div class="p-grid">
                            <div class="p-col-12 p-md-6">
                                <label for="email">Email</label>
                                <InputText
                                    id="email"
                                    type="email"
                                    v-model.trim="$v.user.email.$model"
                                />
                                <small v-if="$v.user.email.$error"
                                    >Campo obrigatório</small
                                >
                            </div>
                            <div class="p-col-12 p-md-6">
                                <label for="email_confirm"
                                    >Confirmar email</label
                                >
                                <InputText
                                    id="email_confirm"
                                    type="email"
                                    v-model="emailConfirm"
                                />
                                <!-- Adicionar validação customizada para confirmação de email -->
                            </div>
                            <div class="p-col-12 p-md-6">
                                <label for="username">Nome de usuario</label>
                                <InputText
                                    id="username"
                                    v-model.trim="$v.user.username.$model"
                                />
                                <small v-if="$v.user.username.$error"
                                    >Campo obrigatório</small
                                >
                            </div>
                            <div class="p-col-12 p-md-6">
                                <label for="password">Senha</label>
                                <Password
                                    id="password"
                                    v-model="user.password"
                                    toggleMask
                                />
                                <small v-if="$v.user.password.$error"
                                    >Campo obrigatório</small
                                >
                            </div>
                        </div>

                        <!-- LOCALIZAÇÃO -->
                        <h4>Localização</h4>
                        <div class="p-grid">
                            <div class="p-col-12 p-md-6">
                                <label for="country">País</label>
                                <InputText
                                    id="country"
                                    v-model.trim="$v.user.country.$model"
                                />
                                <small v-if="$v.user.country.$error"
                                    >Campo obrigatório</small
                                >
                            </div>
                            <div class="p-col-12 p-md-6">
                                <label for="region">Área</label>
                                <InputText id="region" v-model="user.region" />
                                <!-- Adicionar validação se necessário -->
                            </div>
                        </div>

                        <!-- ANIVERSÁRIO -->
                        <h4>Aniversário</h4>
                        <div class="p-grid">
                            <div class="p-col-12 p-md-4">
                                <label for="birthday">Dia</label>
                                <InputText
                                    id="birthday"
                                    v-model="user.birthday"
                                />
                            </div>
                            <div class="p-col-12 p-md-4">
                                <label for="birthmonth">Mês</label>
                                <InputText
                                    id="birthmonth"
                                    v-model="user.birthmonth"
                                />
                            </div>
                            <div class="p-col-12 p-md-4">
                                <label for="birthyear">Ano</label>
                                <InputText
                                    id="birthyear"
                                    v-model="user.birthyear"
                                />
                            </div>
                        </div>

                        <!-- MARKETING CONSENT -->
                        <h4>Junte-se à comunidade</h4>
                        <p>
                            Inscreva-se na Newsletter semanal da RA para receber
                            atualizações sobre as últimas notícias e eventos.
                        </p>
                        <Checkbox
                            label="Se inscrever"
                            v-model="user.emailOptin"
                        />
                        <Button
                            label="Registrar"
                            @click="submitRegister"
                            :loading="loading"
                        ></Button>
                        <p>
                            Ao se registrar, você indica que leu e concorda com
                            os Termos de Uso e a Política de Privacidade.
                        </p>
                    </Card>
                </div>
                <div class="p-col-12 p-md-4">
                    <Card>
                        <h4>Já tem uma conta?</h4>
                        <Button label="Entrar"></Button>
                    </Card>
                </div>
            </div>
        </form>
    </section>
</template>
  
  <script setup>
import { ref } from "vue";
import { useVuelidate } from "@vuelidate/core";
import { required } from "@vuelidate/validators";
import {
    Button,
    Card,
    InputText,
    Dropdown,
    Password,
    Checkbox,
} from "primevue";

// Dados de exemplo para os idiomas
const languages = [
    { title: "English", value: "en" },
    { title: "Spanish", value: "es" },
    { title: "Portuguese", value: "pt" },
    { title: "Italian", value: "it" },
];

const user = ref({
    name: "",
    surname: "",
    gender: "",
    language: null,
    email: "",
    password: "",
    username: "",
    birthday: "",
    birthmonth: "",
    birthyear: "",
    country: "",
    region: "",
    emailOptin: false,
});

const { $v } = useVuelidate(
    {
        user: {
            name: { required },
            surname: { required },
            gender: {}, // sem validação específica
            language: { required },
            email: { required },
            password: { required },
            username: { required },
            country: { required },
            // Adicione mais validações conforme necessário
        },
    },
    { user }
);

const loading = ref(false);

async function submitRegister() {
    $v.value.$touch();
    if (!$v.value.$invalid) {
        loading.value = true;
        // Implemente o envio de dados aqui
        alert("Formulário enviado!");
        loading.value = false;
    }
}

const emailConfirm = ref("");
</script>
  