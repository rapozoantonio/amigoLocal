<template>
    <v-divider class="mb-3"></v-divider>
    <v-card flat color="transparent" tile v-if="event">
        <v-row>
            <v-col cols="auto">
                <router-link :to="{ name: 'event-id', params: { id: event.id } }">
                    <v-img width="215" max-height="150"
                        :src="event.image ? event.image?.url : event.flyerFront ? event.flyerFront.url : '/img/placeholder_event_1.jpg'"
                        cover></v-img>
                </router-link>
            </v-col>
            <v-col class="d-flex flex-column">
                <router-link to="/events" class="text-grey-darken-1 font-weight-bold">
                    {{ event.startDate }}
                </router-link>
                <div>
                    <router-link :to="{ name: 'event-id', params: { id: event.id } }"
                        class="text-h5 font-weight-bold link">
                        {{ event.name }}
                    </router-link>
                </div>
                <router-link to="/events" class="text-white text-caption mt-2">
                    <v-icon size="large" color="red">mdi-map-marker-outline</v-icon>{{ event.location?.name }}
                </router-link>
                <p class="text-white text-caption mt-2">
                    <v-icon size="large" color="red">mdi-account-outline</v-icon>
                    {{ event.followers }}
                </p>
            </v-col>
            <v-col cols="auto" align-self="end">
                <v-btn v-if="event.code" size="x-small" rounded="pill" color="red-darken-4"><v-icon
                        start>mdi-ticket</v-icon>{{ event.code }}</v-btn>
            </v-col>
        </v-row>
    </v-card>
</template>

<script setup>
const { event } = defineProps(["event"]);
</script>

<style lang="scss" scoped>
a {
    text-decoration: none;
}

a:visited {
    color: initial;
}

a:hover {
    color: rgba(var(--v-theme-primary));
}
</style>