<template>
    <v-card flat max-width="240" min-width="240" color="transparent" v-if="event" tile>
        <v-card-text>
            <router-link :to="{ name: 'event-id', params: { id: event.id } }">
                <v-img height="320" cover
                    :src="event.image ? event.image?.url : event.flyerFront ? event.flyerFront.url : '/img/placeholder_event_1.jpg'"></v-img>
            </router-link>

            <div class="mt-2">
                <p class="text-grey-darken-1 font-weight-bold">
                    {{ event.startDate }}
                </p>
                <router-link :to="{ name: 'event-id', params: { id: event.id } }" class="text-white font-weight-bold"
                    style="font-size: 1.2rem">
                    {{ event.name }}
                </router-link>
                <p class="text-white text-caption pl-1 mt-2">
                    <v-icon size="large" color="primaryIcon">mdi-map-marker-radius-outline</v-icon>
                    {{ event.location.name }}
                </p>
                <p class="text-white text-caption pl-1 mt-2">
                    <v-icon size="large" color="primaryIcon">mdi-account-multiple</v-icon>
                    {{ event.followers }}
                </p>
            </div>
        </v-card-text>
    </v-card>
</template>

<script setup>
const { event } = defineProps(["event"]);
</script>

<style lang="scss" scoped></style>