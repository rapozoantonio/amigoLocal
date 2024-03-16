<template>
    <div>
      <HeaderMenu />
      <DescriptionJumbotron />
      <LineupList />
      <SocialShare />
      <EventDescription />
      <PopularNewsSection />
      <PopularEventCarousel />
      <FooterMenu />
    </div>
  </template>
  
  <script>
  import HeaderMenu from "@/components/HeaderMenu.vue";
  import DescriptionJumbotron from "@/components/DescriptionJumbotron.vue";
  import SocialShare from "@/components/SocialShare.vue";
  import PopularNewsSection from "@/components/PopularNewsSection.vue";
  import LineupList from "@/components/LineupList.vue";
  import EventDescription from "@/components/EventDescription.vue";
  import PopularEventCarousel from "@/components/PopularEventCarousel.vue";
  import FooterMenu from "@/components/FooterMenu.vue";
  
  export default {
    name: "EventPage",
    components: {
      HeaderMenu,
      DescriptionJumbotron,
      SocialShare,
      LineupList,
      EventDescription,
      PopularNewsSection,
      PopularEventCarousel,
      FooterMenu,
    },
  };
  </script>
  