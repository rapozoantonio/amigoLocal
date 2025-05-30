<template>
    <v-col cols="6" sm="3">
        <v-card height="100%" variant="tonal" :color="color">
            <v-card-title class="text-subtitle-1 ">
                <div class="d-flex">
                    {{ title }}
                    <v-spacer></v-spacer>
                    <v-avatar class="mt-1" :color="color || 'primary'" size="x-small"><v-icon size="16">{{ icon
                            }}</v-icon></v-avatar>
                </div>
            </v-card-title>
            <v-card-text>
                <div class="mb-1">
                    <span class="text-h5 font-weight-bold me-1">{{
                        metric
                        }}</span>
                    <span v-if="total" class="text-body-1 text-grey">/ {{ total }}</span>
                </div>
                <v-progress-linear v-if="progress" height="6" :color="color"
                    :model-value="progress"></v-progress-linear>
                <div class="text-caption text-grey mt-1">
                    <span>{{
                        subtitle }}</span>
                </div>
            </v-card-text>
        </v-card>

    </v-col>

</template>

<script setup>

const { title, icon, color, metric, total, subtitle, progress } = defineProps(["title", "icon", "color", "metric", "total", "subtitle", "progress"])

</script>

<style lang="scss" scoped></style>