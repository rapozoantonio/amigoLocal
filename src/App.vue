<template>
  <router-view />
</template>

<script setup>
import { onMounted, ref } from 'vue'
import useSeo from '@/composables/useSeo'

// Use default SEO settings by calling useSeo with no parameters
useSeo()

const mounted = ref(false)

onMounted(() => {
  mounted.value = true
})
</script>

<style>
label.required:after {
  content: "*";
  top: 0px;
  position: absolute;
  right: -10px;
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

.hover-primary:hover {
  color: rgb(var(--v-theme-primary)) !important;
}

.pattern-black-red-bg {
  position: relative;  
  width: 100%;
  min-height: 300px;   
  filter: blur(30px) brightness(0.3);
  background-color: #0a0a0a;
  background-image:
    repeating-radial-gradient(
      circle at 50% 50%, 
      rgba(255, 255, 255, 0.02),
      rgba(255, 255, 255, 0.02) 2px,
      transparent 3px,
      transparent 30px
    ),
    radial-gradient(
      circle at 20% 30%, 
      rgba(60, 0, 0, 0.3), 
      transparent 60%
    ),
    radial-gradient(
      circle at 80% 70%, 
      rgba(100, 0, 0, 0.2), 
      transparent 70%
    ),
    linear-gradient(
      to bottom right,
      #000 0%,
      #1a1a1a 25%,
      #2c0202 50%,
      #1c0101 75%,
      #000 100%
    );
  background-blend-mode: overlay, screen, screen, normal;
  background-size: cover;
  background-position: center;
}
</style>