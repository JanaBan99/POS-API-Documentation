---
description: "Retrieve the shops (locations) on your SalesPlay account with GET /shops — the quickest way to prove your access token works, with Postman and cURL examples."
title: Retrieving Shops
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';
import TenantImage from '@site/src/components/TenantImage';

# Retrieving Shops

Shops are the locations on your SalesPlay account. The API exposes them **read-only** — you create, edit and remove shops in the SalesPlay Backoffice, then read them back with `GET /shops`.

Because it needs no parameters, `GET /shops` is also the quickest way to prove your access token works. If you have just finished [Getting Started](getting-started), start here.

---

## In Postman

1. In the imported **POS_Developer_API** collection, open the **Shops** folder and click the **shops** request.
2. The URL reads `{{baseUrl}}/shops`. Open the **Headers** tab — the collection already sends your token as `Token: Bearer {{Token}}`, filled from the `Token` environment variable you set in [Getting Started](getting-started).
3. Click **Send**. (The request carries an optional JSON body with filters — `shop_ids`, `updated_at_min`, `limit` — leave them blank for now.)

{/* TODO: drop a Postman screenshot of GET {{baseUrl}}/shops with its 200 response at static/img/shared/postman_first_request.png, then un-comment:
<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <TenantImage
    src="/img/postman_first_request.png"
    style={{
      width: '100%',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #eee'
    }}
    alt="Postman: GET /shops request with a 200 OK response"
  />
</div>
*/}

## The same request in code

<Tabs groupId="language">
  <TabItem value="curl" label="cURL">

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/shops" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

  </TabItem>
  <TabItem value="js" label="JavaScript">

```js
const res = await fetch('https://api.salesplaypos.com/v1.0/shops', {
  headers: { Authorization: 'Bearer YOUR_ACCESS_TOKEN' },
});

if (!res.ok) throw new Error(`GET /shops failed: ${res.status}`);

const { shops } = await res.json();
console.log(shops);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

res = requests.get(
    "https://api.salesplaypos.com/v1.0/shops",
    headers={"Authorization": "Bearer YOUR_ACCESS_TOKEN"},
    timeout=30,
)
res.raise_for_status()

print(res.json()["shops"])
```

  </TabItem>
  <TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init('https://api.salesplaypos.com/v1.0/shops');
curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_HTTPHEADER     => ['Authorization: Bearer YOUR_ACCESS_TOKEN'],
]);

$body   = curl_exec($ch);
$status = curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);

if ($status !== 200) {
    throw new RuntimeException("GET /shops failed: $status");
}

print_r(json_decode($body, true)['shops']);
```

  </TabItem>
  <TabItem value="java" label="Java">

```java
// Java 11+, no external dependencies
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.salesplaypos.com/v1.0/shops"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .GET()
    .build();

HttpResponse<String> response = HttpClient.newHttpClient()
    .send(request, HttpResponse.BodyHandlers.ofString());

if (response.statusCode() != 200) {
    throw new IllegalStateException("GET /shops failed: " + response.statusCode());
}

System.out.println(response.body());
```

  </TabItem>
  <TabItem value="csharp" label="C#">

```csharp
using System;
using System.Net.Http;
using System.Net.Http.Headers;

using var client = new HttpClient();
client.DefaultRequestHeaders.Authorization =
    new AuthenticationHeaderValue("Bearer", "YOUR_ACCESS_TOKEN");

var response = await client.GetAsync("https://api.salesplaypos.com/v1.0/shops");
response.EnsureSuccessStatusCode();

Console.WriteLine(await response.Content.ReadAsStringAsync());
```

  </TabItem>
</Tabs>

## Expected response

A `200 OK` with your shop list. A brand-new account looks like this:

```json
{
  "shops": [
    {
      "id": "MnczNjdrVllFVTZoKzBHak1XZXkrZz09",
      "shop_name": "NoCompany",
      "address": "",
      "phone_number": "",
      "city": "",
      "email": "",
      "longitude": "",
      "latitude": "",
      "terminal_list": [
        { "pos_name": "POS 01", "pos_key": "SP25443956" }
      ],
      "is_enable": "1",
      "updated_date": "2026-09-14 12:27:10"
    }
  ],
  "cursor": "MT@sMT@="
}
```

Keep the `id` handy — it's the `shop_id` you'll pass when you [create your first product](../API-reference/products/create-product.md).

| If you get… | It means… |
|---|---|
| `401` with `"code": "UNAUTHORIZED"` | The token is missing, expired, or pasted with extra spaces. Regenerate it in the Backoffice and update the `Token` variable. |
| `404 Not Found` | Check `baseUrl` — it must be `https://api.salesplaypos.com/v1.0` with no trailing slash. |

That's your integration coming to life. From here, dive deeper into the guides to build out the full integration:

- [Set Up Categories](categories) → [Create Products](product) → [Process Orders](order-integration) — the core flow
- [Every shop endpoint](/category/shops) — the full `/shops` reference, with filters, parameters and responses
- [API Reference](../API-reference/index.md) — every endpoint with parameters and examples

