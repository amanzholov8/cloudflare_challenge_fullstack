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

  const transformedPage = new HTMLRewriter()
    .on('title', new TitleHandler())
    .on('h1#title', new h1TitleHandler(randomIndex))
    .on('p#description', new pDescriptionHandler(randomIndex))
    .on('a#url', new aUrlHandler())
    .transform(variantPage);

  return transformedPage;
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

class TitleHandler {
  element(element) {
    element.setInnerContent('Cloudflare Challenge');
  }
}

class h1TitleHandler {
  constructor(randomIndex) {
    this.randomIndex = randomIndex;
  }

  element(element) {
    element.setInnerContent(
      this.randomIndex==0 ? 
        'Changed Variant 1 Title'
        : 'Changed Variant 2 Title'
    );
  }
}

class pDescriptionHandler {
  constructor(randomIndex) {
    this.randomIndex = randomIndex;
  }

  element(element) {
    element.setInnerContent(
      this.randomIndex==0 ? 
        'This is a changed Variant 1 description' 
        : 'This is a changed Variant 2 description'
    );
  }
}

class aUrlHandler {
  element(element) {
    element.setInnerContent("Go to A8V's GitHub page");
    element.setAttribute('href', 'https://github.com/amanzholov8');
  }
}