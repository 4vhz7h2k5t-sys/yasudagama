import assert from 'node:assert/strict';
const base = process.env.QA_BASE_URL || 'http://127.0.0.1:8793';
const results = [];
for (const [path,expected] of [['/',200],['/courses/',200],['/not-a-page',404],['/robots.txt',200],['/images/pottery-wheel.webp',200]]) {
  const res = await fetch(new URL(path,base));
  assert.equal(res.status,expected,`${path}: status`);
  assert.equal(res.headers.get('x-robots-tag'),'noindex, nofollow, noarchive',`${path}: noindex header`);
  assert.match(res.headers.get('content-security-policy'),/form-action 'none'/);
  if (path==='/' || path==='/courses/') assert.match(await res.text(),/name="robots" content="noindex,nofollow,noarchive"/);
  results.push({path,status:res.status,noindex:true});
}
console.log(JSON.stringify({base,passed:true,routes:results},null,2));
