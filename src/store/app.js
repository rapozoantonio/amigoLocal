// Utilities
import { defineStore } from 'pinia'
import Swal from 'sweetalert2';
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const loading = ref(false);
  const loadingText = ref("text here, cration");

  function notifyError(title = "Something went wrong", message = "Check the console to get more info about the error") {
    Swal.fire({
      title, message, icon: "error"
    })
  }

  return { loading, loadingText, notifyError }
})
