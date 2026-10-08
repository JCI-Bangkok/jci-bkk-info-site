import { transform } from 'sucrase';

export type CodeSource = {
  html: string;
  css: string;
  javascript: string;
  typescript?: string;
};

function escapeHTML(value: unknown) {
  return String(value ?? '').replace(/[&<>"']/g, (char) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]!));
}

/**
 * Cybersecurity: Text-only CMS bindings; strictly blocks prototype pollution
 * and never evaluates expressions.
 */
export function bindCodeHTML(source: string, documentData: unknown) {
  if (!source) return '';
  return source.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (_, path: string) => {
    let value: unknown = documentData;
    for (const key of path.split('.')) {
      if (['__proto__', 'prototype', 'constructor'].includes(key) || !value || typeof value !== 'object' || !Object.hasOwn(value, key)) return '';
      value = (value as Record<string, unknown>)[key];
    }
    return typeof value === 'string' || typeof value === 'number' || typeof value === 'boolean' ? escapeHTML(value) : '';
  });
}

/**
 * Transpile TypeScript / TSX to safe JavaScript using Sucrase.
 * Strips imports/exports safely and compiles JSX to React.createElement.
 */
export function transpileTypeScript(tsCode: string): { code: string; error?: string } {
  if (!tsCode || !tsCode.trim()) return { code: '' };
  try {
    // 1. Strip 'server-only' directive
    let sanitizedCode = tsCode.replace(/import\s+['"]server-only['"];?/g, '');
    
    // 2. Strip Next.js config exports if present
    sanitizedCode = sanitizedCode.replace(/export\s+const\s+revalidate\s*=\s*\d+;?/g, '');

    const res = transform(sanitizedCode, {
      transforms: ['typescript', 'jsx', 'imports'],
      jsxRuntime: 'classic',
      production: true,
    });
    return { code: res.code };
  } catch (err: unknown) {
    const errorMsg = err instanceof Error ? err.message : String(err || 'TypeScript transpilation error');
    return { code: '', error: errorMsg };
  }
}

/**
 * Generates an isolated, sandboxed HTML document string with React, ReactDOM,
 * Tailwind CSS support, module system shim, and universal mounting engine.
 * Wrapped in strict Content Security Policy and iframe sandbox.
 */
export function codeDocument(source: CodeSource, documentData: unknown) {
  const styles = (source.css || '').replace(/<\/style/gi, '<\\/style');
  
  // 1. Process custom JavaScript
  let scriptContent = source.javascript || '';

  // 2. Transpile and append TypeScript if present
  let tsCompileError = '';
  if (source.typescript && source.typescript.trim()) {
    const transpileResult = transpileTypeScript(source.typescript);
    if (transpileResult.error) {
      tsCompileError = transpileResult.error;
    } else if (transpileResult.code) {
      scriptContent += `\n/* Transpiled TypeScript / TSX */\n${transpileResult.code}`;
    }
  }

  // 3. Escape closing script tags to prevent script-breakout attacks
  const safeScript = scriptContent.replace(/<\/script/gi, '<\\/script');

  // 4. Render error overlay if TypeScript failed to compile
  const errorBanner = tsCompileError
    ? `<div style="background:#fee2e2;border:1px solid #f87171;color:#b91c1c;padding:12px;margin:12px;border-radius:6px;font-family:monospace;font-size:12px;white-space:pre-wrap;"><strong>[TypeScript Compilation Error]</strong>\n${escapeHTML(tsCompileError)}</div>`
    : '';

  // 5. Safely serialize documentData for script access
  const safeDocDataJSON = JSON.stringify(documentData || {}).replace(/<\/script/gi, '<\\/script');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; script-src 'unsafe-inline' https://cdn.tailwindcss.com https://unpkg.com; style-src 'unsafe-inline'; img-src https: data:; font-src https: data:; connect-src 'none'; form-action 'none';">
  <!-- Tailwind CSS & React UMD Runtime -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <style>
    :root {
      --jci-blue: #0097D8;
      --jci-navy: #002D62;
      --jci-black: #0C121C;
      --paper-soft: #F8F9FA;
      --ink: #111827;
      --line: rgba(0, 0, 0, 0.08);
      --muted: #64748B;
    }
    body {
      margin: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      color: #0F172A;
      background-color: transparent;
    }
    * { box-sizing: border-box; }
    ${styles}
  </style>
</head>
<body>
  ${errorBanner}
  <div id="root">${bindCodeHTML(source.html || '', documentData)}</div>
  <script>
    // 1. Fallback mini-React runtime if offline or CDN is blocked
    if (typeof window.React === 'undefined') {
      window.React = {
        createElement: function(tag, props) {
          var children = Array.prototype.slice.call(arguments, 2);
          if (typeof tag === 'function') {
            props = props || {};
            props.children = children.length === 1 ? children[0] : (children.length > 1 ? children : null);
            return tag(props);
          }
          var el = document.createElement(tag || 'div');
          if (props) {
            for (var k in props) {
              if (k === 'className') el.className = props[k];
              else if (k === 'style' && typeof props[k] === 'object') Object.assign(el.style, props[k]);
              else if (k.startsWith('on') && typeof props[k] === 'function') el.addEventListener(k.substring(2).toLowerCase(), props[k]);
              else if (k !== 'children' && k !== '__self' && k !== '__source') el.setAttribute(k, props[k]);
            }
          }
          for (var i = 0; i < children.length; i++) {
            var c = children[i];
            if (c == null) continue;
            if (Array.isArray(c)) {
              for (var j = 0; j < c.length; j++) {
                el.appendChild(typeof c[j] === 'object' && c[j] instanceof Node ? c[j] : document.createTextNode(String(c[j])));
              }
            } else {
              el.appendChild(typeof c === 'object' && c instanceof Node ? c : document.createTextNode(String(c)));
            }
          }
          return el;
        },
        Fragment: function(props) { return props && props.children; },
        useState: function(init) { return [init, function(){}]; },
        useEffect: function(fn) { try { fn(); } catch(e){} },
        useMemo: function(fn) { return fn(); },
        useCallback: function(fn) { return fn; },
        useRef: function(init) { return { current: init }; },
        useContext: function() { return {}; }
      };
    }

    var React = window.React;
    var ReactDOM = window.ReactDOM;

    // 2. Safe module wrapper helper: ensures ANY property access returns a callable function, preventing ".call is undefined"
    function createSafeModule(baseObj, defaultExport) {
      var base = Object.assign({}, baseObj);
      base.__esModule = true;
      if (!base.default && defaultExport) base.default = defaultExport;
      if (typeof Proxy !== 'undefined') {
        return new Proxy(base, {
          get: function(target, prop) {
            if (prop in target) return target[prop];
            if (typeof prop === 'symbol' || prop === 'then' || prop === 'toJSON') return undefined;
            var fallbackFn = function() {
              return Promise.resolve([]);
            };
            fallbackFn.default = fallbackFn;
            return fallbackFn;
          }
        });
      }
      return base;
    }

    // Module System Shim for safe imports
    var _modules = {
      'react': window.React,
      'react-dom': window.ReactDOM,
      'react-dom/client': window.ReactDOM,
      'next/link': createSafeModule({}, function Link(props) {
        var p = Object.assign({}, props);
        return React.createElement('a', Object.assign({ href: p.href || '#' }, p), p.children);
      }),
      'next/image': createSafeModule({}, function Image(props) {
        var p = Object.assign({}, props);
        var src = (p.src && (p.src.src || p.src.url)) || p.src || '';
        return React.createElement('img', Object.assign({}, p, { src: src, alt: p.alt || '' }));
      }),
      'next/navigation': createSafeModule({
        notFound: function() { console.warn('[Preview] notFound called'); },
        useRouter: function() { return { push: function(){}, replace: function(){}, back: function(){} }; },
        usePathname: function() { return window.location.pathname; },
        useSearchParams: function() { return new URLSearchParams(); },
        permanentRedirect: function() {}
      }),
      'payload': createSafeModule({
        getPayload: function() {
          return Promise.resolve({
            find: function() { return Promise.resolve({ docs: [] }); },
            findGlobal: function() { return Promise.resolve({}); }
          });
        }
      })
    };

    function require(name) {
      if (_modules[name]) return _modules[name];
      if (name.indexOf('site-data') !== -1) {
        return createSafeModule({
          opportunities: [
            { title: 'Leadership', description: 'Develop skills', href: '/events' },
            { title: 'Business', description: 'Network with professionals', href: '/events' },
            { title: 'International', description: 'Connect globally', href: '/events' },
            { title: 'Community', description: 'Make an impact', href: '/events' }
          ],
          boardMembers: [],
          pastPresidents: []
        });
      }
      if (name.indexOf('activity-data') !== -1 || name.indexOf('media') !== -1) {
        var acts = (window.documentData && (window.documentData.activities || window.documentData.events)) || [];
        var photos = (window.documentData && window.documentData.photos) || [];
        return createSafeModule({
          getActivities: function() { return Promise.resolve({ activities: acts, today: new Date().toISOString() }); },
          getGalleryPhotos: function() { return Promise.resolve(photos); },
          mediaUrl: function(u) { return (u && (u.url || u.src)) || u || ''; }
        });
      }
      if (name.indexOf('i18n') !== -1) {
        return createSafeModule({
          getDictionary: function(locale) {
            var d = (window.documentData && window.documentData.dictionary) || {};
            return {
              nav: Object.assign({ home: 'Home', about: 'About', events: 'Events', membership: 'Join JCI Bangkok', members: 'BODs & Members', photobomb: 'PhotoBomb', news: 'News', contact: 'Contact Us', join: 'Join JCI Bangkok', becomeMember: 'Join JCI Bangkok' }, d.nav),
              common: Object.assign({ readMore: 'Read more', seeAll: 'See all', learnMore: 'Learn more', back: 'Back', viewDetails: 'View details', loading: 'Loading...', noData: 'No content available.' }, d.common),
              events: Object.assign({ title: 'Events', sub: 'Explore events', upcoming: 'Upcoming', past: 'Past', details: 'Event details' }, d.events),
              home: Object.assign({
                heroTitlePrefix: '2026 Theme ', heroTitleHighlight: 'Young to Yak ', heroTitleSuffix: '12 years JCI Bangkok',
                heroSub: 'A Bangkok community where young people build leadership through real projects.',
                pathwaysHeading: 'Four ways to move forward.', pathwaysSub: 'Choose the opportunity that fits where you are now.',
                pathways: [
                  { title: 'Join at least 3 JCI Bangkok events', detail: 'Attend official monthly events' },
                  { title: 'Interview with the Membership Team', detail: 'Meet the team' },
                  { title: 'Pass the interview and pay the fee', detail: 'Confirm membership' },
                  { title: 'Join the Line group', detail: 'Stay updated' }
                ],
                upcomingEvents: 'Upcoming Events', featuredProject: 'Featured Project', memberVoice: 'Member Voices', latestNews: 'Latest News'
              }, d.home),
              about: Object.assign({ title: 'About JCI Bangkok', sub: 'Developing leaders for a changing world.' }, d.about),
              contact: Object.assign({ title: 'Contact Us', sub: 'Get in touch with JCI Bangkok', desc: 'Membership and inquiries' }, d.contact),
              membership: Object.assign({ title: 'Join JCI Bangkok', sub: 'Leadership development network' }, d.membership)
            };
          }
        });
      }
      // Safe proxy fallback for any other component or module
      return createSafeModule();
    }

    // 3. Live document data & module sandbox
    window.documentData = ${safeDocDataJSON};
    var exports = {};
    var module = { exports: exports };

    try {
      // 4. Execute custom code
      ${safeScript}

      // 5. Auto-mount React component if found
      var ComponentToRender = exports.default || module.exports.default || (typeof App !== 'undefined' ? App : null) || (typeof Page !== 'undefined' ? Page : null);
      if (ComponentToRender) {
        var rootEl = document.getElementById('root');
        if (rootEl) {
          var renderProps = {
            data: window.documentData,
            documentData: window.documentData,
            params: Promise.resolve({
              locale: (window.documentData && window.documentData.currentLocale) || 'en',
              slug: window.documentData && window.documentData.slug,
              year: String((window.documentData && (window.documentData.year || window.documentData.activeYear)) || 2026)
            }),
            searchParams: Promise.resolve({
              year: (window.documentData && window.documentData.activeYear) ? String(window.documentData.activeYear) : undefined
            }),
            locale: (window.documentData && window.documentData.currentLocale) || 'en'
          };

          function UniversalWrapper() {
            var [content, setContent] = React.useState(null);
            var [error, setError] = React.useState(null);

            React.useEffect(function() {
              try {
                var result;
                if (typeof ComponentToRender === 'function') {
                  if (ComponentToRender.prototype && ComponentToRender.prototype.isReactComponent) {
                    setContent(React.createElement(ComponentToRender, renderProps));
                    return;
                  }
                  result = ComponentToRender(renderProps);
                } else {
                  result = ComponentToRender;
                }

                if (result && typeof result.then === 'function') {
                  result.then(function(resolved) {
                    setContent(resolved);
                  }).catch(function(err) {
                    setError(err);
                  });
                } else {
                  setContent(result);
                }
              } catch (err) {
                setError(err);
              }
            }, []);

            if (error) {
              return React.createElement('div', {
                style: { background: '#fef2f2', border: '1px solid #f87171', color: '#b91c1c', padding: '16px', margin: '16px', borderRadius: '8px', fontFamily: 'monospace', fontSize: '13px', whiteSpace: 'pre-wrap' }
              }, '[Custom Component Error] ' + (error && error.message ? error.message : String(error)));
            }

            if (content === null) {
              return React.createElement('div', {
                style: { display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '120px', color: '#94a3b8', fontSize: '14px' }
              }, 'Rendering preview...');
            }

            return content;
          }

          if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
            var reactRoot = ReactDOM.createRoot(rootEl);
            reactRoot.render(React.createElement(UniversalWrapper));
          } else if (typeof ReactDOM !== 'undefined' && ReactDOM.render) {
            ReactDOM.render(React.createElement(UniversalWrapper), rootEl);
          }
        }
      }
    } catch(err) {
      console.error("Custom code runtime error:", err);
      var d = document.createElement("div");
      d.style.cssText = "background:#fef2f2;border:1px solid #fca5a5;color:#991b1b;padding:12px;margin:12px;border-radius:6px;font-family:monospace;font-size:12px;white-space:pre-wrap;";
      d.textContent = "[Custom Code Error] " + (err && err.message ? err.message : err);
      document.body.prepend(d);
    }
  </script>
</body>
</html>`;
}
