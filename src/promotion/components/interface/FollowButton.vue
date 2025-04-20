<template>
  <div>
    <!-- Follow Button -->
    <v-btn v-if="!isFollowing" @click="follow" color="primary" rounded="pill" variant="outlined" density="comfortable">
      <v-icon start size="18">{{ followIcon }}</v-icon>
      Seguir
    </v-btn>

    <!-- Following Button with Menu -->
    <v-btn v-else color="green" rounded="pill" variant="outlined" density="comfortable">
      <v-icon start size="18">{{ followingIcon }}</v-icon>
      Seguindo
      <v-menu activator="parent">
        <v-list density="compact">
          <v-list-item link @click="unfollow" class="text-red">
            <template v-slot:prepend>
              <v-icon size="18" color="red">{{ unfollowIcon }}</v-icon>
            </template>
            Deixar de Seguir
          </v-list-item>
        </v-list>
      </v-menu>
    </v-btn>

    <v-dialog v-model="loginDialog">
      <v-card>
        <v-card-text>
          <login-box @success="onLoginSuccess"></login-box>
        </v-card-text>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { storeToRefs } from "pinia";
import { useAuthStore } from "@/core/store/auth";
import { useEventsStore } from "@/promotion/store/events";
import { useFirebaseStore } from "@/core/store/firebase";
import { useLocationsStore } from "@/promotion/store/locations";
import { useUserStore } from "@/promotion/store/user";
import LoginBox from "../../../core/components/interface/LoginBox.vue";

// Stores
const firebase = useFirebaseStore();
const auth = useAuthStore();
const userStore = useUserStore();
const eventsStore = useEventsStore();
const locationsStore = useLocationsStore();
const loginDialog = ref(false);

// Store refs
const { event } = storeToRefs(eventsStore);
const { location } = storeToRefs(locationsStore);
const { follows, user } = storeToRefs(userStore);

// Props & Emits
const props = defineProps({
  entity_id: {
    type: String,
    required: true,
  },
  entity: {
    type: String,
    required: true,
    validator: (value) => ["events", "locations", "promoters", "producers"].includes(value),
  },
});

const emit = defineEmits(["follow", "unfollow"]);

// Computed
const isFollowing = computed(() => {
  if (!follows.value[props.entity]) {
    return false;
  }
  return follows.value[props.entity].includes(props.entity_id);
});

const followIcon = computed(() => {
  switch (props.entity) {
    case "events":
      return "mdi-calendar-plus-outline";
    case "locations":
      return "mdi-map-marker-plus-outline";
    case "promoters":
      return "mdi-account-plus-outline";
    default:
      return "mdi-plus";
  }
});

const followingIcon = computed(() => {
  switch (props.entity) {
    case "events":
      return "mdi-calendar-check-outline";
    case "locations":
      return "mdi-map-marker-check-outline";
    case "promoters":
      return "mdi-account-check-outline";
    default:
      return "mdi-check";
  }
});

const unfollowIcon = computed(() => {
  switch (props.entity) {
    case "events":
      return "mdi-calendar-remove-outline";
    case "locations":
      return "mdi-map-marker-remove-outline";
    case "promoters":
      return "mdi-account-remove-outline";
    default:
      return "mdi-close";
  }
});

function onLoginSuccess() {
  console.log("onLoginSuccess");
  loginDialog.value = false;
  if (isFollowing.value) {
    console.log("Usuario ja esta seguindo esse evento");
    return;
  }
  follow();
  return;
}

// Methods
async function follow() {
  try {

    if (!auth.user) {
      loginDialog.value = true;
      return
    }
    await firebase.addFollow(props.entity, props.entity_id, auth.user);
    await userStore.getFollows(auth.user.uid);
    emit("follow");
    return true;
  } catch (error) {
    return false;
  }
}

async function unfollow() {
  try {
    await firebase.removeFollow(props.entity, props.entity_id, auth.user);
    await userStore.getFollows(auth.user.uid);
    emit("unfollow");
    return true;
  } catch (error) {
    return false;
  }
}
</script>

<style lang="scss" scoped>
// Optional: Add hover effect for unfollow action
:deep(.v-list-item--link) {
  transition: color 0.2s ease;

  &:hover {
    color: rgb(var(--v-theme-error)) !important;
  }
}
</style>
