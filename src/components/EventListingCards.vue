<template>
  <div class="daily-events">
    <section v-for="(events, day) in eventsByDay" :key="day" class="daily-event-group">
      <header class="day-title">
        <i class="pi pi-calendar" aria-hidden="true"></i>
        {{ day }}
      </header>
      <Divider />
      <article v-for="event in events" :key="event.id" class="event-card">
        <div class="event-image-placeholder">215x121</div>
        <div class="event-content">
          <p class="event-date p-text-secondary">{{ event.date }}</p>
          <h2 class="event-title">{{ event.title }}</h2>
          <div class="event-details p-text-secondary">
            <div>
              <span class="event-location">
                <i class="pi pi-map-marker" aria-hidden="true"></i>
                {{ event.location }}
              </span>
              <span class="event-attendees">
                <i class="pi pi-users"></i>
                {{ event.attendees }}
              </span>
            </div>
            <div class="event-code">
              <Tag icon="pi pi-ticket" :value="event.code" rounded />
            </div>
          </div>
        </div>
      </article>
    </section>
    <Button label="Submit event" class="submit-button" outlined />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Button from "primevue/button";
import Divider from "primevue/divider";
import Tag from "primevue/tag";

const eventsByDay = ref({
  "TUE, 26 DEC": [
    {
      id: 1,
      title: "Andami pres: SECRET VILLA TAKEOVER",
      location: "TBA",
      attendees: 8,
      date: "TUE, 26 DEC",
      code: "MAGRAND",
      // other event details
    },
    {
      id: 2,
      title: "MELODICA DE NAVIDAD TARDEO SESSION",
      location: "M7 Club",
      attendees: 80,
      date: "TUE, 26 DEC",
      code: "GREYSON",
      // other event details
    },
    {
      id: 3,
      title: "MAKINA IS BACK (PSICODROMO BARCELONA)",
      location: "WOLF Barcelona",
      attendees: 32,
      date: "TUE, 26 DEC",
      code: "DIVISION",
    },
    // ... additional events
  ],
  "WED, 27 DEC": [
    {
      id: 4,
      title: "Electro Night Out",
      location: "Club Electron",
      attendees: 15,
      date: "WED, 27 DEC",
      code: "TUBB9",
      // other event details
    },
    {
      id: 5,
      title: "Jazz & Blues Evening",
      location: "Downtown Jazz Bar",
      attendees: 15,
      date: "WED, 27 DEC",
      code: "MAGRAND",
      // other event details
    },
    // ... additional events
  ],
  "THU, 28 DEC": [
    {
      id: 6,
      title: "Techno Titans: Winter Edition",
      location: "Arena Sound Stage",
      attendees: 25,
      date: "THU, 28 DEC",
      code: "MAGRAND",
      // other event details
    },
    {
      id: 7,
      title: "Rooftop Rhythms: DJ Set Live",
      location: "Skyline Terrace",
      attendees: 40,
      date: "THU, 28 DEC",
      code: "MAGRAND",
      // other event details
    },
    // ... additional events
  ],
  // ... additional days with events
});
</script>

<style scoped>
:root {
  --background-dark: #1a1a1a;
  --background-light: #333;
  --text-color: white;
  --highlight-color: #e50914;
}

.daily-events {
  background-color: var(--background-dark);
  color: var(--text-color);
  padding: 1rem;
}

.day-title {
  display: flex;
  align-items: center;
  font-size: 1.5rem;
  margin-bottom: 1rem;
}

.day-title .pi-calendar {
  margin-right: 0.5rem;
}

.event-card {
  display: flex;
  background-color: var(--background-light);
  margin-bottom: 1rem;
  padding: 1rem;
  border-radius: 10px;
}

.event-image-placeholder {
  width: 215px;
  height: 121px;
  background-color: #222; /* Placeholder color, replace with your image */
  display: flex;
  justify-content: center;
  align-items: center;
  color: #777; /* Placeholder text color */
  font-size: 20px;
  margin-right: 1rem;
  border: 3px dashed
}

.event-content {
  flex: 1;
}

.event-title {
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
}

.event-details {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.event-location,
.event-attendees,
.event-code {
  display: flex;
  align-items: center;
}

.event-location .pi,
.event-attendees .pi,
.event-code .pi {
  margin-right: 0.5rem;
}

.event-code {
  font-size: 1.2rem;
  color: var(--highlight-color);
}

.event-location,
.event-attendees {
  font-size: smaller; /* Adjust the font size as needed */
}
.event-location .pi,
.event-attendees .pi {
  color: #e50914; /* Change the icon color to red */
}
.event-location {
  margin-bottom: 10px; /* Adds space below the event location */
}

/* Or, if you prefer to add space above the event attendees: */
.event-attendees {
  margin-top: 10px; /* Adds space above the event attendees */
}

.event-date {
  margin-bottom: 0.25rem; /* Reduced bottom margin */
}

.event-title {
  font-size: 1.2rem;
  margin-top: 0.25rem; /* Reduced top margin */
}

::v-deep .p-button-label {
  color: #fff;
}

@media (max-width: 768px) {
  /* Adjust breakpoint as needed */
  .event-image-placeholder {
    display: none;
  }

  .event-card {
    flex-direction: column; /* Optional: Stack content vertically on smaller screens */
  }

  /* Additional responsive adjustments can be added here */
}
</style>
