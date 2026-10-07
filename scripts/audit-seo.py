"""Audit public HTML SEO signals using only Python's standard library.
Usage: python3 scripts/audit-seo.py https://www.jcibangkok.org
"""
import json
import sys
import urllib.request
import urllib.error
from html.parser import HTMLParser
from concurrent.futures import ThreadPoolExecutor


class Signals(HTMLParser):
    def __init__(self):
        super().__init__()
        self.title = ''
        self.in_title = False
        self.h1 = 0
        self.lang = None
        self.meta = {}
        self.canonical = None
        self.alternates = {}
        self.schemas = []
        self.schema = None
        self.images = 0
        self.missing_alt = 0
        self.links = 0

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        if tag == 'html': self.lang = a.get('lang')
        if tag == 'title': self.in_title = True
        if tag == 'h1': self.h1 += 1
        if tag == 'meta': self.meta[a.get('name', a.get('property', ''))] = a.get('content')
        if tag == 'link' and a.get('rel') == 'canonical': self.canonical = a.get('href')
        if tag == 'link' and a.get('hreflang'): self.alternates[a['hreflang']] = a.get('href')
        if tag == 'script' and a.get('type') == 'application/ld+json': self.schema = ''
        if tag == 'img':
            self.images += 1
            if 'alt' not in a: self.missing_alt += 1
        if tag == 'a' and a.get('href'): self.links += 1

    def handle_data(self, data):
        if self.in_title: self.title += data
        if self.schema is not None: self.schema += data

    def handle_endtag(self, tag):
        if tag == 'title': self.in_title = False
        if tag == 'script' and self.schema is not None:
            try: self.schemas.append(json.loads(self.schema))
            except ValueError: self.schemas.append({'error': 'Invalid JSON-LD'})
            self.schema = None


def audit(path):
    url = base + path
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'JCI-SEO-Audit/1.0'})
        with urllib.request.urlopen(req, timeout=45) as response:
            html = response.read().decode('utf-8', errors='replace')
            parser = Signals()
            if response.headers.get('content-type', '').startswith('text/html'): parser.feed(html)
            return {'path': path, 'status': response.status, 'final_url': response.url,
                    'content_type': response.headers.get('content-type'), 'title': parser.title,
                    'description': parser.meta.get('description'), 'canonical': parser.canonical,
                    'hreflang': parser.alternates, 'lang': parser.lang, 'h1_count': parser.h1,
                    'og_image': parser.meta.get('og:image'), 'robots': parser.meta.get('robots'),
                    'schemas': parser.schemas, 'images': parser.images, 'missing_alt': parser.missing_alt,
                    'links': parser.links, 'html_bytes': len(html.encode())}
    except urllib.error.HTTPError as error: return {'path': path, 'status': error.code}
    except Exception as error: return {'path': path, 'error': str(error)}


base = sys.argv[1].rstrip('/') if len(sys.argv) > 1 else 'https://www.jcibangkok.org'
paths = [f'/{locale}{path}' for locale in ['en', 'th'] for path in ['', '/about', '/events', '/members', '/membership', '/contact', '/photobomb']]
paths += ['/robots.txt', '/sitemap.xml', '/zz/about', '/en/events/nonexistent-seo-audit']
with ThreadPoolExecutor(max_workers=4) as executor:
    print(json.dumps(list(executor.map(audit, paths)), ensure_ascii=False, indent=2))
