<template>
  <v-row>
    <v-col cols="12">
      <p class="mb-2 ml-2 text-caption">
        Adicione links do Spotify, SoundCloud, YouTube ou Mixcloud para embedar
        na sua página.
      </p>
      <v-row
        no-gutters
        v-for="(media, index) in medias"
        :key="index"
        class="mb-2"
      >
        <v-col cols="12">
          <v-text-field
            :rules="[rules.required]"
            v-bind="fieldAttrs"
            v-model.lazy="medias[index]"
            placeholder="Enter the link to the media"
            append-icon="mdi-close"
            @click:append="removeMedia(index)"
          ></v-text-field>
        </v-col>
      </v-row>
      <v-row>
        <v-col cols="12" class="pt-0">
          <v-btn
            @click="addMedia"
            class="mb-4"
            :class="[!medias || medias.length === 0 ? 'mt-2' : '']"
            variant="tonal"
            ><v-icon start>mdi-plus</v-icon> Add media</v-btn
          >
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script setup>
import { defineModel, inject } from "vue";

const { fieldAttrs, rules } = inject("$helpers");
const medias = defineModel();

function addMedia() {
  if (!medias.value || !Array.isArray(medias.value)) {
    medias.value = [""];
    return;
  }
  medias.value.push("");
}

function removeMedia(index) {
  if (medias.value.length === 1) {
    medias.value = null;
    return;
  }
  medias.value.splice(index, 1);
}
</script>

<style lang="scss" scoped></style>
