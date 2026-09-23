/**
 * Generate the API-reference endpoint pages from api_spec.yaml.
 *
 * Run: node gen_api_docs.mjs
 * Overwrites docs/API-reference/<group>/<slug>.md for every entry in PAGES.
 * Hand-written pages (index, pagination, rate-limits, date-time-format,
 * Webhooks.md and the webhooks/ concept pages) are not touched.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
import path from 'path';
import yaml from 'js-yaml';

const BASE = 'https://api.salesplaypos.com/v1.0';

// ---------------------------------------------------------------------------
// Python parity helpers.
//
// The spec's numbers matter: YAML `1.0` must render as `1.0`, not `1`. JS has a
// single number type, so a float-tagged scalar is kept in this Number subclass
// and printed Python-style. Everything else here mirrors what json.dumps and
// Python truthiness did, so the generated pages stay byte-identical.
// ---------------------------------------------------------------------------
class Flt extends Number {
  toString() {
    const v = this.valueOf();
    return Number.isInteger(v) ? `${v}.0` : String(v);
  }
}

const floatType = yaml.DEFAULT_SCHEMA.implicit.find((t) => t.tag === 'tag:yaml.org,2002:float');
const SCHEMA = yaml.DEFAULT_SCHEMA.extend({
  implicit: [new yaml.Type('tag:yaml.org,2002:float', {
    kind: 'scalar',
    resolve: floatType.resolve,
    construct: (d) => new Flt(floatType.construct(d)),
    predicate: (o) => o instanceof Flt,
    represent: (o) => String(o),
  })],
});

const isNum = (v) => typeof v === 'number' || v instanceof Number;
const isPlainObject = (v) => v !== null && typeof v === 'object' && !Array.isArray(v) && !isNum(v);

/** Python's notion of truthiness: 0, 0.0, '', [], {}, None are all false. */
function truthy(v) {
  if (v === null || v === undefined || v === false) return false;
  if (v === true) return true;
  if (isNum(v)) return v.valueOf() !== 0;
  if (typeof v === 'string') return v !== '';
  if (Array.isArray(v)) return v.length > 0;
  if (typeof v === 'object') return Object.keys(v).length > 0;
  return true;
}

/** json.dumps' ensure_ascii=True: every non-ASCII character as \\uXXXX. */
const jstr = (s) => JSON.stringify(s)
  .replace(/[^\x00-\x7f]/g, (c) => `\\u${c.charCodeAt(0).toString(16).padStart(4, '0')}`);

/** json.dumps(value, indent=n). indent=null gives Python's compact ', '/': ' form. */
function pyJson(v, indent = null, level = 0) {
  if (v === null || v === undefined) return 'null';
  if (typeof v === 'boolean') return v ? 'true' : 'false';
  if (isNum(v)) return String(v instanceof Flt ? v : v.valueOf());
  if (typeof v === 'string') return jstr(v);
  const nl = indent === null ? '' : '\n';
  const pad = indent === null ? '' : ' '.repeat(indent * (level + 1));
  const end = indent === null ? '' : ' '.repeat(indent * level);
  const sep = indent === null ? ', ' : `,${nl}${pad}`;
  if (Array.isArray(v)) {
    if (!v.length) return '[]';
    return `[${nl}${pad}${v.map((x) => pyJson(x, indent, level + 1)).join(sep)}${nl}${end}]`;
  }
  const keys = Object.keys(v);
  if (!keys.length) return '{}';
  const body = keys.map((k) => `${jstr(String(k))}: ${pyJson(v[k], indent, level + 1)}`).join(sep);
  return `{${nl}${pad}${body}${nl}${end}}`;
}

// ---------------------------------------------------------------------------
// doc id -> [http method, spec path, page title, sidebar position, purpose]
// ---------------------------------------------------------------------------
const PAGES = {
  "webhooks/get-webhook": ["get", "/webhooks", "Get a Single Webhook", 5,
    "retrieve one webhook by ID, or every webhook registered on a SalesPlay account when no ID is given"],
  "webhooks/create-webhook": ["post", "/webhooks", "Create a Single Webhook", 6,
    "register a webhook URL on a SalesPlay account so it receives real-time event notifications"],
  "webhooks/delete-webhook": ["delete", "/webhooks", "Delete a Single Webhook", 7,
    "remove a webhook subscription from a SalesPlay account by its ID"],

  "categories/get-categories": ["get", "/category", "Get Categories", 1,
    "list the product categories in a SalesPlay account, filtered by ID or date, paginated with a cursor"],
  "categories/create-category": ["post", "/category", "Create or Update Category", 2,
    "create a product category in SalesPlay, or update it when the category code already exists"],
  "categories/delete-category": ["delete", "/category", "Delete Category", 3,
    "delete a product category from a SalesPlay account by its ID"],

  "sub-categories/get-sub-categories": ["get", "/sub_category", "Get Sub Categories", 1,
    "list the sub categories in a SalesPlay account, filtered by ID or date, paginated with a cursor"],
  "sub-categories/create-sub-category": ["post", "/sub_category", "Create or Update Sub Category", 2,
    "create a sub category under a category in SalesPlay, or update it when the code already exists"],
  "sub-categories/delete-sub-category": ["delete", "/sub_category", "Delete Sub Category", 3,
    "delete a sub category from a SalesPlay account by its ID"],

  "measurements/get-measurements": ["get", "/measurements", "Get Measurements", 1,
    "list the units of measurement (kg, pcs, litre) in a SalesPlay account, paginated with a cursor"],
  "measurements/create-measurement": ["post", "/measurements", "Create or Update Measurement", 2,
    "create a unit of measurement in SalesPlay, or update it when the code already exists"],
  "measurements/delete-measurement": ["delete", "/measurements", "Delete Measurement", 3,
    "delete a unit of measurement from a SalesPlay account by its ID"],

  "taxes/get-taxes": ["get", "/taxes", "Get Taxes", 1,
    "list the tax rates in a SalesPlay account, filtered by ID or date, paginated with a cursor"],
  "taxes/create-tax": ["post", "/taxes", "Create or Update Tax", 2,
    "create a tax rate in SalesPlay, or update it when the tax code already exists"],
  "taxes/delete-tax": ["delete", "/taxes", "Delete Tax", 3,
    "delete a tax rate from a SalesPlay account by its ID"],

  "customers/get-customers": ["get", "/customers", "Get Customers", 1,
    "list the customers in a SalesPlay account, filtered by ID or date, paginated with a cursor"],
  "customers/create-customer": ["post", "/customers", "Create or Update Customer", 2,
    "create a customer profile in SalesPlay, or update it when the customer code already exists"],
  "customers/delete-customer": ["delete", "/customers", "Delete Customer", 3,
    "delete a customer profile from a SalesPlay account by its ID"],

  "employee/get-employees": ["get", "/employee", "Get Employees", 1,
    "list the employees registered in a SalesPlay account (read-only), paginated with a cursor"],

  "suppliers/get-suppliers": ["get", "/suppliers", "Get Suppliers", 1,
    "list the suppliers in a SalesPlay account, filtered by ID or date, paginated with a cursor"],
  "suppliers/create-supplier": ["post", "/suppliers", "Create or Update Supplier", 2,
    "create a supplier in SalesPlay, or update it when the supplier code already exists"],
  "suppliers/delete-supplier": ["delete", "/suppliers", "Delete Supplier", 3,
    "delete a supplier from a SalesPlay account by its ID"],

  "products/get-products": ["get", "/products", "Get Products", 1,
    "list the products in a SalesPlay account, filtered by ID or created/updated date, paginated with a cursor"],
  "products/create-product": ["post", "/products", "Create or Update Product", 2,
    "create a product in SalesPlay with its category, price, tax and stock settings, or update it when the product code already exists"],

  "product-image/upload-image": ["post", "/product_image", "Upload Product Image", 1,
    "upload or replace the image of a SalesPlay product, identified by product code, as a multipart upload"],
  "product-image/delete-image": ["delete", "/product_image", "Delete Product Image", 2,
    "remove the image from a SalesPlay product, identified by product code"],

  "receipts/get-receipts": ["get", "/receipts", "Get Receipts", 1,
    "list the sales receipts (invoices) of a SalesPlay shop for a date range, paginated with a cursor"],
  "receipts/get-void-receipts": ["get", "/void_receipts", "Get Void Receipts", 2,
    "list the voided receipts of a SalesPlay shop for a date range, paginated with a cursor"],
  "receipts/get-credit-notes": ["get", "/credit_note_and_refund", "Get Credit Notes", 3,
    "list the credit notes and cash refunds of a SalesPlay shop for a date range, paginated with a cursor"],
  "receipts/create-credit-note": ["post", "/credit_note_and_refund", "Create Credit Note", 4,
    "issue a credit note or cash refund against an existing SalesPlay receipt, line by line"],

  "orders/get-orders": ["get", "/orders", "Get Orders", 1,
    "list the orders placed through the SalesPlay POS in a shop for a date range (read-only), paginated with a cursor"],

  "shops/get-shops": ["get", "/shops", "Get Shops", 1,
    "list the shops (locations) and their POS terminals under a SalesPlay account (read-only)"],

  "payment-types/get-payment-types": ["get", "/payment_types", "Get Payment Types", 1,
    "list the payment methods (cash, card, custom) accepted in a SalesPlay account, paginated with a cursor"],
  "payment-types/create-payment-type": ["post", "/payment_types", "Create or Update Payment Type", 2,
    "create a custom payment method in SalesPlay, or update it when the payment type code already exists"],
  "payment-types/delete-payment-type": ["delete", "/payment_types", "Delete Payment Type", 3,
    "delete a custom payment method from a SalesPlay account by its ID (default types cannot be deleted)"],

  "order-types/get-order-types": ["get", "/order_types", "Get Order Types", 1,
    "list the order types (dine-in, takeaway, delivery) in a SalesPlay account, paginated with a cursor"],
  "order-types/create-order-type": ["post", "/order_types", "Create or Update Order Type", 2,
    "create an order type in SalesPlay, or update it when the order type already exists"],
  "order-types/delete-order-type": ["delete", "/order_types", "Delete Order Type", 3,
    "delete an order type from a SalesPlay account by its ID"],

  "modifiers/get-modifiers": ["get", "/modifiers", "Get Modifiers", 1,
    "list the product modifiers (add-ons and options) in a SalesPlay account, paginated with a cursor"],
  "modifiers/delete-modifier": ["delete", "/modifiers", "Delete Modifier", 2,
    "delete a modifier group from a SalesPlay account by its ID"],

  "inventory/get-inventory": ["get", "/inventory", "Get Inventory Levels", 1,
    "get the current stock level of products per shop in a SalesPlay account, paginated with a cursor"],
  "inventory/update-inventory": ["post", "/inventory", "Update Inventory Levels", 2,
    "set the stock level of one or more products in a SalesPlay shop"],

  "grn/get-grn": ["get", "/grn", "Get Goods Received Notes", 1,
    "list the Goods Received Notes (incoming stock) of a SalesPlay shop, filtered by number, status or date"],
  "grn/create-grn": ["post", "/grn", "Create Goods Received Note", 2,
    "record a Goods Received Note in SalesPlay for stock delivered by a supplier, with its line items"],

  "purchase-orders/get-purchase-orders": ["get", "/purchase_orders", "Get Purchase Orders", 1,
    "list the purchase orders raised to suppliers from a SalesPlay shop (read-only), paginated with a cursor"],

  "online-orders/place-online-order": ["post", "/online_orders", "Place Online Order", 1,
    "place an order from an external channel (website, delivery app) into the SalesPlay POS of a shop"],
  "online-orders/get-online-order-status": ["get", "/online_order_status", "Get Online Order Status", 2,
    "check the current status of online orders placed into SalesPlay, by their system unique ID"],
  "online-orders/cancel-online-order": ["post", "/cancel_online_order", "Cancel Online Order", 3,
    "cancel an online order placed into SalesPlay, by its system unique ID"],

  "shifts/get-shifts": ["get", "/shifts", "Get Shifts", 1,
    "list the cashier shifts of SalesPlay POS terminals for a date range (read-only), paginated with a cursor"],
  "shifts/get-drawer-transactions": ["get", "/drawer_transaction", "Get Pay-Ins and Pay-Outs", 2,
    "list the cash drawer pay-ins and pay-outs recorded on SalesPlay POS terminals during shifts (read-only)"],

  "timecards/get-timecards": ["get", "/timecards", "Get Timecards", 1,
    "list employee clock-in and clock-out records from SalesPlay for a date range (read-only)"],

  "pos-devices/get-pos-devices": ["get", "/pos_devices", "Get POS Devices", 1,
    "list the POS terminals registered under a SalesPlay account, with their shop and POS key (read-only)"],

  "merchant/get-merchant": ["get", "/merchant", "Get Merchant Information", 1,
    "retrieve the SalesPlay merchant account details (name, contact, currency) for the current token (read-only)"],
};

function typeLabel(schema) {
  const t = schema.type ?? 'string';
  const fmt = schema.format;
  if (t === 'array') return `array[${typeLabel(schema.items || {})}]`;
  let label = truthy(fmt) ? `${t} (${fmt})` : `${t}`;
  if (truthy(schema.enum)) {
    label += '<br/>enum: ' + schema.enum.map((e) => `\`${e}\``).join(' \\| ');
  }
  return label;
}

/** Make free text safe inside an MDX table cell. */
function esc(text) {
  return String(truthy(text) ? text : '')
    .split('\n').join(' ')
    .trim()
    .split('|').join('\\|')
    .split('<').join('&lt;')
    .split('>').join('&gt;')
    .split('{').join('&#123;')
    .split('}').join('&#125;');
}

/** Description + Default / Example / Min / Max hints, PayPal style. */
function describe(prop) {
  let out = esc(prop.description);
  const extra = ['default', 'example', 'minimum', 'maximum']
    .filter((k) => k in prop && !isPlainObject(prop[k]) && !Array.isArray(prop[k]))
    .map((k) => [k[0].toUpperCase() + k.slice(1), prop[k]]);
  if (extra.length) {
    out += ' ' + extra
      .map(([k, v]) => `${k}: \`${typeof v === 'boolean' ? pyJson(v) : esc(v)}\``)
      .join(' · ');
  }
  return out.trim();
}

/** Build a representative value for a schema node. */
function sample(schema) {
  if ('example' in schema) return schema.example;
  if ('default' in schema) return schema.default;
  if (truthy(schema.enum)) return schema.enum[0];
  const t = schema.type ?? 'string';
  if (t === 'object') {
    return Object.fromEntries(Object.entries(schema.properties || {}).map(([k, v]) => [k, sample(v)]));
  }
  if (t === 'array') return [sample(schema.items || {})];
  if (t === 'integer') return 0;
  if (t === 'number') return new Flt(0);
  if (t === 'boolean') return true;
  const fmt = schema.format;
  if (fmt === 'date-time') return '2025-01-15 10:30:00';
  if (fmt === 'binary') return '<binary file>';
  return 'string';
}

const nameCell = (name, required) =>
  `\`${name}\`` + (truthy(required) ? ' <span className="api-required">required</span>' : '');

function table(header, rows) {
  if (!rows.length) return '';
  const out = [`| ${header.join(' | ')} |`, `|${header.map(() => '---').join('|')}|`];
  for (const r of rows) out.push(`| ${r.join(' | ')} |`);
  return out.join('\n');
}

/**
 * Field table for one object level; nested objects go into <details> blocks
 * (PayPal's "show child attributes").
 */
function fields(schema, prefix = '') {
  if (schema.type === 'array') return fields(schema.items || {}, `${prefix}[]`);
  const required = schema.required || [];
  const rows = [];
  const nested = [];
  for (const [name, prop] of Object.entries(schema.properties || {})) {
    rows.push([nameCell(name, required.includes(name)), typeLabel(prop), describe(prop)]);
    const child = prop.type === 'object' ? prop : (prop.type === 'array' ? prop.items : null);
    if (truthy(child) && truthy(child.properties)) {
      nested.push([prefix + name + (prop.type === 'array' ? '[]' : ''), child]);
    }
  }
  const out = [table(['Name', 'Type', 'Description'], rows)];
  for (const [p, child] of nested) {
    out.push('', '<details>', `<summary><code>${p}</code> — child attributes</summary>`, '',
      fields(child, `${p}.`), '', '</details>');
  }
  return out.join('\n');
}

/** Six-language request examples, matching the style of Webhooks.md. */
function codeTabs(method, specPath, params, body) {
  const m = method.toUpperCase();
  const query = params
    .filter((p) => p.in === 'query' && truthy(p.required))
    .map((p) => `${p.name}=${sample(p.schema || {})}`)
    .join('&');
  const url = BASE + specPath + (truthy(query) ? `?${query}` : '');
  const bodyJson = truthy(body) ? pyJson(body, 2) : null;
  const pyBody = truthy(body) ? pyJson(body, 4) : null;

  const curl = [`curl -X ${m} "${url}" \\`, '  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"'];
  if (bodyJson) {
    curl[curl.length - 1] += ' \\';
    curl.push('  -H "Content-Type: application/json" \\', `  -d '${bodyJson}'`);
  }

  let js;
  let jsDone = false;
  if (bodyJson && (m === 'GET' || m === 'DELETE')) {
    // fetch() rejects a body on GET, so show Node's https.request instead
    js = ['import https from "node:https";', '',
      `const payload = JSON.stringify(${bodyJson});`, '',
      `const req = https.request("${url}", {`,
      `  method: "${m}",`,
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
      'req.end();'];
    jsDone = true;
  }
  if (!jsDone) {
    js = [`const res = await fetch("${url}", {`,
      `  method: "${m}",`,
      '  headers: {',
      '    "Authorization": "Bearer YOUR_ACCESS_TOKEN",'];
    if (bodyJson) js.push('    "Content-Type": "application/json",');
    js.push('  },');
    if (bodyJson) js.push(`  body: JSON.stringify(${bodyJson}),`);
    js.push('});', 'const data = await res.json();');
  }

  const py = ['import requests', '',
    `url = "${url}"`,
    'headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}'];
  if (pyBody) {
    py.push(`payload = ${pyBody}`, `res = requests.${method}(url, json=payload, headers=headers)`);
  } else {
    py.push(`res = requests.${method}(url, headers=headers)`);
  }
  py.push('print(res.json())');

  const php = ['<?php', `$ch = curl_init("${url}");`,
    `curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "${m}");`,
    'curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);'];
  if (bodyJson) {
    php.push(`curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode(${pyJson(body)}));`,
      'curl_setopt($ch, CURLOPT_HTTPHEADER, [',
      '    "Authorization: Bearer YOUR_ACCESS_TOKEN",',
      '    "Content-Type: application/json",',
      ']);');
  } else {
    php.push('curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer YOUR_ACCESS_TOKEN"]);');
  }
  php.push('$response = curl_exec($ch);', 'curl_close($ch);', 'echo $response;');

  const java = ['HttpRequest request = HttpRequest.newBuilder()',
    `    .uri(URI.create("${url}"))`,
    '    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")'];
  if (bodyJson) {
    java.push('    .header("Content-Type", "application/json")',
      `    .method("${m}", HttpRequest.BodyPublishers.ofString(payload))`);
  } else {
    java.push(`    .method("${m}", HttpRequest.BodyPublishers.noBody())`);
  }
  java.push('    .build();', '',
    'HttpResponse<String> response = client.send(request,',
    '    HttpResponse.BodyHandlers.ofString());');

  const cs = [`var request = new HttpRequestMessage(new HttpMethod("${m}"), "${url}");`,
    'request.Headers.Add("Authorization", "Bearer YOUR_ACCESS_TOKEN");'];
  if (bodyJson) {
    cs.push('request.Content = new StringContent(payload, Encoding.UTF8, "application/json");');
  }
  cs.push('var response = await client.SendAsync(request);',
    'var body = await response.Content.ReadAsStringAsync();');

  const langs = [['curl', 'cURL', 'bash', curl], ['js', 'JavaScript', 'javascript', js],
    ['python', 'Python', 'python', py], ['php', 'PHP', 'php', php],
    ['java', 'Java', 'java', java], ['csharp', 'C#', 'csharp', cs]];

  const parts = ['<Tabs>'];
  langs.forEach(([val, label, lang, lines], i) => {
    parts.push(`  <TabItem value="${val}" label="${label}"${i === 0 ? ' default' : ''}>`, '',
      `\`\`\`${lang}`, lines.join('\n'), '```', '',
      '  </TabItem>', '');
  });
  parts.push('</Tabs>');
  return parts.join('\n');
}

function err(codeEnum, detailsDesc, example, field = false) {
  const props = {
    code: { type: 'string', enum: codeEnum, description: 'Error code' },
    details: { type: 'string', description: detailsDesc },
  };
  if (field) props.field = { type: 'string', description: 'The field that failed validation (when applicable)' };
  return { type: 'object', properties: { errors: { type: 'object', properties: props } }, example };
}

// Responses every operation can return. Added to a page only when the spec does
// not already define that status code for the operation. Examples are real
// captures from the live API (2026-09-14) unless noted.
const COMMON_RESPONSES = {
  400: {
    description: 'Validation error — a required field is missing or a value is not accepted',
    note: 'Some endpoints return validation errors with status `401` instead of `400`; check `errors.code`, not just the status.',
    schema: err(['INVALID_VALUE', 'INVALID_FORMAT', 'INVALID_CURSOR', 'BAD_REQUEST'],
      'Human-readable reason',
      { errors: { code: 'INVALID_VALUE',
        details: 'The value must be a string (Supplier id can not be empty)',
        field: 'supplier_id' } }, true),
  },
  401: {
    description: 'Unauthorized — the access token is missing, invalid or expired',
    note: null,
    schema: err(['UNAUTHORIZED', 'ACCESS_DENIED'], 'Human-readable reason',
      { errors: { code: 'UNAUTHORIZED', details: 'Access token is not valid.' } }),
  },
  429: {
    description: 'Rate limited — too many requests from this account',
    note: 'Pause and retry with backoff. See [Rate Limits](../rate-limits). (Not reproduced in testing; shape from the API definition.)',
    schema: err(['RATE_LIMITED'], 'Rate limit error message',
      { errors: { code: 'RATE_LIMITED', details: 'Request quota exceeded' } }),
  },
};

const GENERIC = ['This API will allow', 'This API allows', 'This API will delete',
  'This API deletes', 'This API returns'];

/**
 * One paragraph that stands alone: method, path, purpose, where parameters go,
 * auth and base URL — so a reader (or an AI assistant) who sees only this chunk
 * has every fact needed to call the endpoint. See PLAN_gio.md §4 Phase 2b.
 */
function introParagraph(m, specPath, purpose, bodySchema, bodyCt) {
  const parts = [`**${m} ${specPath}** — ${purpose}.`];
  const names = Object.keys((bodySchema || {}).properties || {});
  if (names.length) {
    const shown = names.slice(0, 8).map((n) => `\`${n}\``).join(', ') + (names.length > 8 ? ', …' : '');
    const how = truthy(bodyCt) && bodyCt.includes('multipart')
      ? 'Send a multipart form' : 'Send parameters as a JSON request body';
    parts.push(`${how} (${shown}).`);
  }
  parts.push(`Requires a Bearer token in the \`Authorization\` header. Base URL: \`${BASE}\`.`);
  return parts.join(' ');
}

/** Keep the spec's own description only when it says something the intro does not. */
function specNote(op) {
  const text = (op.description || '').trim();
  return GENERIC.some((g) => text.startsWith(g)) ? '' : text;
}

function render(method, specPath, title, position, purpose, op) {
  const params = op.parameters || [];
  let bodySchema = null;
  let bodyCt = null;
  const rb = op.requestBody || {};
  for (const [ct, media] of Object.entries(rb.content || {})) {
    bodySchema = media.schema || {};
    bodyCt = ct;
    break;
  }
  const body = truthy(bodySchema) || bodySchema ? (bodySchema ? sample(bodySchema) : null) : null;
  const m = method.toUpperCase();

  const md = ['---',
    `title: ${title}`,
    `sidebar_label: ${title}`,
    `sidebar_position: ${position}`,
    `description: "${m} ${specPath} — ${purpose}."`,
    '---', '',
    "import Tabs from '@theme/Tabs';",
    "import TabItem from '@theme/TabItem';", '',
    `# ${title}`, '',
    introParagraph(m, specPath, purpose, bodySchema, bodyCt), '',
    specNote(op), '',
    `<div className="api-endpoint"><span className="api-badge api-badge--${method}">${m}</span>`
      + `<code>${BASE}${specPath}</code></div>`, '',
    '## Authorization', '',
    'Bearer token in the `Authorization` header — see '
      + '[Personal Access Tokens](../../guides/personal-access-tokens) or '
      + '[OAuth 2.0](../../guides/oauth).', ''];

  for (const [loc, heading] of [['path', 'Path parameters'], ['query', 'Query parameters'],
    ['header', 'Header parameters']]) {
    const rows = params.filter((p) => p.in === loc).map((p) => [
      nameCell(p.name, p.required),
      typeLabel(p.schema || {}),
      describe({ ...(p.schema || {}), description: p.description }),
    ]);
    if (rows.length) md.push(`## ${heading}`, '', table(['Name', 'Type', 'Description'], rows), '');
  }

  if (truthy(bodySchema)) {
    md.push('## Request body', '', `Content type: \`${bodyCt}\``, '');
    if ((m === 'GET' || m === 'DELETE') && bodyCt === 'application/json') {
      md.push(':::info Send filters as a JSON body',
        `This endpoint reads its parameters from the JSON request body — even on \`${m}\`. `
          + 'Query-string parameters are ignored.',
        ':::', '');
    }
    md.push(fields(bodySchema), '');
  }

  md.push('## Example request', '',
    codeTabs(method, specPath, params, bodyCt === 'application/json' ? body : null), '');

  const responses = { ...(op.responses || {}) };
  for (const [code, c] of Object.entries(COMMON_RESPONSES)) {
    if (!(code in responses)) {
      responses[code] = { description: c.description, note: c.note,
        content: { 'application/json': { schema: c.schema } } };
    } else {
      // spec defines it but usually without an example: reuse the real one
      for (const media of Object.values(responses[code].content || {})) {
        const sch = media.schema || {};
        if (!('example' in sch) && 'errors' in (sch.properties || {})) {
          media.schema = { ...sch, example: c.schema.example };
        }
      }
      responses[code] = { ...responses[code], note: responses[code].note || c.note };
    }
  }
  const codes = Object.keys(responses).sort();
  if (codes.length) {
    md.push('## Responses', '', '<Tabs>');
    codes.forEach((code, i) => {
      const resp = responses[code];
      md.push(`  <TabItem value="${code}" label="${code}"${i === 0 ? ' default' : ''}>`, '',
        `**${code}** — ${esc(resp.description) || 'No description.'}`, '');
      if (truthy(resp.note)) md.push(resp.note, '');
      if ('45'.includes(String(code)[0])) {
        md.push('See [Troubleshooting & Errors](../../guides/errors-guide) for how to handle this response.', '');
      }
      let schema = null;
      for (const media of Object.values(resp.content || {})) {
        schema = media.schema || {};
        break;
      }
      if (truthy(schema)) {
        md.push('```json', pyJson(sample(schema), 2), '```', '');
        const bodyFields = fields(schema);
        if (bodyFields.trim()) md.push('**Response fields**', '', bodyFields, '');
      }
      md.push('  </TabItem>', '');
    });
    md.push('</Tabs>', '');
  }

  return `${md.join('\n').replace(/\s+$/, '')}\n`;
}

const spec = yaml.load(readFileSync('api_spec.yaml', 'utf8'), { schema: SCHEMA });
let written = 0;
for (const [docId, [method, specPath, title, position, purpose]] of Object.entries(PAGES)) {
  const op = (spec.paths[specPath] || {})[method];
  if (!isPlainObject(op)) {
    console.log(`SKIP (not in spec): ${method.toUpperCase()} ${specPath} -> ${docId}`);
    continue;
  }
  const out = `${path.join('docs', 'API-reference', ...docId.split('/'))}.md`;
  mkdirSync(path.dirname(out), { recursive: true });
  writeFileSync(out, render(method, specPath, title, position, purpose, op));
  written += 1;
}
console.log(`Wrote ${written} pages.`);
