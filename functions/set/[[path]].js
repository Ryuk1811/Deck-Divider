export async function onRequestGet(context) {
  const { request, env, params } = context;
  const response = await env.ASSETS.fetch(request);
  
  if (!response.ok) return response;
  
  const pathParts = params.path || [];
  const setId = pathParts[0];
  const isTopCards = pathParts[1] === 'top-cards';
  
  if (!setId) return response;
  
  let setName = 'Pokémon Set';
  let setSeries = 'Pokémon TCG';
  let totalCards = 0;
  let imageUrl = '';
  
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 1500); // 1.5s max wait for edge
    const apiRes = await fetch(`https://api.pokemontcg.io/v2/sets/${setId}`, {
      signal: controller.signal
    });
    clearTimeout(timeoutId);
    
    if (apiRes.ok) {
      const data = await apiRes.json();
      if (data.data) {
         setName = data.data.name;
         setSeries = data.data.series;
         totalCards = data.data.total;
         imageUrl = data.data.images?.logo || '';
      }
    }
  } catch(e) { 
    // Silently fail and fallback to default generic tags if API is slow or down
  }
  
  let title = `${setName} (${setSeries}) - Pokémon TCG Card List | DECK / divider`;
  let description = `Browse all ${totalCards} cards in the ${setName} expansion for the Pokémon Trading Card Game. View prices, legality, and variations.`;
  
  if (isTopCards) {
      title = `Top 10 Most Expensive Cards in ${setName} | DECK / divider`;
      description = `Discover the top most valuable and chased cards in the ${setName} expansion.`;
  }
  
  const schema = {
     "@context": "https://schema.org",
     "@type": "CollectionPage",
     "name": title,
     "description": description,
     "image": imageUrl
  };

  class ElementHandler {
    element(element) {
      element.append(`<title>${title}</title>`, { html: true });
      element.append(`<meta name="description" content="${description}">`, { html: true });
      element.append(`<meta property="og:title" content="${title}">`, { html: true });
      element.append(`<meta property="og:description" content="${description}">`, { html: true });
      if (imageUrl) {
         element.append(`<meta property="og:image" content="${imageUrl}">`, { html: true });
      }
      element.append(`<script type="application/ld+json">${JSON.stringify(schema)}</script>`, { html: true });
    }
  }

  return new HTMLRewriter()
    .on('head', new ElementHandler())
    .transform(response);
}
