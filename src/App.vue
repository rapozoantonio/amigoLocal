<template>
  <div id="app">
    <!-- Your global components like headers, footers, etc., can go here -->

    <!-- This is where the component for the current route will be rendered -->
    <router-view />

    <!-- Global components that should appear on every page can also go here -->
  </div>
</template>

<script>
export default {
  name: 'App'
  // No need to import EventList or other route-specific components here
}
</script>
