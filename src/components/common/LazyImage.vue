<template>
  <div ref="imageRef">
    <v-img
      :height="height"
      :width="width"
      :src="imageUrl"
      :class="computedClasses"
      :contain="fit === 'contain'"
      :cover="fit === 'cover'"
      :alt="alt"
      role="img"
      fetchpriority="high"
      loading="eager"
      decoding="async"
    >
      <template v-slot:placeholder>
        <v-row
          class="fill-height ma-0"
          align="center"
          justify="center"
        >
          <v-progress-circular
            indeterminate
            color="grey-lighten-5"
            size="small"
          ></v-progress-circular>
        </v-row>
      </template>

      <template v-slot:error>
        <v-img
          :height="height"
          :width="width"
          :src="fallbackSrc"
          :contain="fit === 'contain'"
          :alt="alt"
        />
      </template>
    </v-img>
  </div>
</template>

<script setup>
import { computed, ref, onMounted } from 'vue'

const props = defineProps({
  src: {
    type: String,
    default: ''
  },
  fallbackSrc: {
    type: String,
    default: '/img/placeholder_event_280x280.webp'
  },
  alt: {
    type: String,
    required: true
  },
  width: {
    type: [String, Number],
    default: null
  },
  height: {
    type: [String, Number],
    default: null
  },
  fit: {
    type: String,
    default: 'contain',
    validator: (value) => ['contain', 'cover'].includes(value)
  },
  rounded: {
    type: Boolean,
    default: false
  }
})

const imageRef = ref(null)

const imageUrl = computed(() => {
  const url = props.src || props.fallbackSrc
  //url.replace(/\.(jpg|jpeg|png)$/i, '.webp')
  return url
})

const computedClasses = computed(() => [
  { 'rounded': props.rounded },
  props.class
])

onMounted(() => {
  if (props.src) {
    const preloadLink = document.createElement('link')
    preloadLink.rel = 'preload'
    preloadLink.as = 'image'
    preloadLink.href = props.src
    preloadLink.fetchPriority = 'high'
    document.head.appendChild(preloadLink)
  }
})
</script>

<style scoped>
:deep(.v-img) {
  transition: opacity 0.3s ease-in-out;
}
</style>