"""Post-build checks for the GIO work (PLAN_gio.md Phase 6).

    python tools/gio_check.py salesplay|vendrex|sellmo

Fails (exit 1) and prints one line per problem if:
  - a page under docs/ has no `description`, more than one H1, or a heading
    starting with a non-ASCII character (emoji);
  - build/<brand>/ is missing robots.txt, llms.txt, llms-full.txt, sitemap.xml or api_spec.json;
  - a link in llms.txt points to a page that is not in the build;
  - any html/json/txt/xml file in the build mentions another brand.
"""
import glob
import os
import re
import sys

BRANDS = {                      # key: (build folder, names/domains that must NOT appear in the other brands' output)
    'salesplay': ('build/salesplay', ['SalesPlay', 'salesplaypos.com', 'developer.salesplay.com']),
    'vendrex':   ('build/vendrex',   ['Vendrex', 'vendrex.com']),
    'sellmo':    ('build/selmo',     ['Sellmo', 'backofficewebportal.com', 'sellmopos.com']),
}
ORPHANS = {'docs/API-reference/Webhooks.md', 'docs/guides/authentication.md'}   # recorded in PLAN_gio.md §11.2, not checked
MACHINE_FILES = ['robots.txt', 'llms.txt', 'llms-full.txt', 'sitemap.xml', 'api_spec.json']


def check_sources(problems):
    for f in sorted(glob.glob('docs/**/*.md', recursive=True)):
        f = f.replace('\\', '/')
        if f in ORPHANS:
            continue
        text = open(f, encoding='utf-8').read().lstrip('﻿')
        fm = re.match(r'---\r?\n(.*?)\r?\n---', text, re.S)
        if not fm or not re.search(r'^description:\s*\S', fm.group(1), re.M):
            problems.append(f'{f}: no description in front matter')
        body = text[fm.end():] if fm else text
        body = re.sub(r'```.*?```', '', body, flags=re.S)          # ignore code blocks
        h1 = re.findall(r'^# ', body, re.M)
        if len(h1) > 1:
            problems.append(f'{f}: {len(h1)} H1 headings')
        for m in re.finditer(r'^#{1,6} (\S)', body, re.M):
            if ord(m.group(1)) > 127:
                problems.append(f'{f}: heading starts with a non-ASCII character: {m.group(0)!r}')


def check_build(brand, problems):
    out, _ = BRANDS[brand]
    if not os.path.isdir(out):
        problems.append(f'{out}: build folder missing — run the build first')
        return
    for name in MACHINE_FILES:
        if not os.path.isfile(os.path.join(out, name)):
            problems.append(f'{out}/{name}: missing')
    llms = os.path.join(out, 'llms.txt')
    if os.path.isfile(llms):
        for url in re.findall(r'\]\((https?://[^)]+)\)', open(llms, encoding='utf-8').read()):
            path = re.sub(r'^https?://[^/]+', '', url).rstrip('/')
            target = os.path.join(out, path.lstrip('/'))
            if not (os.path.isfile(os.path.join(target, 'index.html')) or os.path.isfile(target)):
                problems.append(f'{out}/llms.txt: link target not in build: {url}')
    foreign = [w for b, (_, words) in BRANDS.items() if b != brand for w in words]
    pattern = re.compile('|'.join(re.escape(w) for w in foreign))
    for root, _, files in os.walk(out):
        for name in files:
            if name.endswith(('.html', '.json', '.txt', '.xml')):
                p = os.path.join(root, name)
                hit = pattern.search(open(p, encoding='utf-8', errors='ignore').read())
                if hit:
                    problems.append(f'{p}: mentions another brand ({hit.group(0)})')


def main():
    brand = (sys.argv[1] if len(sys.argv) > 1 else 'salesplay').lower()
    if brand not in BRANDS:
        sys.exit(f'unknown brand {brand!r}; expected one of {", ".join(BRANDS)}')
    problems = []
    check_sources(problems)
    check_build(brand, problems)
    for p in problems:
        print('FAIL', p)
    print(f'gio_check {brand}: {"OK" if not problems else f"{len(problems)} problem(s)"}')
    sys.exit(1 if problems else 0)


if __name__ == '__main__':
    main()
