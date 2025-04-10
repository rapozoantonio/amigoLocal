<template>
    <div style="display: none">{{ generateSitemap() }}</div>
  </template>
  
  <script setup>
  import { ref } from "vue";
  
  // Define your sitemap data
  const urls = ref([
    { loc: "https://jubilos.com.br", changefreq: "daily", priority: "1.0" },
    { loc: "https://jubilos.com.br/events", changefreq: "daily", priority: "0.9" },
    { loc: "https://jubilos.com.br/event", changefreq: "daily", priority: "0.9" },
    { loc: "https://jubilos.com.br/promoters", changefreq: "weekly", priority: "0.8" },
    { loc: "https://jubilos.com.br/1/events/BR/riodejaneiro", changefreq: "daily", priority: "0.8" },
    { loc: "https://jubilos.com.br/1/events/BR/saopaulo", changefreq: "daily", priority: "0.8" },
  ]);
  
  // Function to generate the sitemap XML
  function generateSitemap() {
    // Build the XML content dynamically
    const xmlContent = `<?xml version="1.0" encoding="UTF-8"?>
  <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  ${urls.value
    .map(
      (url) => `
    <url>
      <loc>${url.loc}</loc>
      <changefreq>${url.changefreq}</changefreq>
      <priority>${url.priority}</priority>
    </url>`
    )
    .join("")}
  </urlset>`;
  
    // Create a Blob for the XML content
    const blob = new Blob([xmlContent], { type: "text/xml" });
  
    // Create a download link for the file
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "sitemap.xml";
  
    // Trigger the download
    link.click();
  
    // Clean up the URL object
    URL.revokeObjectURL(link.href);
  }
  </script>
  