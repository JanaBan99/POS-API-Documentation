"""Write static/api_spec.json for the current brand.

Brand facts come from the environment (docusaurus.config.js loads .env.<TENANT>
before calling this script). When run by hand, the same file is read here.
"""
import json
import os
from urllib.parse import urlsplit

import yaml


def load_profile():
    tenant = os.environ.get('TENANT', 'salesplay').strip().lower()
    if 'TENANT_NAME' not in os.environ:  # run standalone → read the brand file ourselves
        with open(f'.env.{tenant}', encoding='utf-8') as f:
            for line in f:
                key, sep, value = line.strip().partition('=')
                if sep and not key.startswith('#'):
                    os.environ.setdefault(key, value)
    return {k: os.environ[k].strip() for k in ('TENANT_NAME', 'TENANT_HOST', 'TENANT_API_BASE_URL',
                                               'TENANT_BACKOFFICE_URL', 'TENANT_DEVELOPER_URL')}


def main():
    p = load_profile()
    api_origin = '{0.scheme}://{0.netloc}'.format(urlsplit(p['TENANT_API_BASE_URL']))

    # Same rules, same order, as replaceText() in tenant.js: whole URLs first, names last.
    replacements = [
        ('https://api.salesplaypos.com/v1.0', p['TENANT_API_BASE_URL']),
        ('https://api.salesplaypos.com', api_origin),
        ('https://cloud.salesplaypos.com/', p['TENANT_BACKOFFICE_URL']),
        ('https://cloud.salesplaypos.com', p['TENANT_BACKOFFICE_URL']),
        ('https://developer.salesplay.com', p['TENANT_DEVELOPER_URL']),
        ('SalesPlay', p['TENANT_NAME']),
        ('SALESPLAY', p['TENANT_NAME'].upper()),
        ('salesplaypos.com', p['TENANT_HOST']),
        ('salesplay', p['TENANT_NAME'].lower()),
    ]

    with open('api_spec.yaml', encoding='utf-8', errors='replace') as f:
        content = f.read()
    for search, replace in replacements:
        content = content.replace(search, replace)

    spec = yaml.safe_load(content)
    os.makedirs('static', exist_ok=True)
    with open(os.path.join('static', 'api_spec.json'), 'w', encoding='utf-8') as f:
        json.dump(spec, f, indent=2)
    print(f"Wrote static/api_spec.json for {p['TENANT_NAME']} ({p['TENANT_API_BASE_URL']})")


if __name__ == '__main__':
    main()
