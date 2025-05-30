<template>

    <v-card>
        <v-card-text>
            <div v-show="scannerOpen" id="qr-code-reader" width="100%"></div>
            <v-btn v-if="!scannerOpen" @click="startScanner">Open Scanner</v-btn>
        </v-card-text>
    </v-card>
</template>

<script setup>

import { Html5QrcodeScanner } from "html5-qrcode";
import { onUnmounted, ref } from "vue";
import { onMounted } from "vue";
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
const emit = defineEmits(["result"])

async function onScanSuccess(decodedText, decodedResult) {
    console.log({ decodedText, decodedResult });
    scanner.value.clear();
    scannerOpen.value = false;
    emit("result", decodedText);
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

function stopScanner() {
    scanner.value.clear();
}

onMounted(() => {
    startScanner();
})

onUnmounted(() => {
    stopScanner();
})
</script>

<style lang="scss" scoped></style>