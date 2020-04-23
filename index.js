addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

/**
 * Respond with hello worker text
 * @param {Request} request
 */
handleRequest = async (request) => {
  const variants = await getVariantsFromAPI();

  const randomIndex = Math.floor(Math.random() * variants.length);
  const variantPage = await getVariantPage(variants, randomIndex);

  return variantPage;
}

getVariantsFromAPI = async () => {
  const response = await fetch('https://cfw-takehome.developers.workers.dev/api/variants');
  const responseJSON = await response.json();
  
  return responseJSON.variants;
}

getVariantPage = async (variants, randomIndex) => {
  const variant = variants[randomIndex];
  
  const response = await fetch(variant);
  return response;
}