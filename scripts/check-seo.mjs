import assert from 'node:assert/strict'

const base = (process.argv[2] || 'http://localhost:3100').replace(/\/$/, '')
const canonicalOrigin = process.env.NEXT_PUBLIC_SERVER_URL || 'https://www.jcibangkok.org'
const paths = ['', '/about', '/events', '/members', '/membership', '/contact', '/photobomb']
const results = []
const titles = new Set()
function tags(html, name) {
  return [...html.matchAll(new RegExp(`<${name}\\b[^>]*>`, 'gi'))].map(([tag]) => Object.fromEntries([...tag.matchAll(/([\w:-]+)="([^"]*)"/g)].map(([, key, value]) => [key.toLowerCase(), value])))
}
async function get(path, options = {}) {
  const response = await fetch(base + path, { headers: { 'user-agent': 'Googlebot' }, ...options })
  return { response, html: await response.text() }
}
async function checkPage(path, expectedSchema) {
  const { response, html } = await get(path)
  assert.equal(response.status, 200, path)
  const metas = tags(html, 'meta')
  const links = tags(html, 'link')
  const title = html.match(/<title>(.*?)<\/title>/s)?.[1]
  assert.ok(title && title.includes('JCI Bangkok'), `${path}: title`)
  assert.ok(metas.find(tag => tag.name === 'description')?.content, `${path}: description`)
  assert.equal(links.find(tag => tag.rel === 'canonical')?.href, canonicalOrigin + path)
  const suffix = path.slice(3)
  for (const language of ['en', 'th']) {
    assert.equal(links.find(tag => tag.hreflang === language)?.href, `${canonicalOrigin}/${language}${suffix}`)
  }
  assert.ok(metas.find(tag => tag.property === 'og:image')?.content.startsWith('http'))
  assert.equal((html.match(/<h1\b/g) || []).length, 1, `${path}: one H1`)
  const schemas = [...html.matchAll(/<script type="application\/ld\+json">(.*?)<\/script>/gs)].map(([, value]) => JSON.parse(value))
  if (expectedSchema) assert.ok(schemas.some(schema => schema['@type'] === expectedSchema || schema['@graph']?.some(item => item['@type'] === expectedSchema)), `${path}: ${expectedSchema}`)
  results.push(path)
  return title
}
for (const locale of ['en', 'th']) {
  for (const path of paths) {
    const title = await checkPage(`/${locale}${path}`, path === '' ? 'Organization' : undefined)
    assert.ok(!titles.has(title), `Duplicate title: ${title}`)
    titles.add(title)
  }
}
const robots = await get('/robots.txt')
assert.match(robots.response.headers.get('content-type'), /text\/plain/)
assert.ok(robots.html.includes(`Sitemap: ${canonicalOrigin}/sitemap.xml`))
const sitemap = await get('/sitemap.xml')
assert.equal(sitemap.response.status, 200)
assert.match(sitemap.response.headers.get('content-type'), /xml/)
const locations = [...sitemap.html.matchAll(/<loc>(.*?)<\/loc>/g)].map(([, url]) => url)
assert.ok(locations.length >= 14)
assert.equal(locations.length, new Set(locations).size)
assert.ok(locations.every(url => url.startsWith(canonicalOrigin + '/') && !url.includes('/admin') && !url.includes('/news/') && !url.includes('#')))
for (const [segment, schema] of [['/events/updates/', 'Article'], ['/events/projects/', 'WebPage'], ['/events/', 'Event']]) {
  const url = locations.find(url => url.includes(`/en${segment}`) && (segment !== '/events/' || !url.includes('/updates/') && !url.includes('/projects/')))
  if (url) await checkPage(new URL(url).pathname, schema)
}
for (const [oldPath, newPath] of [['/en/news', '/en/events#updates'], ['/en/projects', '/en/events#past'], ['/en/about/board', '/en/members#board']]) {
  const { response } = await get(oldPath, { redirect: 'manual' })
  assert.equal(response.status, 308)
  assert.equal(response.headers.get('location'), newPath)
}
for (const path of ['/en/events/nonexistent-seo-audit', '/zz/about']) {
  const { response } = await get(path)
  assert.equal(response.status, 404)
}
const { response: admin } = await get('/admin', { redirect: 'manual' })
assert.equal(admin.headers.get('x-robots-tag'), 'noindex, nofollow')
console.log(`SEO checks passed for ${results.length} pages, ${locations.length} sitemap URLs, robots.txt, legacy redirects, 404s and admin indexing headers.`)
