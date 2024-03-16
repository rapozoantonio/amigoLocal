<template>
  <div class="jumbotron">
    <Card>
      <template #title>
        <h1 class="event-title">{{ eventDetails.title }}</h1>
      </template>
      <template #content>
        <div class="event-info-container">
          <div class="event-detail" v-for="(detail, title) in eventDetails.details" :key="title">
            <h3 class="detail-title p-text-secondary">
              <i :class="detail.icon"></i>
              {{ title }}
            </h3>
            <p v-for="(item, index) in detail.items" :key="index">{{ item }}</p>
          </div>
          <div class="event-detail">
            <h3 class="detail-title p-text-secondary">
              <i class="pi pi-users"></i>
              Interested
            </h3>
            <div class="interested-info">
              <span class="interested-count">{{ eventDetails.interestedCount }}</span>
              <Button icon="pi pi-user-plus" label="Interested" outlined />
            </div>
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import Card from 'primevue/card';
import Button from 'primevue/button';

const eventDetails = ref({
  title: 'Playroom presents Presa Bene at La Textil',
  details: {
    'Location': {
      icon: 'pi pi-map-marker',
      items: [
        'La Textil Collective',
        'C/ de Casp, 33B, 08010 Barcelona'
      ]
    },
    'Date': {
      icon: 'pi pi-calendar-plus',
      items: [
        'Sat, 6 Jan 2024',
        '20:00 - 03:00'
      ]
    },
    'Promoters': {
      icon: 'pi pi-briefcase',
      items: [
        'House Station',
        '303AudiophileBar',
        'Playroom'
      ]
    }
  },
  interestedCount: 165
});
</script>


<style scoped>
.jumbotron {
  padding: 2rem;
  border-radius: 0.3rem;
}

.event-title {
  margin-bottom: 1rem;
}

.event-info-container {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 1rem;
}

.event-detail {
  flex: 1;
  min-width: 200px; /* Set a min-width for each detail to control when they stack */
}

.interested-detail {
  flex-grow: 0; /* Prevent the interested section from growing */
  display: flex;
  align-items: center;
  gap: 1rem;
}

.interested-count {
  font-size: 1.5rem;
  color: #e50914;
  font-weight: bold;
}

.interested-info {
  display: flex;
  align-items: center;
  gap: 1rem; /* This adds space between items in a flex container */
}

@media (max-width: 768px) {
  .jumbotron {
    padding: 1rem;
  }

  .event-info-container {
    flex-direction: column;
  }

  .event-detail {
    min-width: 100%; /* Each detail takes full width on small screens */
  }
}
::v-deep .p-button-label {
  color: #fff;
}
::v-deep .p-button-icon {
  color: #fff;
}
</style>
