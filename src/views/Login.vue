<template>
  <div>
    <v-container>
      <login-box @success="handlePostLoginRedirect"></login-box>
    </v-container>
  </div>
</template>

<script setup>
import { useRoute, useRouter } from "vue-router";
import LoginBox from "@/components/interface/LoginBox.vue";

const router = useRouter();
const route = useRoute();

function handlePostLoginRedirect() {
  console.log("handlePostLoginRedirect");
  if (route.query.redirect && route.query.redirect !== "") {
    router.push(atob(route.query.redirect));
  }
}
</script>

<style scoped>
.v-btn {
  letter-spacing: normal;
}
</style>
