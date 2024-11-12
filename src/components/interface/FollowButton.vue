<template>
    <div>
        <v-btn v-if="!isFollowing" @click="follow" color="primary" rounded="pill" variant="outlined">
            <v-icon start>mdi-account-plus-outline</v-icon>Seguir
        </v-btn>
        <v-btn v-else color="green" rounded="pill" variant="outlined">
            <v-icon start>mdi-account-check-outline</v-icon>Seguindo
            <v-menu activator="parent">
                <v-list>
                    <v-list-item link @click="unfollow">
                        Deixar de Seguir
                    </v-list-item>
                </v-list>
            </v-menu>
        </v-btn>
    </div>
</template>

<script setup>
import { computed } from 'vue';

import { storeToRefs } from 'pinia';

import { useAuthStore } from '@/store/auth';
import { useEventsStore } from '@/store/events';
import { useFirebaseStore } from '@/store/firebase';
import { useLocationsStore } from '@/store/locations';
import { useUserStore } from '@/store/user';

const firebase = useFirebaseStore();
const auth = useAuthStore();
const userStore = useUserStore();
const eventsStore = useEventsStore();
const locationsStore = useLocationsStore();

const { event } = storeToRefs(eventsStore);
const emit = defineEmits(["follow", "unfollow"])
const { location } = storeToRefs(locationsStore);
const { entity_id, entity } = defineProps(["entity_id", "entity"]);
const { follows, user } = storeToRefs(userStore);

const isFollowing = computed(() => {
    if (!follows.value[entity]) {
        return false;
    }
    return follows.value[entity].includes(entity_id)
})

async function follow() {
    try {
        await firebase.addFollow(entity, entity_id, auth.user);
        await userStore.getFollows(auth.user.uid);
        emit("follow")
        return true
    } catch (error) {
        
        return false
    }

}

async function unfollow() {
    try {
        await firebase.removeFollow(entity, entity_id, auth.user);
        await userStore.getFollows(auth.user.uid);
        emit("unfollow")
        return true
    } catch (error) {
        
        return false
    }
}

</script>

<style lang="scss" scoped></style>