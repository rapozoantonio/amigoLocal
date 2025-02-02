<template>
  <v-dialog v-if="isLargeScreen">
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        v-bind="activatorProps"
        color="primary"
        rounded="pill"
        density="comfortable"
        :variant="isHovering ? 'elevated' : 'flat'"
      >
        <v-icon start>mdi-share</v-icon>
        Compartilhar
      </v-btn>
    </template>

    <template v-slot:default="{ isActive }">
      <v-row class="fill-height justify-center align-center">
        <v-col cols="12" md="4">
          <v-card class="d-flex pa-4 pb-3">
            <div class="d-flex flex-column ga-2 w-100 p-x-6">
              <p class="text-h4">Compartilhar</p>
              <v-divider :thickness="2" class="my-1"></v-divider>

              <div
                class="d-flex flex-row ga-4 mt-2 w-100 align-center justify-center"
              >
                <div
                  class="d-flex flex-column ga-2 align-center justify-center"
                >
                  <s-facebook
                    :window-features="{}"
                    :share-options="shareOptions"
                    :use-native-behavior="false"
                  >
                    <v-hover>
                      <template v-slot:default="{ isHovering, props }">
                        <v-btn
                          v-bind="props"
                          size="large"
                          color="white"
                          :variant="isHovering ? 'elevated' : 'outlined'"
                          icon
                        >
                          <v-icon size="30">mdi-facebook</v-icon>
                        </v-btn>
                      </template>
                    </v-hover>
                  </s-facebook>
                  <p>Facebook</p>
                </div>

                <div
                  class="d-flex flex-column ga-2 align-center justify-center"
                >
                  <a
                    href="https://www.tiktok.com/share/video/@username/1234567890"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <v-hover>
                      <template v-slot:default="{ isHovering, props }">
                        <v-btn
                          v-bind="props"
                          size="large"
                          color="white"
                          :variant="isHovering ? 'elevated' : 'outlined'"
                          icon
                        >
                          <v-img
                            :src="tiktokSvg"
                            alt="TikTok Icon"
                            style="width: 30px; height: 30px"
                          />
                        </v-btn>
                      </template>
                    </v-hover>
                  </a>
                  <p>TikTok</p>
                </div>

                <div
                  class="d-flex flex-column ga-2 align-center justify-center"
                >
                  <a
                    href="https://www.instagram.com/"
                    target="_blank"
                    rel="nofollow noopener noreferrer"
                  >
                    <v-hover>
                      <template v-slot:default="{ isHovering, props }">
                        <v-btn
                          v-bind="props"
                          size="large"
                          color="white"
                          :variant="isHovering ? 'elevated' : 'outlined'"
                          icon
                        >
                          <v-img
                            :src="InstagramSvg"
                            alt="Instagram Icon"
                            style="width: 30px; height: 30px"
                          />
                        </v-btn>
                      </template>
                    </v-hover>
                  </a>
                  <p>Instagram</p>
                </div>

                <div
                  class="d-flex flex-column ga-2 align-center justify-center"
                >
                  <s-whats-app
                    :window-features="windowFeatures"
                    :share-options="shareOptionsWS"
                  >
                    <v-hover>
                      <template v-slot:default="{ isHovering, props }">
                        <v-btn
                          v-bind="props"
                          size="large"
                          color="white"
                          :variant="isHovering ? 'elevated' : 'outlined'"
                          icon
                        >
                          <v-icon size="30">mdi-whatsapp</v-icon>
                        </v-btn>
                      </template>
                    </v-hover>
                  </s-whats-app>
                  <p>WhatsApp</p>
                </div>
              </div>

              <v-divider class="my-2" :thickness="2"></v-divider>

              <v-row align="center" justify="center">
                <v-col cols="12" md="11" class="d-flex flex-row mt-2">
                  <v-text-field
                    v-model="urlToShow"
                    label="Pagina URL"
                    readonly
                    outlined
                    @click="copyUrl"
                  >
                  </v-text-field>
                  <v-btn
                    variant="text"
                    size="large"
                    class="d-flex justify-center align-center"
                    tile
                    @click="copyUrl"
                  >
                    <v-icon size="29">mdi-content-copy</v-icon>
                  </v-btn>
                </v-col>
              </v-row>
            </div>

            <!-- Snackbar for URL copied notification -->
            <v-snackbar
              v-model="snackbar"
              :timeout="3000"
              color="black"
              elevation="24"
            >
              Copiado com sucesso!
            </v-snackbar>
          </v-card></v-col
        ></v-row
      >
    </template>
  </v-dialog>

  <!-- Bottom sheet for small screens -->
  <v-bottom-sheet v-else v-model="bottomSheetVisible">
    <!-- Activator slot for the bottom sheet button -->
    <template v-slot:activator="{ props: activatorProps }">
      <v-btn
        class="d-flex"
        v-bind="activatorProps"
        color="primary"
        rounded="pill"
        :variant="isHovering ? 'elevated' : 'flat'"
        @click="bottomSheetVisible = true"
      >
        <v-icon start>mdi-share</v-icon>
        Compartilhar
      </v-btn>
    </template>

    <v-card class="d-flex pa-2 py-6">
      <div class="d-flex flex-column ga-4 w-100 p-x-6">
        <p class="text-h6 px-1">Compartilhar</p>
        <v-divider :thickness="2"></v-divider>

        <!-- Social Sharing Buttons (Facebook, TikTok, Instagram, WhatsApp) -->
        <div
          class="d-flex flex-row ga-4 mt-2 w-100 align-center justify-center"
        >
          <!-- Facebook Share Button -->
          <div class="d-flex flex-column ga-2 align-center justify-center">
            <s-facebook
              :window-features="{}"
              :share-options="shareOptions"
              :use-native-behavior="false"
            >
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <v-btn
                    v-bind="props"
                    size="small"
                    color="white"
                    :variant="isHovering ? 'elevated' : 'outlined'"
                    icon
                  >
                    <v-icon>mdi-facebook</v-icon>
                  </v-btn>
                </template>
              </v-hover>
            </s-facebook>
            <p class="text-caption">Facebook</p>
          </div>

          <!-- TikTok Share Button -->
          <div class="d-flex flex-column ga-2 align-center justify-center">
            <a
              href="https://www.tiktok.com/share/video/@username/1234567890"
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <v-btn
                    v-bind="props"
                    size="small"
                    color="white"
                    :variant="isHovering ? 'elevated' : 'outlined'"
                    icon
                  >
                    <v-img
                      :src="tiktokSvg"
                      alt="TikTok Icon"
                      style="width: 20px; height: 20px"
                    />
                  </v-btn>
                </template>
              </v-hover>
            </a>
            <p class="text-caption">TikTok</p>
          </div>

          <!-- Instagram Share Button -->
          <div class="d-flex flex-column ga-2 align-center justify-center">
            <a
              href="https://www.instagram.com/"
              target="_blank"
              rel="nofollow noopener noreferrer"
            >
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <v-btn
                    v-bind="props"
                    size="small"
                    color="white"
                    :variant="isHovering ? 'elevated' : 'outlined'"
                    icon
                  >
                    <v-img
                      :src="InstagramSvg"
                      alt="Instagram Icon"
                      style="width: 20px; height: 20px"
                    />
                  </v-btn>
                </template>
              </v-hover>
            </a>
            <p class="text-caption">Instagram</p>
          </div>

          <!-- WhatsApp Share Button -->
          <div class="d-flex flex-column ga-2 align-center justify-center">
            <s-whats-app
              :window-features="windowFeatures"
              :share-options="shareOptionsWS"
            >
              <v-hover>
                <template v-slot:default="{ isHovering, props }">
                  <v-btn
                    v-bind="props"
                    size="small"
                    color="white"
                    :variant="isHovering ? 'elevated' : 'outlined'"
                    icon
                  >
                    <v-icon>mdi-whatsapp</v-icon>
                  </v-btn>
                </template>
              </v-hover>
            </s-whats-app>
            <p class="text-caption">WhatsApp</p>
          </div>
        </div>

        <!-- Divider -->
        <v-divider class="my-2" :thickness="2"></v-divider>

        <v-row class="px-1">
          <v-col cols="12" md="6" class="d-flex flex-row">
            <v-text-field
              v-model="urlToShow"
              label="Pagina URL"
              readonly
              outlined
              style="height: 60px"
              @click="copyUrl"
            >
            </v-text-field>
            <v-btn
              variant="text"
              style="height: 58px"
              class="d-flex justify-center align-center"
              tile
              @click="copyUrl"
            >
              <v-icon>mdi-content-copy</v-icon>
            </v-btn>
          </v-col>
        </v-row>
      </div>

      <v-snackbar
        v-model="snackbar"
        :timeout="3000"
        color="black"
        elevation="24"
      >
        Copiado com sucesso!
      </v-snackbar>
    </v-card>
  </v-bottom-sheet>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useMediaQuery } from "@vueuse/core";
import tiktokSvg from "@/assets/svg/tiktokSvg.svg";
import InstagramSvg from "@/assets/svg/InstagramSvg.svg";

const isHovering = ref(false);
const isLargeScreen = useMediaQuery("(min-width: 1024px)");
const shareOptions = ref({
  url: "https://vue-advisor.web.app",
  quote: "Quote",
  hashtag: "#Jubilos",
});

const shareOptionsWS = ref({
  text: "See this event",
});

const bottomSheetVisible = ref(false);
const snackbar = ref(false);
const urlToShow = ref("");
const currentUrl = ref(window.location.href);

const copyUrl = () => {
  navigator.clipboard
    .writeText(currentUrl.value)
    .then(() => {
      snackbar.value = true;
    })
    .catch((err) => {
      console.error("Failed to copy URL:", err);
    });
};

const shortenUrl = (url) => {
  const maxLength = 30;
  return url.length > maxLength ? url.slice(0, maxLength) + "..." : url;
};

onMounted(() => {
  urlToShow.value = shortenUrl(currentUrl.value);
});
</script>

<style lang="scss" scoped>
.text-h6 {
  font-size: 20px;
}
</style>
