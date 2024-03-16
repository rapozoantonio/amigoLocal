<template>
  <div class="lineup-container">
    <h2 class="lineup-title">LINEUP</h2>
    <ul class="lineup-list p-text-secondary">
      <li v-for="artist in artists" :key="artist" class="lineup-item">{{ artist }}</li>
    </ul>
    <div class="genres-container">
      <Tag v-for="genre in genres" :key="genre" class="genre" value="genre">{{ genre }} </Tag>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Tag from "primevue/tag";

const artists = ref(["Dadame", "Face Tic", "Presa Bene djs", "Will de Luxe"]);
const genres = ref(["House", "Deep House"]);
</script>

<style scoped>
.lineup-container {
  padding-left: 2rem;
}

.lineup-title {
  font-size: 2rem;
  margin-bottom: 2rem;
  color: #e50914;
  border-left: 3px solid #e50914;
  padding-left: 0.5rem;
}

.lineup-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
  padding-left: 1rem; /* added some left padding to the list */
}

.lineup-item {
  font-size: 1.25rem;
  margin-bottom: 0.5rem;
}

.genres-container {
  display: flex;
  justify-content: start;
  gap: 0.5rem;
  margin-top: 2rem;
  margin-bottom: 2rem;
  padding-left: 1rem; /* Ensure genres container is also left-aligned */
}

.genre {
  border: 1px solid #e50914;
  padding: 0.25rem 0.75rem;
  color: #fff; /* Assuming you want the text white based on the hover comment */
  background-color: transparent; /* Optional: set background to transparent */
}

/* Media queries for responsiveness */
@media (min-width: 768px) {
  .lineup-title {
    font-size: 2rem;
  }

  .lineup-item {
    font-size: 1.5rem;
  }
}

@media (min-width: 1024px) {
  .lineup-container {
    max-width: 960px;
  }

  .genres-container {
    justify-content: start; /* Keep left alignment even on larger screens */
  }
}
</style>
