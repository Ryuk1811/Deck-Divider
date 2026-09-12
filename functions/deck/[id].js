export async function onRequestGet(context) {
  const { request, env, params } = context;
  const response = await env.ASSETS.fetch(request);
  
  if (!response.ok) return response;
  
  const id = params.id;
  if (!id) return response;
  
  let deckName = 'Shared Deck';
  let cardCount = 0;
  
  try {
     const decodedUrl = decodeURIComponent(id);
     const binary = atob(decodedUrl);
     const bytes = new Uint8Array(binary.length);
     for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
     }
     const jsonString = new TextDecoder().decode(bytes);
     const parsed = JSON.parse(jsonString);
     
     if (parsed.n) deckName = parsed.n;
     if (parsed.p && Array.isArray(parsed.p)) {
         cardCount = parsed.p.reduce((acc, curr) => acc + (curr.q || 1), 0);
     }
  } catch (err) {
      // Ignore parsing errors, return default
  }
  
  const title = `${deckName} - Pokémon TCG Deck | DECK / divider`;
  const description = `View ${deckName}, a ${cardCount}-card Pokémon TCG deck built on DECK / divider.`;
  
  const schema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": deckName,
    "description": description,
    "numberOfItems": cardCount,
    "itemListElement": []
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
