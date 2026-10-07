import assert from 'node:assert/strict'
import fs from 'node:fs'
import vm from 'node:vm'
import ts from 'typescript'
import React from 'react'
import { renderToStaticMarkup } from 'react-dom/server'
import { createRequire } from 'node:module'
const runtimeRequire = createRequire(import.meta.url)

function load(path, mocks = {}) {
  const source = ts.transpileModule(fs.readFileSync(path, 'utf8'), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020 },
  }).outputText
  const evaluatedModule = { exports: {} }
  vm.runInNewContext(source, { module: evaluatedModule, exports: evaluatedModule.exports, process, URL, Date, require: name => mocks[name] || runtimeRequire(name) }, { filename: path })
  return evaluatedModule.exports
}
const seo = load('src/lib/seo.ts', { 'next/navigation': { notFound() { throw new Error('404') } } })
assert.throws(() => seo.staticMetadata('fr', 'home'), /404/)
for (const locale of ['en', 'th']) {
  const metadata = seo.staticMetadata(locale, 'home')
  assert.ok(metadata.title.absolute.endsWith(' | JCI Bangkok'))
  assert.equal(metadata.alternates.canonical, `${seo.siteOrigin()}/${locale}`)
}
const structured = load('src/components/structured-data.tsx', {
  '@/lib/seo': seo, 'next/link': () => null,
})
const hostile = '</script><script>alert("x")</script>'
const html = renderToStaticMarkup(React.createElement(structured.StructuredData, { data: { name: hostile } }))
assert.equal((html.match(/<script/g) || []).length, 1)
assert.equal(JSON.parse(html.match(/>(.*)<\/script>/s)[1]).name, hostile)

const calls = []
const content = load('src/lib/public-content.ts', {
  react: { cache: fn => fn },
  payload: { getPayload: async () => ({ find: async query => { calls.push(query); return { docs: [] } } }) },
  '@/payload.config': {}, './seo': seo,
})
;(async () => {
  await content.getPublicContent('events', 'en', 'draft-event')
  assert.deepEqual(JSON.parse(JSON.stringify(calls[0].where.and[1].status.in)), ['upcoming', 'completed', 'cancelled'])
  await content.getPublicContent('articles', 'th', 'scheduled-article')
  assert.ok(Date.parse(calls[1].where.and[1].publishDate.less_than_equal) <= Date.now())
  assert.equal(calls[1].locale, 'th')
  await assert.rejects(content.getPublicContent('articles', 'zz', 'missing'), /404/)
  console.log('SEO unit checks passed: locale validation, branded titles, JSON-LD escaping and publication query filters.')
})().catch(error => { console.error(error); process.exitCode = 1 })
