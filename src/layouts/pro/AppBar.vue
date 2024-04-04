<template>
    <header class="bg-[#bd1e59] p-4 text-white">
        <div class="container mx-auto flex justify-between">
            <Button
                icon="pi pi-bars"
                class="p-button-rounded p-button-text text-2xl"
            />
            <div class="flex items-center space-x-4">
                <i class="pi pi-question-circle" style="color: white"></i>
                <span class="font-bold">Ajuda</span>
                <Avatar icon="pi pi-user" class="p-overlay-badge" />
                <span class="font-bold">Danielalves1991</span>
            </div>
        </div>
    </header>
</template>

<script setup>
import Button from "primevue/button";
import Avatar from "primevue/avatar";
</script>

<style lang="scss" scoped>
</style>