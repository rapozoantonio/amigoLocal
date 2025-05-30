<template>
    <v-input v-model="model" v-bind="{ ...fieldAttrs, ...$attrs }" :error-messages="errorsMessages">
        <v-text-field min-width="120" readonly :model-value="date" v-bind="{ ...fieldAttrs }"
            :rounded="fieldAttrs.rounded ? fieldAttrs.rounded + ' e-0' : 'e-0'" prepend-inner-icon="mdi-calendar">

            <v-menu v-model="dateMenu" activator="parent" location="top" :close-on-content-click="false">
                <v-card variant="tonal">
                    <v-card-text>
                        <v-date-picker hide-header @update:model-value="updateDate"></v-date-picker>

                    </v-card-text>
                    <v-card-actions>
                        <v-btn min-width="120" size="large" variant="tonal" @click="model = null">Limpar</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn min-width="120" size="large" color="primary" variant="tonal"
                            @click="dateMenu = false">OK</v-btn>
                    </v-card-actions>
                </v-card>

            </v-menu>

        </v-text-field>
        <v-text-field v-bind="{ ...fieldAttrs }" prepend-inner-icon="mdi-clock" :model-value="time"
            :rounded="fieldAttrs.rounded ? fieldAttrs.rounded + ' s-0' : 's-0'" class="rounded-s-0" readonly>
            <v-menu v-model="timeMenu" activator="parent" location="top" :close-on-content-click="false">
                <v-card variant="tonal">
                    <v-time-picker format="24hrs" v-model="time" hide-header
                        @update:model-value="updateTime"></v-time-picker>
                    <v-card-actions>
                        <v-btn min-width="120" size="large" variant="tonal" @click="model = null">Limpar</v-btn>
                        <v-spacer></v-spacer>
                        <v-btn min-width="120" size="large" color="primary" variant="tonal"
                            @click="timeMenu = false">OK</v-btn>
                    </v-card-actions>
                </v-card>
            </v-menu>
            <template #append-inner>
                <v-chip variant="text" label class="text-caption "
                    v-tooltip:bottom="'Date and Time are in the ' + timezone + ' timezone'">{{ utc
                    }}</v-chip>
            </template>
        </v-text-field>
    </v-input>


</template>

<script setup>
import {
    defineModel,
    inject,
    onMounted,
    watch,
    computed,
    ref
} from 'vue';
import { errorMessages } from 'vue/compiler-sfc';

const { label, min } = defineProps({ label: { type: [Boolean, String], default: false }, min: { type: [Number, String, null] } })

const model = defineModel();
const { fieldAttrs } = inject("$helpers");
const timeMenu = ref(false);
const dateMenu = ref(false);
const errorsMessages = ref(null);
const utc = computed(() => {
    const offset = new Date().getTimezoneOffset();
    const hours = offset / -60;
    return `UTC ${hours === 0 ? '' : hours > 0 ? '+' + hours : '-' + hours}`
})

const timezone = computed(() => {
    return Intl.DateTimeFormat().resolvedOptions().timeZone;
})

const time = computed(
    {
        set(newValue) {
            const [h, m] = newValue.split(":");
            model.value = new Date(new Date(model.value).setHours(h, m))
        },
        get() {
            if (!model.value) return null;
            return new Date(model.value).toLocaleTimeString().slice(0, 5);

        }
    }

)

const date = computed(() => {
    if (!model.value) return null;
    return new Date(model.value).toLocaleDateString();
}

)

function updateDate(date) {
    if (!date) model.value = date;
    console.log({ date })
    if (time.value) {
        const [h, m] = time.value.split(":");
        model.value = new Date(date.setHours(h, m)).toISOString();
    }
    model.value = date.toISOString();
    dateMenu.value = false;
    timeMenu.value = true;

}

function updateTime(time) {
    console.log({ time });
    const [h, m] = time.split(":");
    const date = new Date(model.value);
    model.value = new Date(date.setHours(h, m)).toISOString();
    timeMenu.value = false;

}

watch(model, () => {
    console.log("watch")
    if (min && model.value < min) {
        console.log("model menos")
        model.value = min;
        errorsMessages.value = "A data não pode ser inferior a " + new Date(min);
        setTimeout(() => {
            errorsMessages.value = null
        }, 2000)
    }
})

onMounted(() => {
})

</script>

<style lang="scss" scoped></style>