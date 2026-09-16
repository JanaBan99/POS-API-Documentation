---
title: Get Products
sidebar_label: Get Products
sidebar_position: 1
description: "GET /products — list the products in a SalesPlay account, filtered by ID or created/updated date, paginated with a cursor."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get Products

**GET /products** — list the products in a SalesPlay account, filtered by ID or created/updated date, paginated with a cursor. Send parameters as a JSON request body (`product_ids`, `created_at_min`, `created_at_max`, `updated_at_min`, `updated_at_max`, `limit`, `cursor`). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--get">GET</span><code>https://api.salesplaypos.com/v1.0/products</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `application/json`

:::info Send filters as a JSON body
This endpoint reads its parameters from the JSON request body — even on `GET`. Query-string parameters are ignored.
:::

| Name | Type | Description |
|---|---|---|
| `product_ids` | string | Return only items specified by a comma-separated list of IDs |
| `created_at_min` | string (date-time) | Minimum created date (Y-m-d H:i:s) 24 hours format |
| `created_at_max` | string (date-time) | Maximum created date (Y-m-d H:i:s) 24 hours format |
| `updated_at_min` | string (date-time) | Minimum updated date (Y-m-d H:i:s) 24 hours format |
| `updated_at_max` | string (date-time) | Maximum updated date (Y-m-d H:i:s) 24 hours format |
| `limit` | integer | Maximum number of products to return Default: `10` · Minimum: `1` · Maximum: `100` |
| `cursor` | string | Cursor for pagination |

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/products" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "product_ids": "string",
  "created_at_min": "2025-01-15 10:30:00",
  "created_at_max": "2025-01-15 10:30:00",
  "updated_at_min": "2025-01-15 10:30:00",
  "updated_at_max": "2025-01-15 10:30:00",
  "limit": 10,
  "cursor": "string"
}'
```

  </TabItem>

  <TabItem value="js" label="JavaScript">

```javascript
import https from "node:https";

const payload = JSON.stringify({
  "product_ids": "string",
  "created_at_min": "2025-01-15 10:30:00",
  "created_at_max": "2025-01-15 10:30:00",
  "updated_at_min": "2025-01-15 10:30:00",
  "updated_at_max": "2025-01-15 10:30:00",
  "limit": 10,
  "cursor": "string"
});

const req = https.request("https://api.salesplaypos.com/v1.0/products", {
  method: "GET",
  headers: {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json",
    "Content-Length": Buffer.byteLength(payload),
  },
}, (res) => {
  let data = "";
  res.on("data", (chunk) => (data += chunk));
  res.on("end", () => console.log(JSON.parse(data)));
});
req.write(payload);
req.end();
```

  </TabItem>

  <TabItem value="python" label="Python">

```python
import requests

url = "https://api.salesplaypos.com/v1.0/products"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "product_ids": "string",
    "created_at_min": "2025-01-15 10:30:00",
    "created_at_max": "2025-01-15 10:30:00",
    "updated_at_min": "2025-01-15 10:30:00",
    "updated_at_max": "2025-01-15 10:30:00",
    "limit": 10,
    "cursor": "string"
}
res = requests.get(url, json=payload, headers=headers)
print(res.json())
```

  </TabItem>

  <TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init("https://api.salesplaypos.com/v1.0/products");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"product_ids": "string", "created_at_min": "2025-01-15 10:30:00", "created_at_max": "2025-01-15 10:30:00", "updated_at_min": "2025-01-15 10:30:00", "updated_at_max": "2025-01-15 10:30:00", "limit": 10, "cursor": "string"}));
curl_setopt($ch, CURLOPT_HTTPHEADER, [
    "Authorization: Bearer YOUR_ACCESS_TOKEN",
    "Content-Type: application/json",
]);
$response = curl_exec($ch);
curl_close($ch);
echo $response;
```

  </TabItem>

  <TabItem value="java" label="Java">

```java
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.salesplaypos.com/v1.0/products"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("Content-Type", "application/json")
    .method("GET", HttpRequest.BodyPublishers.ofString(payload))
    .build();

HttpResponse<String> response = client.send(request,
    HttpResponse.BodyHandlers.ofString());
```

  </TabItem>

  <TabItem value="csharp" label="C#">

```csharp
var request = new HttpRequestMessage(new HttpMethod("GET"), "https://api.salesplaypos.com/v1.0/products");
request.Headers.Add("Authorization", "Bearer YOUR_ACCESS_TOKEN");
request.Content = new StringContent(payload, Encoding.UTF8, "application/json");
var response = await client.SendAsync(request);
var body = await response.Content.ReadAsStringAsync();
```

  </TabItem>

</Tabs>

## Responses

<Tabs>
  <TabItem value="200" label="200" default>

**200** — Customer login

```json
{
  "products": [
    {
      "id": "SC9hT1d5Skllc2VSTGF2dkJZVzYzdz09",
      "product_code": "10034",
      "product_name": "Aba Juice cup",
      "category": "Ma\u00efs",
      "sub_category": "",
      "stock_control": false,
      "stock_expire_mode": false,
      "safety_stock": "",
      "price_change": false,
      "cost": 0,
      "quantity_change": false,
      "barcode": "",
      "measurement": "",
      "tax_codes": [],
      "is_vat_product": false,
      "is_composite": false,
      "use_production": false,
      "components": [],
      "is_combo": false,
      "combo_sets": [],
      "modifier_group_ids": [],
      "is_ingredient": false,
      "image_url": "",
      "variants": [],
      "shops": [
        {
          "id": "SC9hTttrkllc2VSTGF2dkJZVzYzdz09",
          "price": 5500.0,
          "available_for_sale": true,
          "safety_stock": 10
        },
        {
          "id": "ZSC9hT1d5Skllc2VSF2dkJZVzYzdz09",
          "price": 5500.0,
          "available_for_sale": true,
          "safety_stock": 10
        },
        {
          "id": "AC9hT1d5Skllc2VSTGF2dkJZVzYzdz09",
          "price": 5500.0,
          "available_for_sale": true,
          "safety_stock": 10
        }
      ],
      "created_date": "2022-07-20 13:54:33",
      "updated_date": "2022-07-20 14:10:09"
    }
  ]
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `products` | array[object] |  |
| `cursor` | string | Pagination cursor. Send it back in the next request to fetch the following page; absent on the last page. |

<details>
<summary><code>products[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `id` | string | Read-only internal id of the item. If included in the POST request it will cause an update instead of a creating a new object. |
| `product_code` | string | The product code |
| `product_name` | string | The product name |
| `category` | string | The category of the product |
| `sub_category` | string | The subcategory of the product |
| `stock_control` | boolean | Indicates if stock control is enabled for the product |
| `stock_expire_mode` | boolean | Indicates if stock expiration mode is enabled for the product |
| `safety_stock` | string | Safety stock value |
| `price_change` | boolean | Indicates if price change is allowed for the product |
| `cost` | string | Cost of the product |
| `quantity_change` | boolean | Indicates if quantity change is allowed for the product |
| `barcode` | string | Barcode of the product |
| `measurement` | string | Measurement unit of the product |
| `tax_codes` | array[string] | Array of tax codes associated with the product |
| `is_vat_product` | boolean | Indicates if the product is a VAT product |
| `is_composite` | boolean | Indicates if the product is a composite product |
| `use_production` | boolean | Indicates if production is used for the product |
| `components` | array[object] | Array of components for composite products |
| `is_combo` | boolean | Indicates if the product is a combo product |
| `combo_sets` | array[object] | Array of combo sets for combo products |
| `modifier_group_ids` | array[string] | Array of modifier group IDs associated with the product |
| `is_ingredient` | boolean | Indicates if the product is an ingredient |
| `image_url` | string (uri) | URL of the product image |
| `shops` | array[object] | Array of shop information for the product |
| `created_date` | string (date-time) | Date and time of the product creation |
| `updated_date` | string (date-time) | Date and time of the product update |
| `variants` | array[object] | Array of variants associated with the product |
| `delete_date` | string (date-time) | Date and time if product deleted |

<details>
<summary><code>products[].shops[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `shop_id` | string | Shop ID |
| `price` | string | Price of the product in the shop |
| `available_for_sale` | boolean | Indicates if the product is available for sale in the shop |
| `safety_stock` | string | Safety stock value for the shop |

</details>

</details>

  </TabItem>

  <TabItem value="400" label="400">

**400** — Validation error — a required field is missing or a value is not accepted

Some endpoints return validation errors with status `401` instead of `400`; check `errors.code`, not just the status.

See [Troubleshooting & Errors](../../guides/errors-guide) for how to handle this response.

```json
{
  "errors": {
    "code": "INVALID_VALUE",
    "details": "The value must be a string (Supplier id can not be empty)",
    "field": "supplier_id"
  }
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `errors` | object |  |

<details>
<summary><code>errors</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `code` | string<br/>enum: `INVALID_VALUE` \| `INVALID_FORMAT` \| `INVALID_CURSOR` \| `BAD_REQUEST` | Error code |
| `details` | string | Human-readable reason |
| `field` | string | The field that failed validation (when applicable) |

</details>

  </TabItem>

  <TabItem value="401" label="401">

**401** — Unauthorized

See [Troubleshooting & Errors](../../guides/errors-guide) for how to handle this response.

```json
{
  "errors": {
    "code": "UNAUTHORIZED",
    "details": "Access token is not valid."
  }
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `errors` | object |  |

<details>
<summary><code>errors</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `code` | string | The error code. |
| `details` | string | The details of the error. |

</details>

  </TabItem>

  <TabItem value="429" label="429">

**429** — Rate limited — too many requests from this account

Pause and retry with backoff. See [Rate Limits](../rate-limits). (Not reproduced in testing; shape from the API definition.)

See [Troubleshooting & Errors](../../guides/errors-guide) for how to handle this response.

```json
{
  "errors": {
    "code": "RATE_LIMITED",
    "details": "Request quota exceeded"
  }
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `errors` | object |  |

<details>
<summary><code>errors</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `code` | string<br/>enum: `RATE_LIMITED` | Error code |
| `details` | string | Rate limit error message |

</details>

  </TabItem>

</Tabs>
