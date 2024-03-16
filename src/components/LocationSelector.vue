<template>
  <div class="jumbotron-location-dropdown">
    <Dropdown v-model="selectedLocation" :options="locations" optionLabel="name" placeholder="Select a Location">
      <!-- Template for the selected value -->
      <template #value="slotProps">
        <div v-if="slotProps.value" class="flex align-items-center">
          <div v-html="getFlagIcon(slotProps.value.code)" class="flag-icon"></div>
          <span>{{ slotProps.value.name }}</span>
        </div>
        <span v-else>
          {{ slotProps.placeholder }}
        </span>
      </template>

      <!-- Template for dropdown options -->
      <template #option="slotProps">
        <div class="flex align-items-center">
          <div v-html="getFlagIcon(slotProps.option.code)" class="flag-icon"></div>
          <span>{{ slotProps.option.name }}</span>
        </div>
      </template>
    </Dropdown>
  </div>
</template>

<script setup>
import { ref } from "vue";
import Dropdown from "primevue/dropdown";

const selectedLocation = ref(null);
const locations = ref([
  { name: "Barcelona", code: "es" },
  { name: "Brazil", code: "br" },
  { name: "Rio de Janeiro", code: "br" },
  { name: "New York", code: "us" },
  // More locations...
]);

// TODO: NOT WORKING
// Return the SVG markup based on the location code
const getFlagIcon = (code) => {
  const flags = {
    es: ` <svg viewBox="0 0 24 24" name="ES" width="100%" height="100%"><g fill="none" fill-rule="nonzero"><path d="M0 12c0 1.468.264 2.874.746 4.174L12 17.217l11.254-1.043c.482-1.3.746-2.706.746-4.174 0-1.468-.264-2.874-.746-4.174L12 6.783.746 7.826A11.974 11.974 0 000 12z" fill="#FFDA44"></path><g fill="#D80027"><path d="M23.254 7.826C21.558 3.256 17.16 0 12 0 6.84 0 2.442 3.257.746 7.826h22.508zM.746 16.174C2.442 20.744 6.84 24 12 24c5.16 0 9.558-3.257 11.254-7.826H.746z"></path></g></g></svg>`, // SVG markup for Spain
    br: ` <svg viewBox="0 0 24 24" name="BR" width="100%" height="100%"><g fill="none" fill-rule="nonzero"><circle fill="#6DA544" cx="12" cy="12" r="12"></circle><path fill="#FFDA44" d="M12 4.696L21.913 12 12 19.304 2.087 12z"></path><circle fill="#F0F0F0" cx="12" cy="12" r="4.174"></circle><g fill="#0052B4"><path d="M9.913 11.74c-.726 0-1.426.11-2.086.314a4.173 4.173 0 007.591 2.34 7.034 7.034 0 00-5.505-2.655zM16.097 12.8a4.174 4.174 0 00-7.932-2.447 8.583 8.583 0 017.932 2.447z"></path></g></g></svg>`, // SVG markup for Brazil
    us: `<svg viewBox="0 0 25 25" name="US" width="100%" height="100%"><g fill="none" fill-rule="nonzero"><circle fill="#F0F0F0" cx="12" cy="12" r="12"></circle><g fill="#D80027"><path d="M11.478 12H24c0-1.083-.144-2.132-.413-3.13H11.478V12zM11.478 5.74h10.76a12.063 12.063 0 00-2.768-3.131h-7.992v3.13zM12 24c2.824 0 5.42-.976 7.47-2.609H4.53A11.949 11.949 0 0012 24zM1.761 18.26H22.24a11.928 11.928 0 001.348-3.13H.413c.301 1.117.759 2.169 1.348 3.13z"></path></g><path d="M5.559 1.874h1.093l-1.017.739.389 1.196-1.018-.74-1.017.74.336-1.033c-.896.746-1.68 1.62-2.328 2.594h.35l-.647.47c-.1.168-.197.34-.29.513l.31.951-.578-.419C1 7.19.868 7.5.75 7.817l.34 1.048h1.258l-1.017.74.388 1.195-1.017-.739-.61.443C.033 10.994 0 11.494 0 12h12V0C9.63 0 7.42.688 5.559 1.874zm.465 8.926l-1.018-.739-1.017.739.389-1.196-1.017-.739h1.257l.388-1.195.389 1.195h1.257l-1.017.74.389 1.195zm-.389-4.691l.389 1.195-1.018-.739-1.017.74.389-1.196-1.017-.74h1.257l.388-1.195.389 1.196h1.257l-1.017.739zm4.693 4.691l-1.017-.739-1.017.739.388-1.196-1.017-.739h1.257l.389-1.195.388 1.195h1.258l-1.018.74.389 1.195zm-.389-4.691l.389 1.195-1.017-.739-1.017.74.388-1.196-1.017-.74h1.257l.389-1.195.388 1.196h1.258l-1.018.739zm0-3.496l.389 1.196-1.017-.74-1.017.74.388-1.196-1.017-.739h1.257L9.311.678l.388 1.196h1.258l-1.018.739z" fill="#0052B4"></path></g></svg>`, // SVG markup for the US
  };
  return flags[code.toLowerCase()] || ''; // Fallback to empty string if no flag is found
};
</script>

<style scoped>

/* Your existing styles */
.flag-icon {
  margin-right: 0.5rem;
  width: 1.5em;
  height: 1.5em; /* Set the size of the flags */
}
.jumbotron-location-dropdown {
  /* Custom styles for the jumbotron-like dropdown */
  background: #fff; /* Or any other suitable color */
  padding: 1rem; /* Jumbotron padding */
  /* Additional styling as needed */
}

::v-deep .p-inputtext {
  color: #000;
  background-color: #fff;
  font-size: 1.2rem; /* Jumbotron padding */
}

/* If the above doesn't work due to specificity, you can try adding !important */
::v-deep .p-dropdown-trigger {
  color: #000 !important; /* Forces the color of the trigger icon to black */
}

::v-deep .p-dropdown {
  color: #000;
  background-color: #fff;
  padding: 2rem;
  font-weight: bold;
  /* Add hover effect */
  transition: background-color 0.3s ease; /* Smooth transition for background color */
}

::v-deep .p-dropdown:hover .p-dropdown-label,
::v-deep .p-dropdown:hover .p-dropdown-trigger-icon {
  color: #e50914; /* Change label and icon color to white on hover */
}

.jumbotron-location-dropdown {
  /* Custom styles for the jumbotron-like dropdown */
  /* ... */
}

.flag-icon {
  margin-right: 0.5rem;
  width: 1.5em;
  height: 1.5em; /* Set the size of the flags */
}
</style>
