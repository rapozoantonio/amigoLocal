<template>
    <v-col class="pa-0 pt-2" v-if="type === 'header'" cols="12">
        <!-- HEADER -->
        <v-card-title class="text-subtitle-1">{{ label }}</v-card-title>
    </v-col>

    <v-col class="pt-4" v-else-if="type === 'divider'" cols="12">
        <!-- DIVIDER -->
        <v-divider opacity="0.8" thickness="2" color="grey" v-if="label">
            <div class="d-flex">
                <v-icon start color="grey" v-if="icon">{{ icon }}</v-icon>
                <span class="text-grey">{{ label }}</span>
            </div>
        </v-divider>
        <v-divider opacity="0.8" thickness="2" color="grey" v-else> </v-divider>
    </v-col>



    <v-col v-else :cols="col" :md="md" :sm="md"
        :class="{ 'd-flex': labelType === 'left', required: rules.find(i => i === 'required') }">
        <p v-if="prepend" class="text-body-2">{{ prepend }}</p>


        <p v-if="showLabelUp" class="mb-1 ml-2 text-caption" :for="id"> <v-icon start v-if="icon">{{
            icon }}</v-icon>{{ label || name || id }}</p>
        <p v-else-if="labelType === 'left'" class="mt-3 text-caption  text-right mr-3 field-label" :for="id"> <v-icon
                start v-if="icon">{{
                    icon }}</v-icon><span v-if="showLabelLeft">
                {{ label || name
                    || id }}
            </span></p>



        <!-- TEXT, DATE, TIME -->
        <template v-if="['text', 'date', 'time', 'date+18'].includes(type)">
            <v-text-field :type="type === 'date+18' ? 'date' : type" v-model="model[id]"
                v-bind="{ ...fieldAttrs, ...attrs }" :max="type === 'date+18' ? minDate : null">
            </v-text-field>
        </template>

        <!-- CHECKBOX -->
        <template v-else-if="type === 'checkbox'">
            <v-checkbox v-model="model[id]" v-bind="{ ...fieldAttrs, ...attrs }">
                <template #label>
                    <span class="ml-2" v-html="label || id">
                    </span>
                </template>
            </v-checkbox>
        </template>


        <!-- EMAIL -->
        <template v-else-if="type === 'email'">
            <v-text-field type="email" v-model="model[id]" v-bind="{ ...fieldAttrs, ...attrs }">
            </v-text-field>
        </template>

        <!-- PASSWORD -->
        <template v-else-if="type === 'password'">
            <v-text-field id="password" name="password" :type="showPassword
                ? 'text'
                : 'password'
                " :append-inner-icon="showPassword
                    ? 'mdi-eye'
                    : 'mdi-eye-off'
                    " @click:append-inner="
                        showPassword = !showPassword
                        " v-model="model[id]" v-bind="{ ...fieldAttrs, ...attrs }"></v-text-field>
        </template>

        <!-- SWITCH -->
        <template v-else-if="type === 'switch'">
            <v-switch class="ml-2" v-model="model[id]" v-bind="{ ...fieldAttrs, ...attrs }">
                <template #label>
                    <span class="ml-2" v-html="label || id">
                    </span>
                </template>
            </v-switch>
        </template>



        <!-- TEXTAREA -->
        <template v-else-if="type === 'textarea'">
            <v-textarea v-model="model[id]" v-bind="{ ...fieldAttrs, ...attrs }">
            </v-textarea>
        </template>

        <!-- AUTOCOMPLETE -->
        <template v-else-if="type === 'autocomplete'">
            <v-autocomplete @update:focused="updateInput" v-model="model[id]" v-bind="{ ...fieldAttrs, ...attrs }"
                :items="items" closable-chips auto-select-first :clear-on-select="true" chips item-title="name" multiple
                item-value="value">
            </v-autocomplete>
        </template>

        <!-- AUTOCOMPLETE -->
        <template v-else-if="type === 'select'">
            <v-autocomplete @update:focused="updateInput" v-model="model[id]" v-bind="{ ...fieldAttrs, ...attrs }"
                :items="items" auto-select-first :clear-on-select="true" item-title="name" item-value="value">
            </v-autocomplete>
        </template>

        <!-- IMAGE -->
        <template v-else-if="type === 'image'">
            <field-image v-model:model="model[id]" v-model:files="files"
                v-bind="{ ...fieldAttrs, ...attrs, ...$attrs }">
            </field-image>
        </template>

        <!-- CUSTOM-COUNTRY -->
        <template v-else-if="type === 'custom-country'">
            <field-country v-model="model[id]" v-bind="{ ...fieldAttrs, ...attrs }">
            </field-country>
        </template>

        <!-- CUSTOM-REGION -->
        <template v-else-if="type === 'custom-region'">
            <field-region v-model="model[id]" :country="model.country || 'BR'" v-bind="{ ...fieldAttrs, ...attrs }">
            </field-region>
        </template>

        <!-- CUSTOM-PRICE -->
        <template v-else-if="type === 'custom-price'">
            <field-price v-model="model[id]" v-bind="{ ...fieldAttrs, ...attrs }">
            </field-price>
        </template>

        <!-- CUSTOM-MEDIAS -->
        <template v-else-if="type === 'custom-medias'">
            <field-medias v-model="model[id]" v-bind="{ ...fieldAttrs, ...attrs }">
            </field-medias>
        </template>

        <!-- CUSTOM-PRODUCER -->
        <template v-else-if="type === 'custom-producer'">
            <field-producer v-model="model[id]" v-bind="{ ...fieldAttrs, ...attrs }">
            </field-producer>
        </template>

        <!-- CUSTOM-LOCATION -->
        <template v-else-if="type === 'custom-location'">
            <field-location v-model="model[id]" v-bind="{ ...fieldAttrs, ...attrs }">
            </field-location>
        </template>

        <!-- CUSTOM-LOCATION -->
        <template v-else-if="type === 'custom-promoter'">
            <field-promoter v-model="model[id]" v-bind="{ ...fieldAttrs, ...attrs }">
            </field-promoter>
        </template>

        <!-- CUSTOM-LINKS -->
        <template v-else-if="type === 'custom-links'">
            <field-links v-model="model[id]" v-bind="{ ...fieldAttrs, ...attrs }">
            </field-links>
        </template>

        <!-- CUSTOM-USERNAME -->
        <template v-else-if="type === 'custom-username'">
            <field-username v-model="model[id]" v-bind="{ ...fieldAttrs, ...attrs }">
            </field-username>
        </template>

    </v-col>

</template>

<script setup>
import {
    computed,
    inject,
    onMounted,
    onUpdated,
    readonly,
    ref,
    watch,
    watchEffect,
} from 'vue';

import FieldCountry from '../fields/FieldCountry.vue';
import FieldImage from '../fields/FieldImage.vue';
import FieldLinks from '../fields/FieldLinks.vue';
import FieldLocation from '../fields/FieldLocation.vue';
import FieldMedias from '../fields/FieldMedias.vue';
import FieldPrice from '../fields/FieldPrice.vue';
import FieldProducer from '../fields/FieldProducer.vue';
import FieldPromoter from '../fields/FieldPromoter.vue';
import FieldRegion from '../fields/FieldRegion.vue';
import FieldUsername from '../fields/FieldUsername.vue';

const { fieldAttrs, rules: fieldRules } = inject("$helpers");
const model = defineModel("model");
const files = defineModel("files");

const showPassword = ref(false);

const initialValue = ref(null);

const changed = computed(() => {
    return model.value[id] !== initialValue.value
})


const { id, size, type, rules, label, labelType, field, items, initial, icon, multiple, text, prepend, readOnly } = defineProps({
    // name: {
    //     type: String, required: true,
    // },
    type: {
        type: String, required: true,
    },
    size: {
        type: [String, Number], default: "lg",
    },
    id: {
        type: String, required: true,
    },
    rules: {
        type: Array, default: () => ([])
    },
    labelType: {
        type: String, default: "up"  // in out left
    },
    label: {
        type: String
    },
    items: {
        type: Object, default: () => []
    },
    initial: {
        type: null
    },
    icon: {
        type: [String, null]
    },
    multiple: {
        type: [Boolean, null]
    },
    text: {
        type: [String, null]
    },
    prepend: {
        type: null
    },
    readOnly: {
        type: null
    },
})

const col = computed(() => {
    if (typeof size === "number") {
        return size
    }
    return size === "xs" ? "6" : size === "sm" ? "12" : size === "md" ? "12" : "12"
})

function updateInput(event) {
    
    dirty.value = true;
}

const minDate = computed(() => {
    const today = new Date();
    const minYear = today.getFullYear() - 18;
    const minDate = new Date();
    minDate.setFullYear(minYear);
    const minDateString = minDate.toISOString().split('T')[0];
    return minDateString;
})

const md = computed(() => {
    if (typeof size === "number") {
        return size
    }
    return size === "xs" ? "3" : size === "sm" ? "6" : size === "md" ? "9" : "12"
})

const stateColor = computed(() => {
    if ((changed.value || dirty.value) && model.value) {
        return {
            base: "teal",
            bg: "#0096880d"
        }
    }
    if (highlighted.value) {
        return {
            base: "yellow",
            bg: "#ffeb3b12"
        }
    }
    return {
        base: null,
        bg: null
    }

})

const attrs = computed(() => {
    return {
        rules: [...rules.map(r => fieldRules[r])],
        label: labelType === 'in' ? label ? label : id : null,
        field: id,
        class: {
            required: rules.find(i => i === 'required'),
            "flex-grow-1": true
        },
        required: rules.find(i => i === 'required'),
        multiple: !!multiple,
        disabled: readOnly ? true : false,
        baseColor: stateColor.value.base,
        bgColor: stateColor.value.bg,
        color: stateColor.value.base || "primary",
    }
})

const showLabelUp = computed(() => {
    return labelType === 'up' && !["checkbox", "switch"].includes(type)
})

const showLabelLeft = computed(() => {
    return labelType === 'left' && !["checkbox", "switch"].includes(type)
})

const highlighted = ref(false);
const dirty = ref(false);

onMounted(() => {
    // 
    if (!model.value[id] && initial) {
        model.value[id] = initial;
        highlighted.value = true;
        initialValue.value = initial;
        return;
    }
    initialValue.value = model.value[id];
})




</script>

<style lang="scss" scoped></style>