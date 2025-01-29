// Utilities
import { defineStore } from 'pinia'
import Swal from 'sweetalert2';
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const loading = ref(false);
  const loadingText = ref("Carregando...");

  // Default notification texts in Portuguese
  const DEFAULT_ERROR_TITLE = "Algo deu errado";
  const DEFAULT_ERROR_MESSAGE = "Verifique o console para mais informações sobre o erro";

  function notifyError(title = DEFAULT_ERROR_TITLE, message = DEFAULT_ERROR_MESSAGE) {
    Swal.fire({
      title,
      text: message,
      icon: "error",
      confirmButtonText: 'Entendi',
      cancelButtonText: 'Fechar',
    })
  }

  // Helper function to update loading text
  function setLoadingText(text) {
    loadingText.value = text;
  }

  // Common loading text templates
  const loadingTexts = {
    saving: "Salvando...",
    loading: "Carregando...",
    processing: "Processando...",
    uploading: "Enviando...",
    downloading: "Baixando...",
    authenticating: "Autenticando...",
    creating: "Criando...",
    updating: "Atualizando...",
    deleting: "Excluindo...",
    searching: "Pesquisando..."
  };

  return { 
    loading, 
    loadingText, 
    notifyError,
    setLoadingText,
    loadingTexts 
  }
})