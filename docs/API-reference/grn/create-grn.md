---
title: Create Goods Received Note
sidebar_label: Create Goods Received Note
sidebar_position: 2
description: "POST /grn — record a Goods Received Note in SalesPlay for stock delivered by a supplier, with its line items."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Create Goods Received Note

**POST /grn** — record a Goods Received Note in SalesPlay for stock delivered by a supplier, with its line items. Send parameters as a JSON request body (`supplier_id`, `shop_id`, `grn_date`, `payment_method_id`, `supplier_invoice_no`, `addition_information`, `grn_type`, `grn_total`, …). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--post">POST</span><code>https://api.salesplaypos.com/v1.0/grn</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `application/json`

| Name | Type | Description |
|---|---|---|
| `supplier_id` | string | The ID of the supplier |
| `shop_id` | string | The ID of the shop |
| `grn_date` | string (date) | The date of the GRN |
| `payment_method_id` | string | The ID of the payment method |
| `supplier_invoice_no` | string | Supplier invoice number |
| `addition_information` | string | Additional information |
| `grn_type` | string | Type of GRN (e.g., DIRECT) |
| `grn_total` | number | Total amount for the GRN |
| `items` | array[object] |  |

<details>
<summary><code>items[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `product_id` | string | The ID of the product |
| `qty` | number | Quantity of the product received |
| `unit_cost` | number | Cost per unit |
| `total_unit_cost` | number | Total cost for the received quantity |
| `expire_mode` | string | Expiration mode (e.g., ON or OFF) |
| `expire_date` | string (date) | Expiration date (YYYY-MM-DD) |

</details>

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X POST "https://api.salesplaypos.com/v1.0/grn" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "supplier_id": "string",
  "shop_id": "string",
  "grn_date": "string",
  "payment_method_id": "string",
  "supplier_invoice_no": "string",
  "addition_information": "string",
  "grn_type": "string",
  "grn_total": 0.0,
  "items": [
    {
      "product_id": "string",
      "qty": 0.0,
      "unit_cost": 0.0,
      "total_unit_cost": 0.0,
      "expire_mode": "string",
      "expire_date": "string"
    }
  ]
}'
```

  </TabItem>

  <TabItem value="js" label="JavaScript">

```javascript
const res = await fetch("https://api.salesplaypos.com/v1.0/grn", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "supplier_id": "string",
  "shop_id": "string",
  "grn_date": "string",
  "payment_method_id": "string",
  "supplier_invoice_no": "string",
  "addition_information": "string",
  "grn_type": "string",
  "grn_total": 0.0,
  "items": [
    {
      "product_id": "string",
      "qty": 0.0,
      "unit_cost": 0.0,
      "total_unit_cost": 0.0,
      "expire_mode": "string",
      "expire_date": "string"
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

url = "https://api.salesplaypos.com/v1.0/grn"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "supplier_id": "string",
    "shop_id": "string",
    "grn_date": "string",
    "payment_method_id": "string",
    "supplier_invoice_no": "string",
    "addition_information": "string",
    "grn_type": "string",
    "grn_total": 0.0,
    "items": [
        {
            "product_id": "string",
            "qty": 0.0,
            "unit_cost": 0.0,
            "total_unit_cost": 0.0,
            "expire_mode": "string",
            "expire_date": "string"
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
$ch = curl_init("https://api.salesplaypos.com/v1.0/grn");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"supplier_id": "string", "shop_id": "string", "grn_date": "string", "payment_method_id": "string", "supplier_invoice_no": "string", "addition_information": "string", "grn_type": "string", "grn_total": 0.0, "items": [{"product_id": "string", "qty": 0.0, "unit_cost": 0.0, "total_unit_cost": 0.0, "expire_mode": "string", "expire_date": "string"}]}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/grn"))
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
var request = new HttpRequestMessage(new HttpMethod("POST"), "https://api.salesplaypos.com/v1.0/grn");
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

**200** — GRN created successfully

```json
{
  "success": {
    "code": "string",
    "details": "string"
  }
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `success` | object |  |

<details>
<summary><code>success</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `code` | string | Status code indicating success |
| `details` | string | Additional details about the success status |

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
