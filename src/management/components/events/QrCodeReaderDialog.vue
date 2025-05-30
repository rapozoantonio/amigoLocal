<template>

    <!-- Scan QR code modal for check-ins -->
    <v-dialog v-model="scannerVisible" fullscreen transition="dialog-bottom-transition">
        <v-card class="scanner-container">
            <v-toolbar color="primary" dark>
                <v-btn icon @click="scannerVisible = false">
                    <v-icon>mdi-close</v-icon>
                </v-btn>
                <v-toolbar-title>Check-in de convidados</v-toolbar-title>
            </v-toolbar>

            <v-card-text class="scanner-content">
                <div class="scanner-area">
                    <div class="scanner-overlay">
                        <div class="scanner-frame"></div>
                        <div class="scanner-line"></div>
                    </div>
                    <!-- This would integrate with a real scanner component -->
                    <p class="text-center mt-4">
                        Aponte a câmera para o QR code do convidado
                    </p>
                </div>

                <v-divider class="my-4"></v-divider>
                <qr-code-reader v-if="scannerVisible" @result="processCodeRead" :qrbox="250" :fps="10"></qr-code-reader>
                <v-card>

                    <v-card-text v-if="decodedGuest">
                        <v-list-item :title="decodedGuest.name" :subtitle="decodedGuest.list?.name">
                            <template #prepend>
                                <v-avatar size="35" color="primary">{{ decodedGuest.name[0] }}</v-avatar>
                            </template>
                        </v-list-item>
                        <v-btn @click="checkInGuest(decodedGuest)">CheckIn </v-btn>
                    </v-card-text>
                </v-card>

                <v-text-field v-model="manualCheckInCode" label="Ou digite o código manualmente" variant="outlined"
                    append-inner-icon="mdi-arrow-right" @click:append-inner="processManualCode" hide-details
                    class="manual-code-input"></v-text-field>
            </v-card-text>

            <v-card-actions class="pa-4">
                <v-btn block color="primary" variant="flat" @click="startScanner">
                    <v-icon start>mdi-scan</v-icon>
                    Abrir leitor de QR Code
                </v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>





</template>

<script setup>

import { Html5QrcodeScanner } from "html5-qrcode";
import { ref } from "vue";
import { onMounted } from "vue";
import { useEventListStore } from "@/management/store/eventList";
import QrCodeReader from "./QrCodeReader.vue";
const { fps, qrbox } = defineProps({
    qrbox: {
        type: Number,
        default: 250
    },
    fps: {
        type: Number,
        default: 10
    },
})

const scanner = ref(null);
const scannerOpen = ref(false);
const data = ref(null);
const decodedGuest = ref(null);
const eventListStore = useEventListStore();
const eventId = ref(null);
const guestId = ref(null);
const status = ref("checked-in");
const manualCheckInCode = ref(null);
const scannerVisible = defineModel();

function processManualCode() {

}

async function onScanSuccess(decodedText, decodedResult) {
    console.log({ decodedText, decodedResult });
    data.value = decodedText;
    scanner.value.clear();
    scannerOpen.value = false;
    await processCodeRead(decodedText);
}

function startScanner() {
    const config = {
        fps: fps,
        qrbox: qrbox,
    };
    scannerOpen.value = true;
    scanner.value = new Html5QrcodeScanner('qr-code-reader', config);
    scanner.value.render(onScanSuccess);

}

function encode(text) {
    return btoa(text);
}

async function processCodeRead(text) {
    const responseString = decode(text);
    const responseObj = JSON.parse(responseString);

    eventId.value = responseObj.eventId;
    guestId.value = responseObj.guestId;

    const result = await eventListStore.getEventGuestById(eventId.value, guestId.value);
    if (result.ok) {
        decodedGuest.value = result.data;
    }
}

async function checkInGuest(guest) {
    try {
        const response = await eventListStore.checkInGuest(eventId.value, guest);
        console.log({ response });
    } catch (error) {
        console.log({ error })
    }
}


function decode(text) {
    return atob(text);
}


</script>

<style lang="scss" scoped></style>