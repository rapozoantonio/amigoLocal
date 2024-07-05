<template>
    <v-container>
        <v-row class="mt-2">
            <v-col>
                <p class="text-primary text-h3 font-weight-bold mb-5">
                    / Lineup
                </p>
                <div>
                    <p v-html="event.lineup" class="text-h5 font-weight-bold mb-2">
                    </p>

                    <!-- <p class="text-grey text-h5 font-weight-bold mb-2">
                        Banda Sonara Valencia
                    </p>
                    <p class="text-h5 font-weight-bold mb-2">
                        Samba do quintal
                    </p> -->
                </div>
            </v-col>
            <v-col cols="auto">
                <span class="text-caption mr-4">Compartir</span>
                <s-facebook :window-features="{}" :share-options="shareOptions" :use-native-behavior="false"
                    @popup-close="onClose" @popup-open="onOpen" @popup-block="onBlock" @popup-focus="onFocus">

                    <v-hover>
                        <template v-slot:default="{ isHovering, props }">
                            <v-btn class="ml-2" v-bind="props" size="small" color="white"
                                :variant="isHovering ? 'elevated' : 'outlined'"
                                icon><v-icon>mdi-facebook</v-icon></v-btn>
                        </template>
                    </v-hover>
                </s-facebook>

                <s-twitter :window-features="windowFeatures" :share-options="shareOptions"
                    :use-native-behavior="useNativeBehavior" @popup-close="onClose" @popup-open="onOpen"
                    @popup-block="onBlock" @popup-focus="onFocus"> <v-hover>
                        <template v-slot:default="{ isHovering, props }">
                            <v-btn class="ml-2" v-bind="props" size="small" color="white"
                                :variant="isHovering ? 'elevated' : 'outlined'"
                                icon><v-icon>mdi-twitter</v-icon></v-btn>
                        </template>
                    </v-hover></s-twitter>

                <s-whats-app :window-features="windowFeatures" :share-options="shareOptionsWS"
                    :use-native-behavior="useNativeBehavior" @popup-close="onClose" @popup-open="onOpen"
                    @popup-block="onBlock" @popup-focus="onFocus"> <v-hover>
                        <template v-slot:default="{ isHovering, props }">
                            <v-btn class="ml-2" v-bind="props" size="small" color="white"
                                :variant="isHovering ? 'elevated' : 'outlined'"
                                icon><v-icon>mdi-whatsapp</v-icon></v-btn>
                        </template>
                    </v-hover></s-whats-app>

            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12">
                <p class="text-caption text-grey mb-2">Genres</p>
                <div class="d-flex">
                    <v-chip class="mr-2" label variant="outlined" size="small" color="primary" link
                        v-for="genre in event.genres" :key="genre">
                        <span class="text-white">
                            {{ genre }}
                        </span>
                    </v-chip>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref } from 'vue';

import {
  SFacebook,
  STwitter,
  SWhatsApp,
} from 'vue-socials';

const { event } = defineProps(["event"]);

const shareOptions = ref({
    url: "https://vue-advisor.web.app",
    quote: 'Quote',
    hashtag: "#Jubilus"
})

const shareOptionsWS = ref({
    text: "See this event"
})

function onClose() { }
function onOpen() { }
function onBlock() { }
function onFocus() { }

</script>

<style lang="scss" scoped></style>