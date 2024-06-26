<template>
    <v-form>
        <v-toolbar density="compact" style="position: sticky; top: 48px; z-index: 1">
            <v-container>
                <v-row>
                    <v-col>
                        <span>Editar evento</span>
                    </v-col>
                    <v-col>
                        <v-btn>Salvar</v-btn>

                    </v-col>
                </v-row>
            </v-container>

        </v-toolbar>

        <v-container>
            <v-row>
                <v-col cols="12">
                    <v-card v-if="event">
                        <v-card-title>
                            Basic Info
                        </v-card-title>
                        <v-card-text>
                            <v-row>
                                <!-- Field event.name -->
                                <v-col cols="12" class="pb-0 pt-2 required">
                                    <label class="text-caption required">Event name</label>
                                    <v-text-field class="required" v-bind="fieldAttrs"
                                        :rules="[rules.required, rules.lengthMin4]" required v-model="event.name">
                                    </v-text-field>
                                </v-col>
                                <!-- Field event.startDate -->
                                <v-col cols="8" sm="6" class="pb-0 pt-2 required">
                                    <label class="text-caption required">Start Date</label>
                                    <v-text-field v-bind="fieldAttrs" type="date" id="startDate"
                                        :rules="[rules.required]" required v-model="event.startDate">
                                    </v-text-field>
                                </v-col>
                                <!-- Field event.startTime -->
                                <v-col cols="4" sm="6" class="pb-0 pt-2">
                                    <label class="text-caption ">Start Time</label>
                                    <v-text-field v-bind="fieldAttrs" type="time" id="startTime"
                                        v-model="event.startTime">
                                    </v-text-field>
                                </v-col>
                                <!-- Field event.endDate -->
                                <v-col cols="8" sm="6" class="pb-0 pt-2">
                                    <label class="text-caption">End Date</label>
                                    <v-text-field v-bind="fieldAttrs" type="date" :min="event.startDate" id="endDate"
                                        v-model="event.endDate">
                                    </v-text-field>
                                </v-col>
                                <!-- Field event.endTime -->
                                <v-col cols="4" sm="6" class="pb-0 pt-2">
                                    <label class="text-caption">End Time</label>
                                    <v-text-field v-bind="fieldAttrs" type="time" id="endTime" v-model="event.endTime">
                                    </v-text-field>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-title> Lineup </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" class="pb-0 pt-1 ">
                                    <label class="text-caption">Lineup</label>
                                    <v-textarea v-bind="fieldAttrs" color="primary" id="lineup" v-model="event.lineup">
                                    </v-textarea>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-title> Generos </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" class="required">
                                    <label class="text-caption required">Generos</label>
                                    <v-autocomplete :items="genres" v-bind="fieldAttrs" closable-chips auto-select-first
                                        :clear-on-select="true" chips item-title="name"
                                        :rules="[rules.required, rules.lengthMin]" id="genres" v-model="event.genres"
                                        multiple item-value="value">
                                    </v-autocomplete>
                                </v-col>
                            </v-row>
                        </v-card-text>
                        <v-card-title> Detalhes </v-card-title>
                        <v-card-text>
                            <v-row>
                                <!-- DESCRIPTION -->
                                <v-col cols="12" class="pb-0 pt-1">
                                    <label class="text-caption">Descrição do evento</label>
                                    <v-textarea variant="outlined" density="compact" rounded="xl" color="primary"
                                        required id="details" v-model="event.description">
                                    </v-textarea>
                                </v-col>

                                <!-- IMAGE -->
                                <v-col cols="12" md="6" class="pb-0 pt-1">
                                    <label for="image" class="text-caption">Image</label>
                                    <field-image v-model="files" field="image"></field-image>
                                </v-col>

                                <!-- AGE -->
                                <!-- <v-col cols="6">
                        <span class="text-caption">Idade</span>
                        <v-select :items="ages" v-bind="fieldAttrs" item-title="name" item-value="value" id="age"
                            v-model="event.age">
                        </v-select>
                    </v-col> -->

                                <!-- PROMOTER -->
                                <v-col cols="12" md="6" class="pb-0 pt-1">
                                    <label for="promoter" class="text-caption">Promoter</label>
                                    <v-list-item v-if="event.promoter">
                                        <template #prepend>
                                            <v-avatar color="primary">
                                                <span>{{ event.promoter.name.charAt(0) }}
                                                </span>
                                            </v-avatar>
                                        </template>
                                        <v-list-item-title>{{ event.promoter.name }}</v-list-item-title>
                                        <v-list-item-subtitle>{{ event.promoter.email }}</v-list-item-subtitle>
                                    </v-list-item>
                                </v-col>

                                <!-- PRODUCER -->
                                <v-col cols="12">
                                    <span class="text-caption">Produtora</span>
                                    <field-producer v-model="event.producer"></field-producer>
                                </v-col>


                                <!-- PRICE -->
                                <v-col cols="12">
                                    <span class="text-caption">Preço</span>
                                    <field-price v-model="event.price"></field-price>
                                </v-col>


                            </v-row>
                        </v-card-text>
                        <v-card-title class="mb-4"> Images </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12" md="6" class="pb-0 pt-0">
                                    <span class="text-caption">Flyer Front</span>
                                    <field-image v-model="files" field="flyerFront"></field-image>

                                </v-col>

                                <v-col cols="12" md="6" class="pb-0 pt-0">
                                    <span class="text-caption">Flyer back</span>
                                    <field-image v-model="files" field="flyerBack"></field-image>


                                </v-col>
                            </v-row>
                        </v-card-text>

                        <v-card-title> Links </v-card-title>
                        <v-card-text>
                            <field-links v-model="event"></field-links>
                        </v-card-text>

                        <v-card-title> Media </v-card-title>
                        <v-card-text>
                            <field-medias v-model="event"></field-medias>
                        </v-card-text>

                        <v-card-title> Event visibility </v-card-title>
                        <v-card-text>
                            <v-row>
                                <v-col cols="12">
                                    <span class="text-caption">Visibility</span>
                                    <v-switch variant="outlined" density="compact" rounded="pill" color="primary">
                                    </v-switch>
                                </v-col>
                            </v-row>
                        </v-card-text>
                    </v-card>
                </v-col>
            </v-row>
            <pre>

    {{ event }}
</pre>
        </v-container>
    </v-form>

</template>

<script setup>
import {
  inject,
  onMounted,
  ref,
} from 'vue';

import { storeToRefs } from 'pinia';

import FieldImage from '@/components/fields/FieldImage.vue';
import FieldLinks from '@/components/fields/FieldLinks.vue';
import FieldMedias from '@/components/fields/FieldMedias.vue';
import FieldPrice from '@/components/fields/FieldPrice.vue';
import FieldProducer from '@/components/fields/FieldProducer.vue';
import { useEventStore } from '@/store/event';
import { useFirebaseStore } from '@/store/firebase';

const { fieldAttrs, rules } = inject("$helpers");

const firebaseStore = useFirebaseStore();
const eventStore = useEventStore();

const { event, files } = storeToRefs(eventStore);

const { id } = defineProps(["id"]);

onMounted(async () => {
    eventStore.$reset();
    const response = await firebaseStore.getDocumentById("events", id);
    console.log({ response })
    if (response.ok) {
        event.value = response.data;
    } s

})


</script>

<style lang="scss" scoped></style>