<template>
    <div>
        <div class="flex flex-column pr-4">
            <div>
                <h3 class="text-3xl">/ BÁSICO</h3>
                {{ completed }}
                <!-- EVENT NAME -->
                <div class="flex flex-column gap-1">
                    <label class="text-sm" for="name">Nome do evento</label>
                    <InputText
                        class="border-round-3xl"
                        id="name"
                        v-model="event.name"
                        @blur="$v.name.$touch"
                        :invalid="$v.name.$error"
                    />
                    <small v-if="$v.name.$error" class="text-red-500 text-xs">{{
                        $v.name.$errors[0].$message
                    }}</small>
                </div>
                <!-- START -->
                <div class="flex mt-4 gap-4">
                    <div class="flex flex-column gap-1 flex-grow-1">
                        <label class="text-sm" for="startDate"
                            >Data de inicio</label
                        >
                        <Calendar
                            inputClass="border-round-3xl"
                            id="startDate"
                            :hideOnDateTimeSelect="true"
                            v-model="event.startDate"
                            dateFormat="dd/mm/yy"
                            :invalid="$v.startDate.$error"
                            iconDisplay="input"
                            show-icon
                        />
                        <small
                            v-if="$v.startDate.$error"
                            class="text-red-500 text-xs"
                            >{{ $v.startDate.$errors[0].$message }}</small
                        >
                    </div>
                    <div class="flex flex-column gap-1 flex-grow-1">
                        <label class="text-sm" for="startTime"
                            >Hora de inicio</label
                        >
                        <Calendar
                            inputClass="border-round-3xl"
                            id="startTime"
                            v-model="event.startTime"
                            :stepMinute="15"
                            timeOnly
                            showIcon
                            icon="pi pi-clock"
                            iconDisplay="input"
                            :invalid="$v.startTime.$error"
                        />
                        <small
                            v-if="$v.startTime.$error"
                            class="text-red-500 text-xs"
                            >{{ $v.startTime.$errors[0].$message }}</small
                        >
                    </div>
                </div>
                <!-- END -->
                <div class="flex mt-4 gap-4">
                    <div class="flex flex-column gap-1 flex-grow-1">
                        <label class="text-sm" for="endDate">Data de fim</label>
                        <Calendar
                            inputClass="border-round-3xl"
                            id="endDate"
                            iconDisplay="input"
                            :minDate="event.startDate"
                            v-model="event.endDate"
                            dateFormat="dd/mm/yy"
                            showIcon
                        />
                    </div>
                    <div class="flex flex-column gap-1 flex-grow-1">
                        <label class="text-sm" for="endTime">Hora de fim</label>
                        <Calendar
                            inputClass="border-round-3xl"
                            id="endTime"
                            v-model="event.endTime"
                            :stepMinute="15"
                            timeOnly
                            iconDisplay="input"
                            showIcon
                            icon="pi pi-clock"
                        />
                    </div>
                </div>

                <h3 class="text-3xl">/ LOCAL</h3>
                <div class="flex flex-wrap gap-3">
                    <div class="flex align-items-center">
                        <RadioButton
                            v-model="event.definedPlace"
                            :value="true"
                            inputId="known"
                            name="known"
                        />
                        <label for="known" class="ml-2">Local conhecido</label>
                    </div>
                    <div class="flex align-items-center">
                        <RadioButton
                            v-model="event.definedPlace"
                            inputId="unknown"
                            name="unknown"
                            :value="false"
                        />
                        <label for="unknown" class="ml-2"
                            >Local a definir</label
                        >
                    </div>
                </div>

                <template v-if="event.definedPlace">
                    <div class="flex flex-column gap-1 mt-4">
                        <label class="text-sm" for="name">Local</label>
                        <InputText
                            id="name"
                            v-model="event.localName"
                            class="border-round-3xl"
                        />
                    </div>
                </template>
                <template v-else>
                    <div class="flex mt-4 gap-4">
                        <div class="flex flex-column gap-1 flex-grow-1">
                            <label class="text-sm" for="name">País</label>
                            <Dropdown
                                id="name"
                                v-model="event.country"
                                class="border-round-3xl"
                            />
                        </div>
                        <div class="flex flex-column gap-1 flex-grow-1">
                            <label class="text-sm" for="name">Região</label>
                            <Dropdown
                                id="name"
                                v-model="event.region"
                                class="border-round-3xl"
                            />
                        </div>
                    </div>

                    <div class="flex flex-column gap-1 mt-4">
                        <label class="text-sm" for="name">Local</label>
                        <InputText
                            id="name"
                            v-model="event.localName"
                            class="border-round-3xl"
                        />
                    </div>
                </template>
            </div>
            <div class="flex py-4 justify-content-end">
                <Button
                    :disabled="!completed[1]"
                    label="Next"
                    @click="props.nextCallback"
                />
            </div>
        </div>
    </div>
</template>

<script setup >
import { useEventStore } from "@/store/event.js";
import { defineProps } from "vue";
import { storeToRefs } from "pinia";

const props = defineProps(["nextCallback"]);

const store = useEventStore();
const { event, $v, completed } = storeToRefs(store);

console.log({ $v });
/* 
FIELDS

name            String      --required
startDate       Date        --required
startTime       Date        --required
endData         Date        --required
endTime         Date        --required
definedPlace    Boolean
localName       String      --required
country         String
region          String



*/
</script>

<style lang="scss" scoped>
</style>