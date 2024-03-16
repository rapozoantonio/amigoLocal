<template>
  <div class="event-description-container">
    <div class="text-section">
      <p class="event-paragraph">
        {{ eventDescription }}
      </p>
      <div class="event-details-grid">
        <div class="event-detail">
          <span class="detail-label p-text-secondary">Producer: </span>
          <span class="detail-value">{{ eventDetails.producer }}</span>
        </div>
        <div class="event-detail">
          <span class="detail-label p-text-secondary">Last updated: </span>
          <span class="detail-value">{{ eventDetails.lastUpdated }}</span>
        </div>
        <div class="event-detail">
          <span class="detail-label p-text-secondary">Do you have a question about the event? </span>
          <span class="detail-value">{{ eventDetails.contact }}</span>
        </div>
        <div class="event-detail">
          <span class="detail-label p-text-secondary">Code: </span>
          <Tag icon="pi pi-ticket" :value="eventDetails.code" class="detail-value" rounded />
        </div>
      </div>
      <div class="ticket-section">
        <h2 class="ticket-heading">TICKETS</h2>
        <p class="ticket-subheading p-text-secondary">Ticket including AL fee (?)</p>
        <p class="ticket-sales-close p-text-secondary">Sales close: Wed, 03 Jan, 2:00 (Central European Standard Time).</p>

        <Button icon="pi pi-ticket" class="get-tickets-button" label="Get Ticket" @click="getTickets" outlined />
      </div>
    </div>
    <div class="image-section">
      <div class="image-placeholder">580x580</div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Tag from "primevue/tag";
import Button from "primevue/button";

// Example of event description and details as reactive data
const eventDescription = ref(
  "IMPORTANTE: ENTRADA LIBRE CON EL TICKET DE R.A., HASTA COMPLETAR AFORO. VENIR PRONTO !!! Nunca dejaremos de explorar, la posibilidad de nuevos lugares de agregación cultural y sobretodo apoyar a los que nos han abierto la puerta en esta misión, somos animales sociales y necesitamos reunirnos en actos lúdicos. A partir de las 20hcelebraremos la llegada de los Reyes en La Textil (c/Casp 33b) (restaurante, bar, club) el sitio donde hemos nacido, y que, en poco tiempo, ha dejado el signo en la agenda cultural de Barcelona. ndo aviso: IMPORTANTE: ENTRADA LIBRE CON EL TICKET DE R.A., HASTA COMPLETAR AFORO. VENIR PRONTO !!!"
);
const eventDetails = ref({
  producer: "Playroombcn",
  lastUpdated: "13 days ago",
  code: "MAGRAND",
  contact: "Contact the promoter",
});

const getTickets = () => {
  // Implement ticket getting functionality here
  // This might involve routing to a different page or opening a modal, for example
};
</script>

<style scoped>
.event-description-container {
  display: flex;
  padding: 16px;
  gap: 32px; /* Increased gap between text and image */
}

.text-section {
  flex: 1; /* Adjusted for automatic spacing */
  max-width: 50%; /* Keeps the text section from getting too wide */
}

.event-paragraph {
  margin-bottom: 20px;
  line-height: 1.6; /* Improves readability */
  white-space: pre-line; /* Respects line breaks in text */
  text-align: justify; /* Justifies the paragraph for a clean look */
  hyphens: auto; /* Automatically hyphenate words if necessary */
}

.event-details-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 10px;
}

.event-detail {
  background-color: #333;
  padding: 10px;
  color: #fff; /* Assuming light text on dark background */
  border-radius: 4px; /* Softens the corners of the detail boxes */
}

.image-section {
  flex: 1; /* Adjusted for automatic spacing */
  max-width: 40%; /* Limits the width of the image section */
}

.image-placeholder {
  width: 580px;
  height: 580px;
  background-color: #222; /* Placeholder color, replace with your image */
  display: flex;
  justify-content: center;
  align-items: center;
  color: #777; /* Placeholder text color */
  font-size: 20px;
  margin-right: 1rem;
  border: 3px dashed;
}
.ticket-section {
  border-radius: 8px;
}

.ticket-heading {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #e50914; 
    border-left: 3px solid #e50914;
    padding-left: 0.5rem;
  }
.ticket-subheading {
  /* Style for ticket subheading */
}

.ticket-type {
  display: flex;
  justify-content: space-between;
  margin: 16px 0;
  background-color: #e50914;
  padding: 8px;
  border-radius: 4px;
}

.ticket-price {
  /* Style for ticket price */
}

.ticket-sales-close {
  /* Style for sales close info */
}

.ticket-quantity {
  /* Style for ticket quantity selector */
  display: flex;
  align-items: center;
}

.ticket-quantity button {
  /* Style for plus and minus buttons */
}

.get-tickets-button {
  /* Style for get tickets button */
  border: none;
  color: #e50914;
  padding: 12px 24px;
  border-radius: 24px;
  cursor: pointer;
}
</style>
