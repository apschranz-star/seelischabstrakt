/* Builds the storefront and puts the result where the hosts serve it from:
   ../index.html and ../app/. The repository root is published as it is
   (Netlify has no build step, GitHub Pages copies the files), so the built
   files are committed.

     node scripts/build.mjs          build and install into the repo root
     node scripts/build.mjs --check  build and compare with what is committed;
                                     exits 1 when the committed build is stale */
import {build} from 'vite';
import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const store = path.resolve(here, '..');
const root = path.resolve(store, '..');
const dist = path.join(root, '.store-dist');
const check = process.argv.includes('--check');

await build({root: store, logLevel: 'warn'});

const read = (dir) => (fs.existsSync(dir) ? fs.readdirSync(dir).sort() : []);
const same = (a, b) => fs.existsSync(a) && fs.existsSync(b) && fs.readFileSync(a).equals(fs.readFileSync(b));

if (check) {
  const want = read(path.join(dist, 'app'));
  const have = read(path.join(root, 'app'));
  const stale = [];
  if (!same(path.join(dist, 'index.html'), path.join(root, 'index.html'))) stale.push('index.html');
  for (const f of want) if (!same(path.join(dist, 'app', f), path.join(root, 'app', f))) stale.push('app/' + f);
  for (const f of have) if (!want.includes(f)) stale.push('app/' + f + ' (left over)');
  fs.rmSync(dist, {recursive: true, force: true});
  if (stale.length) {
    console.error('The committed storefront build is stale. Run: cd store && npm run build\n  ' + stale.join('\n  '));
    process.exit(1);
  }
  console.log('Committed storefront build matches the source.');
} else {
  fs.rmSync(path.join(root, 'app'), {recursive: true, force: true});
  fs.cpSync(path.join(dist, 'app'), path.join(root, 'app'), {recursive: true});
  fs.copyFileSync(path.join(dist, 'index.html'), path.join(root, 'index.html'));
  fs.rmSync(dist, {recursive: true, force: true});
  const files = read(path.join(root, 'app'));
  const kb = (f) => (fs.statSync(path.join(root, 'app', f)).size / 1024).toFixed(1).padStart(8) + ' kB  app/' + f;
  console.log('Storefront built into the repository root:\n' + files.map(kb).join('\n'));
}
