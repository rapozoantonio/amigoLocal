<template>
  <div class="popular-news-section">
    <div class="news-header">
      <i class="pi pi-bolt" aria-hidden="true" style="font-size: 1.5rem"></i>
      <h2 class="news-title">Popular News</h2>
    </div>
    <ul class="news-list">
      <li v-for="newsItem in newsItems" :key="newsItem.id" class="news-item">
        <a :href="newsItem.link" class="news-link">
          <span class="news-number">{{ newsItem.id }}</span>
          {{ newsItem.headline }}
        </a>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { ref } from "vue";

const newsItems = ref([
  { id: 1, headline: "New York disbands M.A.R.C.H. task force behind venue police raids, announces C.U.R.E." },
  { id: 2, headline: "2023's top news stories" },
  { id: 3, headline: "UK canal boat shop Rubber Ducky Records reopens after sinking" },
  { id: 4, headline: "Damon Wild reveals Pleasure Builder, his first album since 2017" },
  { id: 5, headline: "DJ Tennis launches Instagram cooking show, MunchieTown" },
  { id: 6, headline: "Paris label Casual Gabberz closes after ten years" }, // Add more news items as needed
]);
</script>

<style scoped>
.popular-news-section {
  background-color: #1a1a1a;
  padding: 2rem;
}

.news-header {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #333;
  padding-bottom: 0.5rem;
  margin-bottom: 1rem;
}

.news-title {
  color: white;
  font-size: 2rem;
  font-weight: bold;
  text-transform: uppercase;
  margin-left: 0.5rem;
}

.news-list {
  list-style-type: none;
  padding: 0;
}

.news-item {
  border-bottom: 1px solid #333;
  padding: 1rem 0;
}

.news-link {
  color: white;
  text-decoration: none;
  font-size: 1.25rem;
}

.news-link:hover {
  color: #e50914;
}

.news-number {
  font-weight: bold;
  color: #e50914;
  margin-right: 1rem;
}

/* You may add responsive design or other styles as needed */
</style>
