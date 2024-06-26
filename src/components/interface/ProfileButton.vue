<template>
    <v-btn size="32" icon v-if="auth.user">
        <v-avatar size="32" color="primary">
            <template v-if="auth.user.photoURL">
                <v-img :src="auth.user.photoURL"></v-img>
            </template>
            <span v-else>{{ initials }}</span>

        </v-avatar>
        <v-menu activator="parent">
            <v-card min-width="240">
                <v-list>
                    <v-list-item>
                        <template #prepend>
                            <v-avatar size="30" v-if="auth.user" color="primary">
                                <template v-if="auth.user.photoURL">
                                    <v-img :src="auth.user.photoURL"></v-img>
                                </template>
                                <span v-else>{{ initials }}</span></v-avatar>
                        </template>
                        <v-list-item-title class="d-flex justify-space-between">
                            <span>
                                {{ auth.user?.displayName }}
                            </span>
                            <v-chip label size="x-small">
                                {{ auth.user.role }}
                            </v-chip>
                        </v-list-item-title>
                        <v-list-item-subtitle>{{ auth.user?.email }}</v-list-item-subtitle>
                    </v-list-item>
                    <v-divider class="mt-2"></v-divider>


                    <v-list-item :to="{ name: 'pro-profile' }" link>
                        <template #prepend> <v-icon>mdi-account</v-icon></template>
                        <v-list-item-title>
                            Profile
                        </v-list-item-title>
                    </v-list-item>
                    <v-list-item link>
                        <template #prepend> <v-icon>mdi-logout</v-icon></template>
                        <v-list-item-title @click="logout">
                            Finalizar sessão
                        </v-list-item-title>
                    </v-list-item>
                    <!-- <pre>
            {{ auth.user }}
        </pre> -->
                </v-list>
            </v-card>



        </v-menu>
    </v-btn>

    <v-btn :to="{ name: 'login', query: { redirect } }" v-else>
        Sign In
    </v-btn>

</template>

<script setup>
import { computed } from 'vue';

import { useRoute } from 'vue-router';

// import { ref } from 'vue';
// import { useDisplay } from 'vuetify/lib/framework.mjs';
import { useAuthStore } from '@/store/auth';

const route = useRoute();
console.log({ route })

const initials = computed(() => {
    if (!auth.user || !auth.user.displayName) return null;
    const initArray = auth.user.displayName.split(" ");
    const firstLetter = initArray[0] ? initArray[0][0] : null;
    const secondLetter = initArray[1] ? initArray[1][0] : '';
    if (!firstLetter) return null;

    return firstLetter + secondLetter
})

const redirect = computed(() => {
    return btoa(route.fullPath);
})

const auth = useAuthStore();

function logout() {
    auth.logout();
}

// const { xs } = useDisplay();
</script>
