---
title: Create or Update Product
sidebar_label: Create or Update Product
sidebar_position: 2
description: "POST /products — create a product in SalesPlay with its category, price, tax and stock settings, or update it when the product code already exists."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Create or Update Product

**POST /products** — create a product in SalesPlay with its category, price, tax and stock settings, or update it when the product code already exists. Send parameters as a JSON request body (`product_code`, `product_name`, `barcode`, `description`, `category_id`, `sub_category_id`, `measurement_id`, `cost`, …). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--post">POST</span><code>https://api.salesplaypos.com/v1.0/products</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `application/json`

| Name | Type | Description |
|---|---|---|
| `product_code` <span className="api-required">required</span> | string | The code of the product |
| `product_name` <span className="api-required">required</span> | string | The name of the product |
| `barcode` | string | The barcode of the product |
| `description` | string | The description of the product |
| `category_id` | string | The ID of the category |
| `sub_category_id` | string | The ID of the subcategory |
| `measurement_id` | string | The ID of the measurement |
| `cost` <span className="api-required">required</span> | string | The cost of the product |
| `stock_control` <span className="api-required">required</span> | boolean | Indicates if stock control is enabled |
| `product_price_change` <span className="api-required">required</span> | boolean | Indicates if product price change is allowed |
| `qty_change_option` <span className="api-required">required</span> | boolean | Indicates if quantity change option is enabled |
| `expire_mode` <span className="api-required">required</span> | boolean | Indicates if expiration mode is enabled |
| `is_composite` <span className="api-required">required</span> | boolean | Must be sent as false. Composite products are not supported by this API. Default: `false` · Example: `false` |
| `use_production` <span className="api-required">required</span> | boolean | Must be sent as false. Production products are not supported by this API. Default: `false` · Example: `false` |
| `is_variant` <span className="api-required">required</span> | boolean | Indicates if the product is a variant |
| `components` | array[object] | List of components |
| `tax_ids` | array[string] | List of tax IDs |
| `modifiers_ids` | array[string] | List of modifier IDs |
| `option1_name` | string | Name of option 1 |
| `option2_name` | string | Name of option 2 |
| `option3_name` | string | Name of option 3 |
| `created_at` | string (date-time) | The creation date of the product |
| `updated_at` | string (date-time) | The update date of the product |
| `variants` | array[object] |  |
| `shops` <span className="api-required">required</span> | array[object] |  |

<details>
<summary><code>variants[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `product_code` | string | The code of the product variant |
| `option1_value` | string | Value of option 1 for the variant |
| `option2_value` | string | Value of option 2 for the variant |
| `option3_value` | string | Value of option 3 for the variant |
| `barcode` | string | The barcode of the variant |
| `default_cost` | number | The default cost of the variant |
| `shops` | array[object] |  |

<details>
<summary><code>variants[].shops[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `store_id` | string | The ID of the store |
| `price` | string | The price of the variant in the store |
| `available_for_sale` | boolean | Indicates if the variant is available for sale in the store |
| `safety_stock` | string | The safety stock of the variant in the store |

</details>

</details>

<details>
<summary><code>shops[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `shop_id` | string | The ID of the shop |
| `price` | string | The price of the product in the shop |
| `available_for_sale` | boolean | Indicates if the product is available for sale in the shop |
| `safety_stock` | string | The safety stock of the product in the shop |

</details>

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X POST "https://api.salesplaypos.com/v1.0/products" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "product_code": "string",
  "product_name": "string",
  "barcode": "string",
  "description": "string",
  "category_id": "string",
  "sub_category_id": "string",
  "measurement_id": "string",
  "cost": "string",
  "stock_control": true,
  "product_price_change": true,
  "qty_change_option": true,
  "expire_mode": true,
  "is_composite": false,
  "use_production": false,
  "is_variant": true,
  "components": [
    {}
  ],
  "tax_ids": [
    "string"
  ],
  "modifiers_ids": [
    "string"
  ],
  "option1_name": "string",
  "option2_name": "string",
  "option3_name": "string",
  "created_at": "2025-01-15 10:30:00",
  "updated_at": "2025-01-15 10:30:00",
  "variants": [
    {
      "product_code": "string",
      "option1_value": "string",
      "option2_value": "string",
      "option3_value": "string",
      "barcode": "string",
      "default_cost": 0.0,
      "shops": [
        {
          "store_id": "string",
          "price": "string",
          "available_for_sale": true,
          "safety_stock": "string"
        }
      ]
    }
  ],
  "shops": [
    {
      "shop_id": "string",
      "price": "string",
      "available_for_sale": true,
      "safety_stock": "string"
    }
  ]
}'
```

  </TabItem>

  <TabItem value="js" label="JavaScript">

```javascript
const res = await fetch("https://api.salesplaypos.com/v1.0/products", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "product_code": "string",
  "product_name": "string",
  "barcode": "string",
  "description": "string",
  "category_id": "string",
  "sub_category_id": "string",
  "measurement_id": "string",
  "cost": "string",
  "stock_control": true,
  "product_price_change": true,
  "qty_change_option": true,
  "expire_mode": true,
  "is_composite": false,
  "use_production": false,
  "is_variant": true,
  "components": [
    {}
  ],
  "tax_ids": [
    "string"
  ],
  "modifiers_ids": [
    "string"
  ],
  "option1_name": "string",
  "option2_name": "string",
  "option3_name": "string",
  "created_at": "2025-01-15 10:30:00",
  "updated_at": "2025-01-15 10:30:00",
  "variants": [
    {
      "product_code": "string",
      "option1_value": "string",
      "option2_value": "string",
      "option3_value": "string",
      "barcode": "string",
      "default_cost": 0.0,
      "shops": [
        {
          "store_id": "string",
          "price": "string",
          "available_for_sale": true,
          "safety_stock": "string"
        }
      ]
    }
  ],
  "shops": [
    {
      "shop_id": "string",
      "price": "string",
      "available_for_sale": true,
      "safety_stock": "string"
    }
  ]
}),
});
const data = await res.json();
```

  </TabItem>

  <TabItem value="python" label="Python">

```python
import requests

url = "https://api.salesplaypos.com/v1.0/products"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "product_code": "string",
    "product_name": "string",
    "barcode": "string",
    "description": "string",
    "category_id": "string",
    "sub_category_id": "string",
    "measurement_id": "string",
    "cost": "string",
    "stock_control": true,
    "product_price_change": true,
    "qty_change_option": true,
    "expire_mode": true,
    "is_composite": false,
    "use_production": false,
    "is_variant": true,
    "components": [
        {}
    ],
    "tax_ids": [
        "string"
    ],
    "modifiers_ids": [
        "string"
    ],
    "option1_name": "string",
    "option2_name": "string",
    "option3_name": "string",
    "created_at": "2025-01-15 10:30:00",
    "updated_at": "2025-01-15 10:30:00",
    "variants": [
        {
            "product_code": "string",
            "option1_value": "string",
            "option2_value": "string",
            "option3_value": "string",
            "barcode": "string",
            "default_cost": 0.0,
            "shops": [
                {
                    "store_id": "string",
                    "price": "string",
                    "available_for_sale": true,
                    "safety_stock": "string"
                }
            ]
        }
    ],
    "shops": [
        {
            "shop_id": "string",
            "price": "string",
            "available_for_sale": true,
            "safety_stock": "string"
        }
    ]
}
res = requests.post(url, json=payload, headers=headers)
print(res.json())
```

  </TabItem>

  <TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init("https://api.salesplaypos.com/v1.0/products");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"product_code": "string", "product_name": "string", "barcode": "string", "description": "string", "category_id": "string", "sub_category_id": "string", "measurement_id": "string", "cost": "string", "stock_control": true, "product_price_change": true, "qty_change_option": true, "expire_mode": true, "is_composite": false, "use_production": false, "is_variant": true, "components": [{}], "tax_ids": ["string"], "modifiers_ids": ["string"], "option1_name": "string", "option2_name": "string", "option3_name": "string", "created_at": "2025-01-15 10:30:00", "updated_at": "2025-01-15 10:30:00", "variants": [{"product_code": "string", "option1_value": "string", "option2_value": "string", "option3_value": "string", "barcode": "string", "default_cost": 0.0, "shops": [{"store_id": "string", "price": "string", "available_for_sale": true, "safety_stock": "string"}]}], "shops": [{"shop_id": "string", "price": "string", "available_for_sale": true, "safety_stock": "string"}]}));
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
    .method("POST", HttpRequest.BodyPublishers.ofString(payload))
    .build();

HttpResponse<String> response = client.send(request,
    HttpResponse.BodyHandlers.ofString());
```

  </TabItem>

  <TabItem value="csharp" label="C#">

```csharp
var request = new HttpRequestMessage(new HttpMethod("POST"), "https://api.salesplaypos.com/v1.0/products");
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

**200** — Product created or updated successfully

```json
[
  {
    "code": "SUCCESS",
    "details": "Product successfully added",
    "product_ids": [
      {
        "product_code": "DOC-TEST-001",
        "product_id": "Nmp3Sk9yNTNhTTdodDBqdnVyZm1odz09"
      }
    ]
  }
]
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `code` | string | Result code, `SUCCESS` on success |
| `details` | string | Human-readable result message |
| `product_ids` | array[object] | The created or updated products |

<details>
<summary><code>[]product_ids[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `product_code` | string | The product code you sent |
| `product_id` | string | Encrypted ID assigned by SalesPlay |

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

**401** — Unauthorized — the access token is missing, invalid or expired

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
| `code` | string<br/>enum: `UNAUTHORIZED` \| `ACCESS_DENIED` | Error code |
| `details` | string | Human-readable reason |

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
