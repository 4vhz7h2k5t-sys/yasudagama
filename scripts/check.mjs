import assert from 'node:assert/strict';
import { readFile, stat, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import worker from '../src/worker.js';

const root = new URL('../dist/', import.meta.url).pathname;
const documents = ['index.html', 'courses/index.html', '404.html'];
let localLinks = 0;
for (const file of documents) {
  const html = await readFile(join(root,file),'utf8');
  assert.match(html, /<html lang="ja">/);
  assert.match(html, /<meta name="robots" content="noindex,nofollow,noarchive">/);
  assert.equal([...html.matchAll(/<h1[ >]/g)].length,1, `${file}: one page heading`);
  assert.match(html, /非公式の自主制作デモ/);
  assert.match(html, /修正・削除/);
  assert.doesNotMatch(html, /<form[ >]|mailto:|<script[^>]+src="https?:/);
  const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(m=>m[1]);
  assert.equal(ids.length,new Set(ids).size,`${file}: unique IDs`);
  for (const [,url] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (url.startsWith('#')) assert(ids.includes(url.slice(1)),`${file}: missing anchor ${url}`);
    if (!url.startsWith('/')) continue;
    const parsed = new URL(url,'https://local.test');
    let target = parsed.pathname.endsWith('/') ? parsed.pathname+'index.html' : parsed.pathname;
    await stat(join(root,target));
    if (parsed.hash) {
      const targetHtml = await readFile(join(root,target),'utf8');
      assert(targetHtml.includes(`id="${parsed.hash.slice(1)}"`),`Broken cross-page anchor: ${url}`);
    }
    localLinks++;
  }
  for (const [,attrs] of html.matchAll(/<a ([^>]*target="_blank"[^>]*)>/g)) assert.match(attrs,/rel="noopener noreferrer"/);
}
assert.match(await readFile(join(root,'robots.txt'),'utf8'),/Disallow: \//);
let imagesSize = 0;
for (const file of await readdir(join(root,'images'))) {
  const data = await readFile(join(root,'images',file));
  assert.equal(data.toString('ascii',8,12),'WEBP');
  assert(data.length<250_000, `${file}: image budget`);
  imagesSize += data.length;
}
assert(imagesSize<500_000,'Image budget: below 500 kB for all versions');
for (const status of [200, 404, 307]) {
  const source = new Response(status===307 ? null : 'fixture', {status,headers:status===307 ? {Location:'/courses/'} : {}});
  const response = await worker.fetch(new Request('https://local.test/'),{ASSETS:{fetch:async()=>source}});
  assert.equal(response.status,status);
  assert.equal(response.headers.get('X-Robots-Tag'),'noindex, nofollow, noarchive');
  assert.match(response.headers.get('Content-Security-Policy'),/frame-ancestors 'none'/);
  if (status===307) assert.equal(response.headers.get('Location'),'/courses/');
}
console.log(`PASS: ${documents.length} pages; ${localLinks} local links/assets; noindex, unique anchors, external-link isolation, image budget (${imagesSize} bytes), Worker headers/status preservation.`);
