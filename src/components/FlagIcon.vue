<template>
  <svg viewBox="0 0 24 24" :name="props.country" width="100%" height="100%">
    <template v-if="props.country === 'es'">
      <g fill="none" fill-rule="nonzero">
        <path
          d="M0 12c0 1.468.264 2.874.746 4.174L12 17.217l11.254-1.043c.482-1.3.746-2.706.746-4.174 0-1.468-.264-2.874-.746-4.174L12 6.783.746 7.826A11.974 11.974 0 000 12z"
          fill="#FFDA44"
        ></path>
        <g fill="#D80027">
          <path
            d="M23.254 7.826C21.558 3.256 17.16 0 12 0 6.84 0 2.442 3.257.746 7.826h22.508zM.746 16.174C2.442 20.744 6.84 24 12 24c5.16 0 9.558-3.257 11.254-7.826H.746z"
          ></path>
        </g>
      </g>
    </template>
    <template v-if="props.country === 'br'">
      <svg
        width="24"
        height="24"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <!-- Green background -->
        <rect width="48" height="48" fill="#009B3A"></rect>

        <!-- Yellow diamond -->
        <path d="M24 4L44 24 24 44 4 24Z" fill="#FFCC29"></path>

        <!-- Blue circle -->
        <circle cx="24" cy="24" r="10" fill="#002776"></circle>

        <!-- White band -->
        <path
          d="M8 24a16 16 0 0 1 32 0h-2a14 14 0 1 0 -28 0z"
          fill="#FFFFFF"
          transform="translate(0 -2)"
        ></path>

        <!-- Stars group (simplified for icon size) -->
        <g transform="translate(24 20)" fill="#FFFFFF">
          <!-- Star at top-left -->
          <path d="M0-3.5l1.5 1-1-1.5-1 1.5z" />
          <!-- Star at top-right -->
          <path transform="translate(4 0)" d="M0-3.5l1.5 1-1-1.5-1 1.5z" />
          <!-- Star at bottom-right -->
          <path transform="translate(3 4)" d="M0-3.5l1.5 1-1-1.5-1 1.5z" />
          <!-- Star at bottom-left -->
          <path transform="translate(-4 4)" d="M0-3.5l1.5 1-1-1.5-1 1.5z" />
        </g>
      </svg>
    </template>

    <template v-else>
      <g fill="none" fill-rule="nonzero">
        <!-- Background circle for the globe -->
        <circle cx="12" cy="12" r="10" fill="#cccccc"></circle>

        <!-- Continents (simple shapes for illustration) -->
        <path
          d="M8.5 7.5C7 9 8 11 10 11c1 0 1-1 2-1 2 0 2.5 2 2 3-.5 1.5 1 2 1 3s-2.5 2-5 2-3-2.5-3-2.5"
          fill="#6b6b6b"
        ></path>
        <path
          d="M15 12.5c1-.5 2.5-.5 3 0 .5.5 0 1 0 1.5s1 1 1 1-1.5 1-2.5 1-2.5-.5-3-1c-.5-.5 0-1.5.5-2s1-.5 1-1z"
          fill="#6b6b6b"
        ></path>
      </g>
    </template>
  </svg>
</template>

<script setup>
import { defineProps } from "vue";
const props = defineProps(["country"]);
</script>

<style lang="scss" scoped></style>
