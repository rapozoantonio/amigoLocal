<template>
  <v-divider></v-divider>
  <v-container>
    <v-row class="mt-2">
      <v-col>
        <p class="text-primary text-h3 font-weight-bold mb-5">🎧 Line-up</p>
        <div>
          <p v-html="event.lineup" class="text-h5 font-weight-bold mb-2"></p>
        </div>
      </v-col>
    </v-row>
    
  </v-container>
</template>

<script setup>
import { ref } from "vue";

import { SFacebook, STwitter, SWhatsApp } from "vue-socials";

const { event } = defineProps(["event"]);

const shareOptions = ref({
  url: "https://vue-advisor.web.app",
  quote: "Quote",
  hashtag: "#Jubilus",
});

const shareOptionsWS = ref({
  text: "See this event",
});

function onClose() {}
function onOpen() {}
function onBlock() {}
function onFocus() {}
</script>

<style lang="scss" scoped></style>
