export async function onRequestGet(context) {
  const { request, env, params } = context;
  const response = await env.ASSETS.fetch(request);
  
  if (!response.ok) return response;
  
  const id = params.id;
  if (!id) return response;
  
  let displayName = 'Collector';
  let deckCount = 0;
  let sealedCount = 0;
  let totalCards = 0;
  
  try {
     const decodedUrl = decodeURIComponent(id);
     const binary = atob(decodedUrl);
     const bytes = new Uint8Array(binary.length);
     for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
     }
     const jsonString = new TextDecoder().decode(bytes);
     const parsed = JSON.parse(jsonString);
     
     if (parsed.u) displayName = parsed.u;
     if (parsed.d && Array.isArray(parsed.d)) {
         deckCount = parsed.d.length;
         parsed.d.forEach(deck => {
             if (deck.p && Array.isArray(deck.p)) {
                 totalCards += deck.p.reduce((acc, curr) => acc + (curr.q || 1), 0);
             }
         });
     }
     if (parsed.s && Array.isArray(parsed.s)) {
         sealedCount = parsed.s.reduce((acc, curr) => acc + (curr.q || 1), 0);
     }
  } catch (err) {
      // Ignore
  }
  
  const title = `${displayName}'s Pokémon TCG Portfolio | DECK / divider`;
  const description = `View ${displayName}'s Pokémon TCG collection, including ${deckCount} decks, ${sealedCount} sealed products, and ${totalCards} cards.`;
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    "name": title,
    "description": description
  };
  
  class ElementHandler {
    element(element) {
      element.append(`<title>${title}</title>`, { html: true });
      element.append(`<meta name="description" content="${description}">`, { html: true });
      element.append(`<meta property="og:title" content="${title}">`, { html: true });
      element.append(`<meta property="og:description" content="${description}">`, { html: true });
      element.append(`<script type="application/ld+json">${JSON.stringify(schema)}</script>`, { html: true });
    }
  }

  return new HTMLRewriter()
    .on('head', new ElementHandler())
    .transform(response);
}
