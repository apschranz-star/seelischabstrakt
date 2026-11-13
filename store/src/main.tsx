/* Entry of the storefront. Order of the style imports matters: the layer
   order first, then Astryx, then the shop's theme, then the shop's own rules. */
import './styles/base.css';
import '@astryxdesign/core/reset.css';
import '@astryxdesign/core/astryx.css';
import './theme/seelisch.css';
import './styles/theme-extra.css';
import './styles/page.css';
import {createRoot} from 'react-dom/client';
import {App} from './App';
import {loadShop} from './lib/shop';

document.documentElement.classList.add('js');
const root = document.getElementById('root')!;

/* index.html already shows header and wordmark as plain HTML. It stays on
   screen until the content files are here; then React takes the page over. */
loadShop()
  .then((initial) => createRoot(root).render(<App initial={initial} />))
  .catch((err) => {
    console.error(err);
    const de = (navigator.language || '').toLowerCase().startsWith('de');
    const box = document.createElement('div');
    box.className = 'fatal';
    box.setAttribute('role', 'alert');
    const p = document.createElement('p');
    p.textContent = de
      ? 'Der Shop konnte seine Inhalte nicht laden. Bitte lade die Seite neu.'
      : 'The shop could not load its content. Please reload the page.';
    const a = document.createElement('a');
    a.href = location.pathname;
    a.textContent = de ? 'Neu laden' : 'Reload';
    box.append(p, a);
    document.querySelector('main')?.replaceChildren(box);
  });
