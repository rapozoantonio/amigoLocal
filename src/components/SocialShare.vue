<template>
    <div class="social-share-container">
      <p class="share-text">Share</p>
      <Button icon="pi pi-facebook" class="p-button-rounded p-button-text social-button" @click="shareOnFacebook" outlined />
      <Button icon="pi pi-twitter" class="p-button-rounded p-button-text social-button" @click="shareOnTwitter" outlined/>
      <Button icon="pi pi-whatsapp" class="p-button-rounded p-button-text social-button" @click="shareOnWhatsApp" outlined/>
      <Button icon="pi pi-copy" class="p-button-rounded p-button-text social-button" @click="copyLink" outlined/>
    </div>
  </template>
  
  <script setup>
  import Button from 'primevue/button';
  import { useToast } from 'primevue/usetoast';
  
  const toast = useToast();
  
  function shareOnFacebook() {
    window.open("https://www.facebook.com/sharer/sharer.php?u=" + encodeURIComponent(document.location.href), "_blank");
  }
  
  function shareOnTwitter() {
    window.open("https://twitter.com/intent/tweet?url=" + encodeURIComponent(document.location.href), "_blank");
  }
  
  function shareOnWhatsApp() {
    window.open("https://wa.me/?text=" + encodeURIComponent(document.location.href), "_blank");
  }
  
  function copyLink() {
    navigator.clipboard.writeText(document.location.href)
      .then(() => {
        toast.success("Link copied to clipboard");
      })
      .catch((err) => {
        toast.error("Failed to copy link: " + err);
      });
  }
  </script>
  
  <style scoped>
  .social-share-container {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 2rem;
  }
  
  .share-text {
    color: #fff;
    margin-right: 10px; /* Adjust as needed */
  }
  
  .social-button {
    border: none;
    background-color: transparent;
    color: #fff;
  }
  
  .social-button .pi {
    font-size: 1.25rem;
  }
  
  .social-button:hover {
    color: #e50914;
    cursor: pointer;
  }
  
  /* Additional styles for hover effects on buttons */
  .p-button-rounded:hover {
    border-color: #e50914; /* Change border color on hover if you have border */
  }
  </style>
  