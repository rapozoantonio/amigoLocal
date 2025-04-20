// composables/useSeo.js
import { useHead } from '@vueuse/head'

/**
 * A composable to setup SEO related meta tags.
 *
 * @param {Object} seoConfig - SEO configuration options (optional).
 * @param {string} seoConfig.title - The title for the document.
 * @param {Array} seoConfig.meta - Array of meta objects.
 * @param {Array} seoConfig.link - Array of link objects.
 * @param {Array} seoConfig.script - Array of script objects.
 * @returns {Object} The head object to allow updates if needed
 */
export default function useSeo(seoConfig = {}) {
  // Default SEO values
  const defaultSeoConfig = {
    title: 'Jubilos | Os Melhores Eventos do RJ e SP',
    meta: [
      { name: 'title', content: 'Jubilos | Os Melhores Eventos do RJ e SP' },
      { name: 'description', content: 'Encontre os eventos mais hypados de São Paulo e Rio. Shows imperdíveis, festas inesquecíveis e as melhores baladas nas duas maiores capitais do Brasil.' },
      { name: 'keywords', content: 'balada, festa, eventos, São Paulo, Rio de Janeiro, shows, festas exclusivas, melhores eventos, ingressos, nightlife' },
      { name: 'robots', content: 'index, follow' },
      { name: 'author', content: 'Jubilos' },
      { property: 'og:type', content: 'website' },
      { property: 'og:url', content: 'https://jubilos.com.br/' },
      { property: 'og:title', content: 'Jubilos | Onde Rolam os Melhores Events do RJ e SP' },
      { property: 'og:description', content: 'Se liga nos eventos mais hypados do RJ e SP! Encontre seu rolê perfeito, dos shows mais esperados às festas mais comentadas.' },
      { property: 'og:image', content: 'https://jubilos.com.br/og-image.jpg' },
      { property: 'og:locale', content: 'pt_BR' },
      { property: 'twitter:card', content: 'summary_large_image' },
      { property: 'twitter:url', content: 'https://jubilos.com.br/' },
      { property: 'twitter:title', content: 'Jubilos | Onde Rolam os Melhores Events do RJ e SP' },
      { property: 'twitter:description', content: 'Se liga nos eventos mais hypados do RJ e SP! Dos shows mais esperados às festas mais comentadas, tá tudo aqui.' },
      { property: 'twitter:image', content: 'https://jubilos.com.br/twitter-image.jpg' }
    ],
    link: [
      { rel: 'canonical', href: 'https://jubilos.com.br' }
    ],
    script: []
  }

  // Merge user-provided config with defaults
  // This allows partial overrides - only specified properties will be overwritten
  const mergedConfig = {
    title: seoConfig.title || defaultSeoConfig.title,
    meta: seoConfig.meta || defaultSeoConfig.meta,
    link: seoConfig.link || defaultSeoConfig.link,
    script: seoConfig.script || defaultSeoConfig.script
  }

  // Apply the head tags
  return useHead(mergedConfig)
}