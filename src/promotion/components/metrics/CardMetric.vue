<template>
    <v-card class="pa-2 px-4" max-width="200">
        <v-row align="center">
            <v-col cols="auto">
                <v-avatar tile size="50">
                    <v-icon :color="color" size="40">{{ icon }}</v-icon>
                </v-avatar>
            </v-col>
            <v-spacer></v-spacer>
            <v-col col="auto" style="vertical-align: middle;" class="text-center">
                <p class="text-h4 mx-2 mb-n1">
                    {{ count }}
                </p>
                <p class="text-caption">{{ title }}</p>
            </v-col>

        </v-row>
    </v-card>
</template>

<script setup>
const { count, icon, title, color } = defineProps(["count", "icon", "title", "color"])
</script>

<style lang="scss" scoped></style>