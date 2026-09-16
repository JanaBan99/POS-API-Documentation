---
title: Get Purchase Orders
sidebar_label: Get Purchase Orders
sidebar_position: 1
description: "GET /purchase_orders — list the purchase orders raised to suppliers from a SalesPlay shop (read-only), paginated with a cursor."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get Purchase Orders

**GET /purchase_orders** — list the purchase orders raised to suppliers from a SalesPlay shop (read-only), paginated with a cursor. Send parameters as a JSON request body (`shop_ids`, `po_numbers`, `created_at_min`, `created_at_max`, `limit`, `cursor`). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--get">GET</span><code>https://api.salesplaypos.com/v1.0/purchase_orders</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `application/json`

:::info Send filters as a JSON body
This endpoint reads its parameters from the JSON request body — even on `GET`. Query-string parameters are ignored.
:::

| Name | Type | Description |
|---|---|---|
| `shop_ids` | string | Comma-separated list of shop IDs. |
| `po_numbers` | string | Filter by specific purchase order numbers (comma-separated list) |
| `created_at_min` | string (date-time) | Minimum creation date (Y-m-d H:i:s) 24 hours format |
| `created_at_max` | string (date-time) | Maximum creation date (Y-m-d H:i:s) 24 hours format |
| `limit` | integer | Number of purchase orders to return per page Default: `10` |
| `cursor` | string | Cursor for pagination to retrieve the next set of results |

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/purchase_orders" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "shop_ids": "string",
  "po_numbers": "string",
  "created_at_min": "2025-01-15 10:30:00",
  "created_at_max": "2025-01-15 10:30:00",
  "limit": 10,
  "cursor": "string"
}'
```

  </TabItem>

  <TabItem value="js" label="JavaScript">

```javascript
import https from "node:https";

const payload = JSON.stringify({
  "shop_ids": "string",
  "po_numbers": "string",
  "created_at_min": "2025-01-15 10:30:00",
  "created_at_max": "2025-01-15 10:30:00",
  "limit": 10,
  "cursor": "string"
});

const req = https.request("https://api.salesplaypos.com/v1.0/purchase_orders", {
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

url = "https://api.salesplaypos.com/v1.0/purchase_orders"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "shop_ids": "string",
    "po_numbers": "string",
    "created_at_min": "2025-01-15 10:30:00",
    "created_at_max": "2025-01-15 10:30:00",
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
$ch = curl_init("https://api.salesplaypos.com/v1.0/purchase_orders");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"shop_ids": "string", "po_numbers": "string", "created_at_min": "2025-01-15 10:30:00", "created_at_max": "2025-01-15 10:30:00", "limit": 10, "cursor": "string"}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/purchase_orders"))
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
var request = new HttpRequestMessage(new HttpMethod("GET"), "https://api.salesplaypos.com/v1.0/purchase_orders");
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

**200** — Successful response - list of purchase orders retrieved

```json
{
  "purchase_orders": [
    {
      "po_id": "string",
      "shop_id": "string",
      "supplier_id": "string",
      "supplier_code": "string",
      "supplier_name": "string",
      "po_number": "string",
      "po_amount": 0.0,
      "po_date": "string",
      "expected_date": "string",
      "po_status": "TEMPORARY_SAVED",
      "payment_type_id": "string",
      "payment_type_code": "string",
      "payment_type_name": "string",
      "additional_information": "string",
      "items": [
        {
          "product_id": "string",
          "product_code": "string",
          "product_name": "string",
          "measurement": "string",
          "po_qty": 0.0,
          "unit_cost": 0.0,
          "total_unit_cost": 0.0
        }
      ],
      "additional_cost": [
        {
          "cost_name": "string",
          "cost_amount": 0.0
        }
      ]
    }
  ],
  "cursor": "string"
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `purchase_orders` | array[object] | Array of purchase order objects |
| `cursor` | string | Cursor for pagination to retrieve the next set of results. |

<details>
<summary><code>purchase_orders[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `po_id` | string | Encrypted unique identifier for the purchase order |
| `shop_id` | string | Encrypted shop/location identifier |
| `supplier_id` | string | Encrypted supplier identifier |
| `supplier_code` | string | Supplier code |
| `supplier_name` | string | Name of the supplier |
| `po_number` | string | Purchase order number |
| `po_amount` | number (double) | Total purchase order amount |
| `po_date` | string (date) | Purchase order creation date (YYYY-MM-DD) |
| `expected_date` | string (date) | Expected delivery date (YYYY-MM-DD) |
| `po_status` | string<br/>enum: `TEMPORARY_SAVED` \| `PENDING` \| `PARTIALLY_GRN` \| `COMPLETED` \| `CLOSED` | Current status of the purchase order |
| `payment_type_id` | string | Encrypted payment method identifier |
| `payment_type_code` | string | Payment method code (unencrypted) |
| `payment_type_name` | string | Payment method name |
| `additional_information` | string | Additional comments or notes for the purchase order |
| `items` | array[object] | Array of items included in the purchase order |
| `additional_cost` | array[object] | Additional costs associated with the purchase order |

<details>
<summary><code>purchase_orders[].items[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `product_id` | string | Encrypted product identifier |
| `product_code` | string | Product code |
| `product_name` | string | Name of the product |
| `measurement` | string | Unit of measurement |
| `po_qty` | number (double) | Quantity ordered in the purchase order |
| `unit_cost` | number (double) | Cost per unit |
| `total_unit_cost` | number (double) | Total cost for the line item |

</details>

<details>
<summary><code>purchase_orders[].additional_cost[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `cost_name` | string | Name of the additional cost |
| `cost_amount` | number (double) | Amount of the additional cost |

</details>

</details>

  </TabItem>

  <TabItem value="400" label="400">

**400** — Bad request - invalid parameters or cursor

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
| `code` | string<br/>enum: `INVALID_VALUE` \| `INVALID_CURSOR` | Error code indicating the type of validation error |
| `details` | string | Detailed error message |
| `field` | string | The field name that caused the error (if applicable) |

</details>

  </TabItem>

  <TabItem value="401" label="401">

**401** — Unauthorized - invalid or missing authentication token

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
| `code` | string<br/>enum: `UNAUTHORIZED` \| `ACCESS_DENIED` | Error code for authentication or permission issues |
| `details` | string | Detailed error message |

</details>

  </TabItem>

  <TabItem value="429" label="429">

**429** — Rate limited - request quota exceeded

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
| `code` | string<br/>enum: `RATE_LIMITED` | Rate limit exceeded |
| `details` | string | Rate limit error message |

</details>

  </TabItem>

</Tabs>
