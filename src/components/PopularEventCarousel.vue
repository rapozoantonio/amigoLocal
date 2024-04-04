<template>
    <div class="event-carousel-container">
        <div class="header">
            <h2 class="title">POPULAR</h2>
            <Button label="Submit event" class="submit-button" outlined />
        </div>
        <Carousel
            :value="events"
            :numVisible="3"
            :numScroll="2"
            :circular="true"
            :showNavigators="true"
            :showIndicators="false"
            :responsiveOptions="responsiveOptions"
            class="custom-carousel"
        >
            <template #item="slotProps">
                <div class="event-card">
                    <img
                        :src="slotProps.data.image"
                        :alt="slotProps.data.title"
                        class="event-image"
                    />
                    <div class="event-info">
                        <p class="event-date p-text-secondary">
                            {{ slotProps.data.date }}
                        </p>
                        <h3 class="event-title">{{ slotProps.data.title }}</h3>
                        <div class="event-location p-text-secondary">
                            <i class="pi pi-map-marker"></i>
                            {{ slotProps.data.location }}
                        </div>
                        <div class="event-attendees p-text-secondary">
                            <i class="pi pi-users"></i>
                            {{ slotProps.data.attendees }}
                        </div>
                    </div>
                </div>
            </template>
        </Carousel>
    </div>
</template>

<script setup>
import { ref } from "vue";
import Carousel from "primevue/carousel";
import Button from "primevue/button";

const events = ref([
    {
        title: "TRANSC.END with BOB MOSES",
        date: "SAT, 30 DEC",
        location: "Morro Da Urca",
        image: "/img/path-to-event-image.jpg",
        attendees: 58,
    },
    {
        title: "4 FINEST EARS - RÉVEILLON 2024",
        date: "SUN, 31 DEC",
        location: "TBA - Rua Tenente Marcin Pinto, n125, Gávea - RJ",
        image: "/img/path-to-event-image.jpg",
        attendees: 8,
    },
    {
        title: "Reveillon NEW ´24 - Sheraton Grand Rio Hotel & Resort",
        date: "SUN, 31 DEC",
        location: "TBA - Sheraton Grand Rio Hotel & Resort (Leblon)",
        image: "/img/path-to-event-image.jpg",
        attendees: 7,
    },
    {
        title: "Terraço do Amor by Fica Comigo",
        date: "SAT, 30 DEC",
        location: "TBA - Sheraton Grand Rio Hotel & Resort",
        image: "/img/path-to-event-image.jpg",
        attendees: 2,
    },
    {
        title: "Terraço do Amor by Fica Comigo",
        date: "SAT, 30 DEC",
        location: "TBA - Sheraton Grand Rio Hotel & Resort",
        image: "/img/path-to-event-image.jpg",
        attendees: 2,
    },
    // Add more events as needed
]);
const responsiveOptions = ref([
    {
        breakpoint: "1024px",
        numVisible: 4,
        numScroll: 1,
    },
    {
        breakpoint: "768px",
        numVisible: 3,
        numScroll: 1,
    },
    {
        breakpoint: "560px",
        numVisible: 2,
        numScroll: 1,
    },
]);
</script>

<style scoped>
.event-carousel-container {
    padding: 1rem;
    background-color: #121212; /* Adjust to your theme color */
}

.header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    /* Remove or comment out any media query changing the flex direction to column */
}

.title {
    font-size: 2rem;
    margin-bottom: 2rem;
    color: #e50914; /* Change label and icon color to white on hover */
    border-left: 3px solid #e50914;
    padding-left: 0.5rem;
}

::v-deep .p-button-label {
    color: #fff;
}
.custom-carousel .p-carousel-item {
    margin: 0.25rem;
}

.custom-carousel .event-card {
    color: #fff;
    text-align: left;
    border-radius: 10px;
    margin-right: 10px;
}

.custom-carousel .event-image {
    width: 280px; /* Set fixed width */
    height: 395px; /* Set fixed height */
    object-fit: cover; /* Ensures the image covers the area without distorting aspect ratio */
}

.custom-carousel .event-info {
    padding: 0.75rem;
}

.custom-carousel .event-title {
    font-size: 1rem; /* Adjusted font size */
    margin-top: 0.25rem;
}

.custom-carousel .event-date {
    font-size: 0.875rem; /* Adjusted font size */
    margin-bottom: 0.25rem;
}

.custom-carousel .event-location .pi,
.custom-carousel .event-attendees .pi {
    margin-right: 0.5rem;
}
.event-location {
    margin-bottom: 10px; /* Adds space below the event location */
}

/* Or, if you prefer to add space above the event attendees: */
.event-attendees {
    margin-top: 10px; /* Adds space above the event attendees */
}

@media (max-width: 768px) {
    .custom-carousel .event-image {
        width: 100%; /* Full width on smaller screens */
        height: auto; /* Adjust height automatically to maintain aspect ratio */
    }
    .title {
        margin-bottom: 0.5rem; /* Space between title and button on smaller screens */
    }

    .submit-button {
        align-self: center; /* Center submit button on smaller screens */
    }
    /* Responsive design adjustments */
    @media (max-width: 1024px) {
        /* Adjust styles for screens smaller than 1024px */
        .custom-carousel .p-carousel-item {
            margin-right: 15px; /* Smaller gap on smaller screens */
        }
    }

    @media (max-width: 768px) {
        /* Adjust styles for screens smaller than 768px */
        .custom-carousel .p-carousel-item {
            margin-right: 10px; /* Even smaller gap */
        }
    }

    @media (max-width: 560px) {
        /* Adjust styles for screens smaller than 560px */
        .custom-carousel .p-carousel-item {
            margin-right: 20px; /* Restore gap for single item view */
        }
    }
}

.event-location,
.event-attendees {
    font-size: smaller; /* Adjust the font size as needed */
}

.event-location .pi,
.event-attendees .pi {
    color: #e50914; /* Change the icon color to red */
}

.custom-carousel .event-card {
    width: 280px; /* Set fixed width for the card */
    border-radius: 10px;
    margin-right: 10px;
    display: flex;
    flex-direction: column;
}

.custom-carousel .event-image {
    width: 100%; /* Make image fill the width of the card */
    height: 60%; /* Adjust height as needed, based on your design */
    object-fit: cover;
}

.custom-carousel .event-info {
    padding: 0.75rem;
    height: 40%; /* Adjust remaining height for event info */
    overflow: auto; /* Optional: in case content is larger than the container */
}

/* Responsive adjustments for smaller screens */
@media (max-width: 768px) {
    .custom-carousel .event-card {
        width: 100%; /* Full width on smaller screens */
        height: auto; /* Height adjusts to content */
    }

    .custom-carousel .event-image {
        height: auto; /* Adjust height automatically to maintain aspect ratio */
    }
}
</style>
