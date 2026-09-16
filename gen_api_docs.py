"""Generate the API-reference endpoint pages from api_spec.yaml.

Run: python gen_api_docs.py
Overwrites docs/API-reference/<group>/<slug>.md for every entry in PAGES.
Hand-written pages (index, pagination, rate-limits, date-time-format,
Webhooks.md and the webhooks/ concept pages) are not touched.
"""
import json
import os
import yaml

BASE = 'https://api.salesplaypos.com/v1.0'

# doc id -> (http method, spec path, page title, sidebar position)
PAGES = {
    'webhooks/get-webhook':      ('get',    '/webhooks',    'Get a Single Webhook', 5,
        'retrieve one webhook by ID, or every webhook registered on a SalesPlay account when no ID is given'),
    'webhooks/create-webhook':   ('post',   '/webhooks',    'Create a Single Webhook', 6,
        'register a webhook URL on a SalesPlay account so it receives real-time event notifications'),
    'webhooks/delete-webhook':   ('delete', '/webhooks',    'Delete a Single Webhook', 7,
        'remove a webhook subscription from a SalesPlay account by its ID'),

    'categories/get-categories':      ('get',    '/category', 'Get Categories', 1,
        'list the product categories in a SalesPlay account, filtered by ID or date, paginated with a cursor'),
    'categories/create-category':     ('post',   '/category', 'Create or Update Category', 2,
        'create a product category in SalesPlay, or update it when the category code already exists'),
    'categories/delete-category':     ('delete', '/category', 'Delete Category', 3,
        'delete a product category from a SalesPlay account by its ID'),

    'sub-categories/get-sub-categories':   ('get',    '/sub_category', 'Get Sub Categories', 1,
        'list the sub categories in a SalesPlay account, filtered by ID or date, paginated with a cursor'),
    'sub-categories/create-sub-category':  ('post',   '/sub_category', 'Create or Update Sub Category', 2,
        'create a sub category under a category in SalesPlay, or update it when the code already exists'),
    'sub-categories/delete-sub-category':  ('delete', '/sub_category', 'Delete Sub Category', 3,
        'delete a sub category from a SalesPlay account by its ID'),

    'measurements/get-measurements':    ('get',    '/measurements', 'Get Measurements', 1,
        'list the units of measurement (kg, pcs, litre) in a SalesPlay account, paginated with a cursor'),
    'measurements/create-measurement':  ('post',   '/measurements', 'Create or Update Measurement', 2,
        'create a unit of measurement in SalesPlay, or update it when the code already exists'),
    'measurements/delete-measurement':  ('delete', '/measurements', 'Delete Measurement', 3,
        'delete a unit of measurement from a SalesPlay account by its ID'),

    'taxes/get-taxes':   ('get',    '/taxes', 'Get Taxes', 1,
        'list the tax rates in a SalesPlay account, filtered by ID or date, paginated with a cursor'),
    'taxes/create-tax':  ('post',   '/taxes', 'Create or Update Tax', 2,
        'create a tax rate in SalesPlay, or update it when the tax code already exists'),
    'taxes/delete-tax':  ('delete', '/taxes', 'Delete Tax', 3,
        'delete a tax rate from a SalesPlay account by its ID'),

    'customers/get-customers':   ('get',    '/customers', 'Get Customers', 1,
        'list the customers in a SalesPlay account, filtered by ID or date, paginated with a cursor'),
    'customers/create-customer': ('post',   '/customers', 'Create or Update Customer', 2,
        'create a customer profile in SalesPlay, or update it when the customer code already exists'),
    'customers/delete-customer': ('delete', '/customers', 'Delete Customer', 3,
        'delete a customer profile from a SalesPlay account by its ID'),

    'employee/get-employees': ('get', '/employee', 'Get Employees', 1,
        'list the employees registered in a SalesPlay account (read-only), paginated with a cursor'),

    'suppliers/get-suppliers':   ('get',    '/suppliers', 'Get Suppliers', 1,
        'list the suppliers in a SalesPlay account, filtered by ID or date, paginated with a cursor'),
    'suppliers/create-supplier': ('post',   '/suppliers', 'Create or Update Supplier', 2,
        'create a supplier in SalesPlay, or update it when the supplier code already exists'),
    'suppliers/delete-supplier': ('delete', '/suppliers', 'Delete Supplier', 3,
        'delete a supplier from a SalesPlay account by its ID'),

    'products/get-products':   ('get',  '/products', 'Get Products', 1,
        'list the products in a SalesPlay account, filtered by ID or created/updated date, paginated with a cursor'),
    'products/create-product': ('post', '/products', 'Create or Update Product', 2,
        'create a product in SalesPlay with its category, price, tax and stock settings, or update it when the product code already exists'),

    'product-image/upload-image': ('post',   '/product_image', 'Upload Product Image', 1,
        'upload or replace the image of a SalesPlay product, identified by product code, as a multipart upload'),
    'product-image/delete-image': ('delete', '/product_image', 'Delete Product Image', 2,
        'remove the image from a SalesPlay product, identified by product code'),

    'receipts/get-receipts':       ('get',  '/receipts',               'Get Receipts', 1,
        'list the sales receipts (invoices) of a SalesPlay shop for a date range, paginated with a cursor'),
    'receipts/get-void-receipts':  ('get',  '/void_receipts',          'Get Void Receipts', 2,
        'list the voided receipts of a SalesPlay shop for a date range, paginated with a cursor'),
    'receipts/get-credit-notes':   ('get',  '/credit_note_and_refund', 'Get Credit Notes', 3,
        'list the credit notes and cash refunds of a SalesPlay shop for a date range, paginated with a cursor'),
    'receipts/create-credit-note': ('post', '/credit_note_and_refund', 'Create Credit Note', 4,
        'issue a credit note or cash refund against an existing SalesPlay receipt, line by line'),

    'orders/get-orders': ('get', '/orders', 'Get Orders', 1,
        'list the orders placed through the SalesPlay POS in a shop for a date range (read-only), paginated with a cursor'),
    'shops/get-shops':   ('get', '/shops',  'Get Shops', 1,
        'list the shops (locations) and their POS terminals under a SalesPlay account (read-only)'),

    'payment-types/get-payment-types':   ('get',    '/payment_types', 'Get Payment Types', 1,
        'list the payment methods (cash, card, custom) accepted in a SalesPlay account, paginated with a cursor'),
    'payment-types/create-payment-type': ('post',   '/payment_types', 'Create or Update Payment Type', 2,
        'create a custom payment method in SalesPlay, or update it when the payment type code already exists'),
    'payment-types/delete-payment-type': ('delete', '/payment_types', 'Delete Payment Type', 3,
        'delete a custom payment method from a SalesPlay account by its ID (default types cannot be deleted)'),

    'order-types/get-order-types':   ('get',    '/order_types', 'Get Order Types', 1,
        'list the order types (dine-in, takeaway, delivery) in a SalesPlay account, paginated with a cursor'),
    'order-types/create-order-type': ('post',   '/order_types', 'Create or Update Order Type', 2,
        'create an order type in SalesPlay, or update it when the order type already exists'),
    'order-types/delete-order-type': ('delete', '/order_types', 'Delete Order Type', 3,
        'delete an order type from a SalesPlay account by its ID'),

    'modifiers/get-modifiers':    ('get',    '/modifiers', 'Get Modifiers', 1,
        'list the product modifiers (add-ons and options) in a SalesPlay account, paginated with a cursor'),
    'modifiers/delete-modifier':  ('delete', '/modifiers', 'Delete Modifier', 2,
        'delete a modifier group from a SalesPlay account by its ID'),

    'inventory/get-inventory':    ('get',  '/inventory', 'Get Inventory Levels', 1,
        'get the current stock level of products per shop in a SalesPlay account, paginated with a cursor'),
    'inventory/update-inventory': ('post', '/inventory', 'Update Inventory Levels', 2,
        'set the stock level of one or more products in a SalesPlay shop'),

    'grn/get-grn':    ('get',  '/grn', 'Get Goods Received Notes', 1,
        'list the Goods Received Notes (incoming stock) of a SalesPlay shop, filtered by number, status or date'),
    'grn/create-grn': ('post', '/grn', 'Create Goods Received Note', 2,
        'record a Goods Received Note in SalesPlay for stock delivered by a supplier, with its line items'),

    'purchase-orders/get-purchase-orders': ('get', '/purchase_orders', 'Get Purchase Orders', 1,
        'list the purchase orders raised to suppliers from a SalesPlay shop (read-only), paginated with a cursor'),

    'online-orders/place-online-order':      ('post', '/online_orders',       'Place Online Order', 1,
        'place an order from an external channel (website, delivery app) into the SalesPlay POS of a shop'),
    'online-orders/get-online-order-status': ('get',  '/online_order_status', 'Get Online Order Status', 2,
        'check the current status of online orders placed into SalesPlay, by their system unique ID'),
    'online-orders/cancel-online-order':     ('post', '/cancel_online_order', 'Cancel Online Order', 3,
        'cancel an online order placed into SalesPlay, by its system unique ID'),

    'shifts/get-shifts':              ('get', '/shifts',             'Get Shifts', 1,
        'list the cashier shifts of SalesPlay POS terminals for a date range (read-only), paginated with a cursor'),
    'shifts/get-drawer-transactions': ('get', '/drawer_transaction', 'Get Pay-Ins and Pay-Outs', 2,
        'list the cash drawer pay-ins and pay-outs recorded on SalesPlay POS terminals during shifts (read-only)'),

    'timecards/get-timecards': ('get', '/timecards', 'Get Timecards', 1,
        'list employee clock-in and clock-out records from SalesPlay for a date range (read-only)'),

    'pos-devices/get-pos-devices': ('get', '/pos_devices', 'Get POS Devices', 1,
        'list the POS terminals registered under a SalesPlay account, with their shop and POS key (read-only)'),

    'merchant/get-merchant': ('get', '/merchant', 'Get Merchant Information', 1,
        'retrieve the SalesPlay merchant account details (name, contact, currency) for the current token (read-only)'),
}


def type_label(schema):
    t = schema.get('type', 'string')
    fmt = schema.get('format')
    if t == 'array':
        return 'array[%s]' % type_label(schema.get('items') or {})
    label = '%s (%s)' % (t, fmt) if fmt else t
    if schema.get('enum'):
        label += '<br/>enum: ' + ' \\| '.join('`%s`' % e for e in schema['enum'])
    return label


def esc(text):
    """Make free text safe inside an MDX table cell."""
    return (str(text or '').replace('\n', ' ').strip()
            .replace('|', '\\|').replace('<', '&lt;').replace('>', '&gt;')
            .replace('{', '&#123;').replace('}', '&#125;'))


def describe(prop):
    """Description + Default / Example / Min / Max hints, PayPal style."""
    out = esc(prop.get('description'))
    extra = [(k.capitalize(), prop[k]) for k in ('default', 'example', 'minimum', 'maximum')
             if k in prop and not isinstance(prop[k], (dict, list))]
    if extra:
        out += ' ' + ' · '.join('%s: `%s`' % (k, json.dumps(v) if isinstance(v, bool) else esc(v))
                                for k, v in extra)
    return out.strip()


def sample(schema):
    """Build a representative value for a schema node."""
    if 'example' in schema:
        return schema['example']
    if 'default' in schema:
        return schema['default']
    if schema.get('enum'):
        return schema['enum'][0]
    t = schema.get('type', 'string')
    if t == 'object':
        return {k: sample(v) for k, v in (schema.get('properties') or {}).items()}
    if t == 'array':
        return [sample(schema.get('items') or {})]
    if t == 'integer':
        return 0
    if t == 'number':
        return 0.0
    if t == 'boolean':
        return True
    fmt = schema.get('format')
    if fmt == 'date-time':
        return '2025-01-15 10:30:00'
    if fmt == 'binary':
        return '<binary file>'
    return 'string'


def name_cell(name, required):
    return '`%s`' % name + (' <span className="api-required">required</span>' if required else '')


def table(header, rows):
    if not rows:
        return ''
    out = ['| %s |' % ' | '.join(header),
           '|%s|' % '|'.join('---' for _ in header)]
    out += ['| %s |' % ' | '.join(c for c in r) for r in rows]
    return '\n'.join(out)


def fields(schema, prefix=''):
    """Field table for one object level; nested objects go into <details> blocks
    (PayPal's "show child attributes")."""
    if schema.get('type') == 'array':
        return fields(schema.get('items') or {}, prefix + '[]')
    required = schema.get('required') or ()
    rows, nested = [], []
    for name, prop in (schema.get('properties') or {}).items():
        rows.append((name_cell(name, name in required), type_label(prop), describe(prop)))
        child = prop if prop.get('type') == 'object' else \
            prop.get('items') if prop.get('type') == 'array' else None
        if child and child.get('properties'):
            path = prefix + name + ('[]' if prop.get('type') == 'array' else '')
            nested.append((path, child))
    out = [table(['Name', 'Type', 'Description'], rows)]
    for path, child in nested:
        out += ['', '<details>',
                '<summary><code>%s</code> — child attributes</summary>' % path, '',
                fields(child, path + '.'), '', '</details>']
    return '\n'.join(out)


def code_tabs(method, path, params, body):
    """Six-language request examples, matching the style of Webhooks.md."""
    m = method.upper()
    query = '&'.join('%s=%s' % (p['name'], sample(p.get('schema') or {}))
                     for p in params if p.get('in') == 'query' and p.get('required'))
    url = BASE + path + ('?' + query if query else '')
    body_json = json.dumps(body, indent=2) if body else None
    py_body = json.dumps(body, indent=4) if body else None

    curl = ['curl -X %s "%s" \\' % (m, url),
            '  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"']
    if body_json:
        curl[-1] += ' \\'
        curl += ['  -H "Content-Type: application/json" \\',
                 "  -d '%s'" % body_json]

    if body_json and m in ('GET', 'DELETE'):
        # fetch() rejects a body on GET, so show Node's https.request instead
        js = ['import https from "node:https";', '',
              'const payload = JSON.stringify(%s);' % body_json, '',
              'const req = https.request("%s", {' % url,
              '  method: "%s",' % m,
              '  headers: {',
              '    "Authorization": "Bearer YOUR_ACCESS_TOKEN",',
              '    "Content-Type": "application/json",',
              '    "Content-Length": Buffer.byteLength(payload),',
              '  },',
              '}, (res) => {',
              '  let data = "";',
              '  res.on("data", (chunk) => (data += chunk));',
              '  res.on("end", () => console.log(JSON.parse(data)));',
              '});',
              'req.write(payload);',
              'req.end();']
        js_done = True
    else:
        js_done = False
    js = js if js_done else ['const res = await fetch("%s", {' % url,
          '  method: "%s",' % m,
          '  headers: {',
          '    "Authorization": "Bearer YOUR_ACCESS_TOKEN",']
    if body_json and not js_done:
        js += ['    "Content-Type": "application/json",']
    if not js_done:
        js += ['  },']
    if body_json and not js_done:
        js += ['  body: JSON.stringify(%s),' % body_json]
    if not js_done:
        js += ['});', 'const data = await res.json();']

    py = ['import requests', '',
          'url = "%s"' % url,
          'headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}']
    if py_body:
        py += ['payload = %s' % py_body,
               'res = requests.%s(url, json=payload, headers=headers)' % method]
    else:
        py += ['res = requests.%s(url, headers=headers)' % method]
    py += ['print(res.json())']

    php = ['<?php', '$ch = curl_init("%s");' % url,
           'curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "%s");' % m,
           'curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);']
    if body_json:
        php += ['curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(%s));' % json.dumps(body),
                'curl_setopt($ch, CURLOPT_HTTPHEADER, [',
                '    "Authorization: Bearer YOUR_ACCESS_TOKEN",',
                '    "Content-Type: application/json",',
                ']);']
    else:
        php += ['curl_setopt($ch, CURLOPT_HTTPHEADER, '
                '["Authorization: Bearer YOUR_ACCESS_TOKEN"]);']
    php += ['$response = curl_exec($ch);', 'curl_close($ch);', 'echo $response;']

    java = ['HttpRequest request = HttpRequest.newBuilder()',
            '    .uri(URI.create("%s"))' % url,
            '    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")']
    if body_json:
        java += ['    .header("Content-Type", "application/json")',
                 '    .method("%s", HttpRequest.BodyPublishers.ofString(payload))' % m]
    else:
        java += ['    .method("%s", HttpRequest.BodyPublishers.noBody())' % m]
    java += ['    .build();', '',
             'HttpResponse<String> response = client.send(request,',
             '    HttpResponse.BodyHandlers.ofString());']

    cs = ['var request = new HttpRequestMessage(new HttpMethod("%s"), "%s");' % (m, url),
          'request.Headers.Add("Authorization", "Bearer YOUR_ACCESS_TOKEN");']
    if body_json:
        cs += ['request.Content = new StringContent(payload, Encoding.UTF8, "application/json");']
    cs += ['var response = await client.SendAsync(request);',
           'var body = await response.Content.ReadAsStringAsync();']

    langs = [('curl', 'cURL', 'bash', curl), ('js', 'JavaScript', 'javascript', js),
             ('python', 'Python', 'python', py), ('php', 'PHP', 'php', php),
             ('java', 'Java', 'java', java), ('csharp', 'C#', 'csharp', cs)]

    parts = ['<Tabs>']
    for i, (val, label, lang, lines) in enumerate(langs):
        default = ' default' if i == 0 else ''
        parts += ['  <TabItem value="%s" label="%s"%s>' % (val, label, default), '',
                  '```%s' % lang, '\n'.join(lines), '```', '',
                  '  </TabItem>', '']
    parts.append('</Tabs>')
    return '\n'.join(parts)



def _err(code_enum, details_desc, example, field=False):
    props = {'code': {'type': 'string', 'enum': code_enum, 'description': 'Error code'},
             'details': {'type': 'string', 'description': details_desc}}
    if field:
        props['field'] = {'type': 'string', 'description': 'The field that failed validation (when applicable)'}
    return {'type': 'object', 'properties': {'errors': {'type': 'object', 'properties': props}}, 'example': example}


# Responses every operation can return. Added to a page only when the spec does
# not already define that status code for the operation. Examples are real
# captures from the live API (2026-09-14) unless noted.
COMMON_RESPONSES = {
    '400': {
        'description': 'Validation error — a required field is missing or a value is not accepted',
        'note': 'Some endpoints return validation errors with status `401` instead of `400`; check `errors.code`, not just the status.',
        'schema': _err(['INVALID_VALUE', 'INVALID_FORMAT', 'INVALID_CURSOR', 'BAD_REQUEST'],
                       'Human-readable reason',
                       {'errors': {'code': 'INVALID_VALUE',
                                   'details': 'The value must be a string (Supplier id can not be empty)',
                                   'field': 'supplier_id'}}, field=True),
    },
    '401': {
        'description': 'Unauthorized — the access token is missing, invalid or expired',
        'note': None,
        'schema': _err(['UNAUTHORIZED', 'ACCESS_DENIED'], 'Human-readable reason',
                       {'errors': {'code': 'UNAUTHORIZED', 'details': 'Access token is not valid.'}}),
    },
    '429': {
        'description': 'Rate limited — too many requests from this account',
        'note': 'Pause and retry with backoff. See [Rate Limits](../rate-limits). (Not reproduced in testing; shape from the API definition.)',
        'schema': _err(['RATE_LIMITED'], 'Rate limit error message',
                       {'errors': {'code': 'RATE_LIMITED', 'details': 'Request quota exceeded'}}),
    },
}

GENERIC = ('This API will allow', 'This API allows', 'This API will delete', 'This API deletes', 'This API returns')


def intro_paragraph(m, path, purpose, body_schema, body_ct):
    """One paragraph that stands alone: method, path, purpose, where parameters go,
    auth and base URL — so a reader (or an AI assistant) who sees only this chunk
    has every fact needed to call the endpoint. See PLAN_gio.md §4 Phase 2b."""
    parts = ['**%s %s** \u2014 %s.' % (m, path, purpose)]
    names = list(((body_schema or {}).get('properties') or {}).keys())
    if names:
        shown = ', '.join('`%s`' % n for n in names[:8]) + (', \u2026' if len(names) > 8 else '')
        how = 'Send a multipart form' if body_ct and 'multipart' in body_ct else 'Send parameters as a JSON request body'
        parts.append('%s (%s).' % (how, shown))
    parts.append('Requires a Bearer token in the `Authorization` header. Base URL: `%s`.' % BASE)
    return ' '.join(parts)


def spec_note(op):
    """Keep the spec's own description only when it says something the intro does not."""
    text = (op.get('description') or '').strip()
    return '' if text.startswith(GENERIC) else text


def render(method, path, title, position, purpose, op):
    params = op.get('parameters') or []
    body_schema, body_ct = None, None
    rb = op.get('requestBody') or {}
    for ct, media in (rb.get('content') or {}).items():
        body_schema, body_ct = media.get('schema') or {}, ct
        break
    body = sample(body_schema) if body_schema else None
    m = method.upper()

    md = ['---',
          'title: %s' % title,
          'sidebar_label: %s' % title,
          'sidebar_position: %d' % position,
          'description: "%s %s \u2014 %s."' % (m, path, purpose),
          '---', '',
          "import Tabs from '@theme/Tabs';",
          "import TabItem from '@theme/TabItem';", '',
          '# %s' % title, '',
          intro_paragraph(m, path, purpose, body_schema, body_ct), '',
          spec_note(op), '',
          '<div className="api-endpoint">'
          '<span className="api-badge api-badge--%s">%s</span>' % (method, m) +
          '<code>%s%s</code></div>' % (BASE, path), '',
          '## Authorization', '',
          'Bearer token in the `Authorization` header — see '
          '[Personal Access Tokens](../../guides/personal-access-tokens) or '
          '[OAuth 2.0](../../guides/oauth).', '']

    for loc, heading in (('path', 'Path parameters'), ('query', 'Query parameters'),
                         ('header', 'Header parameters')):
        rows = [(name_cell(p['name'], p.get('required')), type_label(p.get('schema') or {}),
                 describe(dict(p.get('schema') or {}, description=p.get('description'))))
                for p in params if p.get('in') == loc]
        if rows:
            md += ['## %s' % heading, '', table(['Name', 'Type', 'Description'], rows), '']

    if body_schema:
        md += ['## Request body', '', 'Content type: `%s`' % body_ct, '']
        if m in ('GET', 'DELETE') and body_ct == 'application/json':
            md += [':::info Send filters as a JSON body',
                   'This endpoint reads its parameters from the JSON request body — even on `%s`. '
                   'Query-string parameters are ignored.' % m,
                   ':::', '']
        md += [fields(body_schema), '']

    md += ['## Example request', '',
           code_tabs(method, path, params, body if body_ct == 'application/json' else None), '']

    responses = dict(op.get('responses') or {})
    for code, c in COMMON_RESPONSES.items():
        if code not in responses:
            responses[code] = {'description': c['description'], 'note': c['note'],
                               'content': {'application/json': {'schema': c['schema']}}}
        else:  # spec defines it but usually without an example: reuse the real one
            for media in (responses[code].get('content') or {}).values():
                sch = media.get('schema') or {}
                if 'example' not in sch and 'errors' in (sch.get('properties') or {}):
                    media['schema'] = dict(sch, example=c['schema']['example'])
            responses[code] = dict(responses[code], note=responses[code].get('note') or c['note'])
    if responses:
        md += ['## Responses', '', '<Tabs>']
        for i, code in enumerate(sorted(responses)):
            resp = responses[code]
            md += ['  <TabItem value="%s" label="%s"%s>' % (code, code, ' default' if i == 0 else ''), '',
                   '**%s** — %s' % (code, esc(resp.get('description')) or 'No description.'), '']
            if resp.get('note'):
                md += [resp['note'], '']
            if code[0] in '45':
                md += ['See [Troubleshooting & Errors](../../guides/errors-guide) for how to handle this response.', '']
            schema = None
            for media in (resp.get('content') or {}).values():
                schema = media.get('schema') or {}
                break
            if schema:
                md += ['```json', json.dumps(sample(schema), indent=2), '```', '']
                body_fields = fields(schema)
                if body_fields.strip():
                    md += ['**Response fields**', '', body_fields, '']
            md += ['  </TabItem>', '']
        md += ['</Tabs>', '']

    return '\n'.join(md).rstrip() + '\n'


def main():
    spec = yaml.safe_load(open('api_spec.yaml', encoding='utf-8', errors='replace'))
    written = 0
    for doc_id, (method, path, title, position, purpose) in PAGES.items():
        op = (spec['paths'].get(path) or {}).get(method)
        if not isinstance(op, dict):
            print('SKIP (not in spec): %s %s -> %s' % (method.upper(), path, doc_id))
            continue
        out = os.path.join('docs', 'API-reference', *doc_id.split('/')) + '.md'
        os.makedirs(os.path.dirname(out), exist_ok=True)
        with open(out, 'w', encoding='utf-8', newline='\n') as fh:
            fh.write(render(method, path, title, position, purpose, op))
        written += 1
    print('Wrote %d pages.' % written)


if __name__ == '__main__':
    main()
