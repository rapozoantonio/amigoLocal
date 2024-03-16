<template>
  <div>
    <HeaderMenu />
    <LocationSelector />
    <BottomHeaderMenu />
    <PopularEventCarousel />
    <EventListingCards />
    <PopularNewsSection />
    <FooterMenu />
  </div>
</template>

<script>
import HeaderMenu from "../components/HeaderMenu.vue";
import LocationSelector from "../components/LocationSelector.vue";
import BottomHeaderMenu from "../components/BottomHeaderMenu.vue";
import PopularEventCarousel from "../components/PopularEventCarousel.vue";
import EventListingCards from "../components/EventListingCards.vue";
import PopularNewsSection from "../components/PopularNewsSection.vue";
import FooterMenu from "../components/FooterMenu.vue";

export default {
  name: "EventList",
  components: {
    HeaderMenu,
    LocationSelector,
    BottomHeaderMenu,
    PopularEventCarousel,
    EventListingCards,
    PopularNewsSection,
    FooterMenu,
  },
};
</script>
