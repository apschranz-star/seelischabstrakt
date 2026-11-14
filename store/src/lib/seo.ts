/* Structured data for search engines: every work as a VisualArtwork with its
   offer. Written into the <script type="application/ld+json" id="ld-products">
   element that index.html already holds. */
import type {Shop} from './shop';

export function writeStructuredData(shop: Shop): void {
  const el = document.getElementById('ld-products');
  if (!el) return;
  const {site, works, L} = shop;
  const base = location.origin + location.pathname;
  const currency = site.commerce?.currency || 'EUR';
  const items = (shop.soon ? [] : works).map((w, i) => {
    const available = !!w.original?.available;
    const price = available ? w.original!.price : (w.prints?.[0]?.price ?? 0);
    const medium = L(w.medium);
    return {
      '@type': 'ListItem',
      position: i + 1,
      item: {
        '@type': ['VisualArtwork', 'Product'],
        '@id': `${base}#work/${w.id}`,
        name: w.title,
        url: `${base}#work/${w.id}`,
        description: [L(w.caption), [medium, `${w.w} × ${w.h} cm`, w.year].filter(Boolean).join(', ')]
          .filter(Boolean)
          .join(' '),
        image: w.img ? base + w.img : undefined,
        artform: 'Painting',
        artMedium: medium || undefined,
        dateCreated: w.year ? String(w.year) : undefined,
        width: {'@type': 'QuantitativeValue', value: w.w, unitCode: 'CMT'},
        height: {'@type': 'QuantitativeValue', value: w.h, unitCode: 'CMT'},
        creator: {'@type': 'Person', name: site.brand.artist},
        brand: {'@type': 'Brand', name: site.brand.name},
        offers: {
          '@type': 'Offer',
          priceCurrency: currency,
          price,
          availability:
            available || w.prints?.length ? 'https://schema.org/InStock' : 'https://schema.org/SoldOut',
          itemCondition: 'https://schema.org/NewCondition',
          seller: {'@type': 'Person', name: site.brand.artist},
        },
      },
    };
  });
  el.textContent = JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: `${site.brand.name} works`,
    itemListElement: items,
  });
}
