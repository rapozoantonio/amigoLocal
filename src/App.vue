<template>
  <div v-if="!mounted" id="loading" class="animated-gradient">
    <div class="loader"></div>
  </div>
  <router-view />
</template>

<script setup>
import {
  onMounted,
  ref,
} from 'vue';

const mounted = ref(false);

// import { useConfigStore } from './store/config';

// const configStore = useConfigStore();

onMounted(() => {
  // configStore.init();

  mounted.value = true;
})

</script>

<style>
label.required:after {
  content: "*";
  top: 0px;
  position: absolute;
  right: -10px;
}




body {
  margin: 0px;
}

#loading {
  height: 100vh;
  width: 100%;
  background-color: black;
  display: grid;
  place-items: center;
}

/* HTML: <div class="loader"></div> */
.loader {
  width: 50px;
  aspect-ratio: 1;
  border-radius: 50%;
  border: 8px solid #0000;
  border-right-color: #FFEBEE;
  position: relative;
  animation: l24 1s infinite linear;
}

.loader:before,
.loader:after {
  content: "";
  position: absolute;
  inset: -8px;
  border-radius: 50%;
  border: inherit;
  animation: inherit;
  animation-duration: 2s;
}

.loader:after {
  animation-duration: 4s;
}

@keyframes l24 {
  100% {
    transform: rotate(1turn)
  }
}

.animated-gradient {
  animation: animateBg 3s linear infinite;
  animation-direction: alternate;
  /* background-image: linear-gradient(90deg, #25f800, #1100f8, #ffe607, #f70000); */
  background-image: linear-gradient(90deg, #780101, #2b2926, #780101, #2b2926);
  background-size: 300% 100%;

}

@keyframes animateBg {
  0% {
    background-position: 100% 0%;
  }

  100% {
    background-position: 50% 0%;
  }
}
</style>
