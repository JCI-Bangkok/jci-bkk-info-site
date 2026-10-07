import assert from 'node:assert/strict'
import { chromium } from 'playwright'

async function eventually(check) {
  const deadline = Date.now() + 15000
  let lastError
  while (Date.now() < deadline) {
    try { await check(); return } catch (error) { lastError = error }
    await new Promise(resolve => setTimeout(resolve, 100))
  }
  throw lastError
}
function expect(target) {
  return {
    toBeVisible: () => target.waitFor({ state: 'visible' }),
    toContainText: expected => eventually(async () => assert.ok((await target.innerText()).includes(expected))),
    toHaveText: expected => eventually(async () => assert.equal((await target.innerText()).trim(), expected)),
    toHaveTitle: expected => eventually(async () => assert.equal(await target.title(), expected)),
  }
}
expect.poll = check => ({ toBe: expected => eventually(async () => assert.equal(await check(), expected)) })

const base = process.argv[2] || 'http://localhost:3100'
assert.ok(['localhost', '127.0.0.1'].includes(new URL(base).hostname), 'CMS fixture checks must run against localhost, never production.')
const browser = await chromium.launch({ headless: true })
const context = await browser.newContext({ viewport: { width: 1440, height: 1100 } })
const errors = []
const page = await context.newPage()
page.on('pageerror', error => errors.push(error.message))
async function fixture(collection, slug) {
  const response = await context.request.get(`${base}/api/${collection}?limit=1&where[slug][equals]=${slug}`)
  assert.equal(response.status(), 200)
  const result = await response.json()
  assert.ok(result.docs?.[0], `Missing ${collection}/${slug}: run isolated fixture setup first.`)
  return result.docs[0]
}
async function edit(collection, doc, locale = 'en') {
  await page.goto(`${base}/admin/collections/${collection}/${doc.id}?locale=${locale}`, { waitUntil: 'networkidle' })
  await page.getByText('SEO & social', { exact: true }).click()
  await expect(page.locator('.jci-seo')).toBeVisible()
}
try {
  const login = await context.request.post(`${base}/api/users/login`, { data: { email: 'cms-editor@example.test', password: 'cms-editor-local-test-only' } })
  assert.equal(login.status(), 200)
  const article = await fixture('articles', 'cms-test-article')
  const event = await fixture('events', 'cms-test-event')
  const project = await fixture('projects', 'cms-test-project')
  const customPage = await fixture('pages', 'cms-custom-page')
  for (const [collection, doc] of [['articles', article], ['events', event], ['projects', project], ['pages', customPage]]) {
    await edit(collection, doc)
    await expect(page.locator('.jci-seo__search-title')).toContainText('JCI Bangkok')
    await expect(page.locator('.jci-seo__url').first()).toContainText('https://www.jcibangkok.org/en/')
  }
  await edit('articles', article)
  await expect(page.locator('.jci-seo__image img')).toBeVisible()
  await expect.poll(() => page.locator('.jci-seo__image img').evaluate(image => image.complete && image.naturalWidth > 0)).toBe(true)
  await page.locator('#field-seo__title').fill('Unsaved leadership article')
  await expect(page.locator('.jci-seo__search-title')).toHaveText('Unsaved leadership article | JCI Bangkok')
  await page.locator('#field-seo__socialTitle').fill('A different social headline')
  await expect(page.locator('.jci-seo__social-copy h4')).toHaveText('A different social headline')
  await page.locator('.jci-seo').evaluate(panel => window.scrollTo(0, Math.max(0, panel.getBoundingClientRect().top + window.scrollY - 120)))
  await page.locator('.jci-seo').screenshot({ path: 'docs/cms-seo-editor-preview.png' })
  await page.setViewportSize({ width: 390, height: 844 })
  const panelWidth = await page.locator('.jci-seo').evaluate(panel => panel.scrollWidth <= panel.clientWidth + 2)
  assert.ok(panelWidth, 'SEO panel must fit on mobile')
  await page.setViewportSize({ width: 1440, height: 1100 })
  await edit('articles', article, 'th')
  await expect(page.locator('.jci-seo__locale')).toContainText('Thai')
  await page.locator('#field-seo__title').fill('บทความพัฒนาผู้นำ')
  await expect(page.locator('.jci-seo__search-title')).toHaveText('บทความพัฒนาผู้นำ | JCI Bangkok')
  await expect(page.locator('.jci-seo__url').first()).toContainText('/th/events/updates/')

  await edit('pages', customPage)
  await page.locator('#field-seo__title').fill('Saved SEO title')
  await page.locator('#field-seo__description').fill('A saved editorial description that appears in the public HTML metadata for this custom page.')
  await page.locator('#field-seo__socialTitle').fill('Saved social title')
  await page.locator('.collapsible').filter({ has: page.getByText('Advanced indexing controls', { exact: true }) }).locator('.collapsible__toggle').click()
  await page.locator('#field-seo__canonicalUrl').fill('javascript:alert(1)')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  await expect(page.getByText('Enter a complete HTTP(S) URL without credentials or a fragment, or leave this empty.')).toBeVisible()
  await page.locator('#field-seo__canonicalUrl').fill('')
  const saved = page.waitForResponse(response => response.url().includes(`/api/pages/${customPage.id}`) && response.request().method() === 'PATCH')
  await page.getByRole('button', { name: 'Save', exact: true }).click()
  assert.equal((await saved).status(), 200)
  await page.goto(`${base}/en/cms-custom-page`, { waitUntil: 'domcontentloaded' })
  await expect(page).toHaveTitle('Saved SEO title | JCI Bangkok')
  assert.equal(await page.locator('meta[property="og:title"]').getAttribute('content'), 'Saved social title')
  assert.ok((await (await context.request.get(`${base}/sitemap.xml`)).text()).includes('/en/cms-custom-page'))
  for (const seo of [{ noIndex: true }, { excludeFromSitemap: true }, { canonicalUrl: 'https://www.jcibangkok.org/en/about' }]) {
    const updated = await context.request.patch(`${base}/api/pages/${customPage.id}?locale=en`, { data: { seo: { title: 'Saved SEO title', description: 'CMS test description', noIndex: false, noFollow: false, excludeFromSitemap: false, canonicalUrl: '', ...seo } } })
    assert.equal(updated.status(), 200)
    const sitemap = await (await context.request.get(`${base}/sitemap.xml`)).text()
    assert.ok(!sitemap.includes('https://www.jcibangkok.org/en/cms-custom-page'), 'Indexing/sitemap controls must affect the public sitemap')
    if (seo.noIndex) {
      await page.goto(`${base}/en/cms-custom-page`)
      assert.ok((await page.locator('meta[name="robots"]').getAttribute('content')).includes('noindex'))
    }
    if (seo.canonicalUrl) {
      await page.goto(`${base}/en/cms-custom-page`)
      assert.equal(await page.locator('link[rel="canonical"]').getAttribute('href'), seo.canonicalUrl)
    }
  }
  await context.request.patch(`${base}/api/pages/${customPage.id}?locale=en`, { data: { seo: { title: '', description: 'A custom CMS page fixture.', socialTitle: '', noIndex: false, noFollow: false, excludeFromSitemap: false, canonicalUrl: '' } } })
  const publicContext = await browser.newContext()
  const draftList = await publicContext.request.get(`${base}/api/articles?where[slug][equals]=private-draft`)
  assert.equal((await draftList.json()).totalDocs, 0)
  assert.equal((await publicContext.request.get(`${base}/en/events/updates/private-draft`)).status(), 404)
  await publicContext.close()
  const viewerContext = await browser.newContext()
  const viewerLogin = await viewerContext.request.post(`${base}/api/users/login`, { data: { email: 'cms-viewer@example.test', password: 'cms-viewer-local-test-only' } })
  const viewer = (await viewerLogin.json()).user
  assert.equal((await viewerContext.request.patch(`${base}/api/articles/${article.id}`, { data: { title: 'Not allowed' } })).status(), 403)
  const escalated = await viewerContext.request.patch(`${base}/api/users/${viewer.id}`, { data: { roles: ['super-admin'] } })
  if (escalated.ok()) assert.ok(!(await escalated.json()).doc.roles.includes('super-admin'))
  else assert.equal(escalated.status(), 403)
  await viewerContext.close()
  assert.deepEqual(errors, [], 'CMS must not raise browser rendering errors')
  console.log('CMS browser checks passed: all four editors, live unsaved search/social previews, image loading, Thai locale, mobile fit, URL validation, saved metadata, sitemap/noindex/canonical controls, private drafts and viewer permissions.')
} finally {
  await browser.close()
}
