<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="6">
                <div class="event-details">
                    <p>
                        {{ event.description }}
                    </p>
                </div>
                <v-row class="mt-4">
                    <!-- <v-col cols="6">
                        <p class="text-caption text-grey">
                            Administrador do evento
                        </p>
                        <p>Amandava bras</p>
                    </v-col> -->


                    <v-col cols="12" v-if="event.links">
                        <p class="text-caption text-grey">
                            Links
                        </p>
                        <div v-for="link in event.links" :key="link.name">
                            <a link class="link" target="_blank"
                                :href="!link.url.includes('http') ? 'http://' + link.url : link.url">{{ link.name }}
                                <v-icon class="mb-1" size="x-small">mdi-open-in-new</v-icon></a>
                        </div>

                    </v-col>



                    <v-col cols="12" v-if="event.price">
                        <p class="text-caption text-grey">Preços</p>
                        <p v-for="{ name, value } in event.price" :key="name">{{ name }}: R$ {{ value }}</p>
                    </v-col>

                    <v-col cols="6">
                        <p class="text-caption text-grey">
                            Última actualización
                        </p>
                        <p>{{ new Date(event.updated_at?.toDate()).toLocaleString("pt-BR") }}</p>
                    </v-col>

                    <v-col cols="6">
                        <p class="text-caption text-grey">Edad mínima</p>
                        <p>{{ event.age }}</p>
                    </v-col>


                    <!-- <v-col cols="6">
                        <p class="text-caption text-grey">
                            ¿Tiene alguna pregunta sobre el evento?
                        </p>
                        <p>Ponerse en contacto con el promotor</p>
                    </v-col> -->
                </v-row>
            </v-col>
            <v-col cols="12" md="6">
                <v-img
                    :src="event.image ? event.image?.url : event.flyerFront ? event.flyerFront.url : '/img/placeholder_event_1.jpg'">
                </v-img>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
const { event } = defineProps(["event"]);
</script>

<style lang="scss" scoped>
.event-details p {
    padding-bottom: 16px;
}
</style>