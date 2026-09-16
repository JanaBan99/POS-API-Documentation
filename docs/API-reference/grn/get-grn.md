---
title: Get Goods Received Notes
sidebar_label: Get Goods Received Notes
sidebar_position: 1
description: "GET /grn — list the Goods Received Notes (incoming stock) of a SalesPlay shop, filtered by number, status or date."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get Goods Received Notes

**GET /grn** — list the Goods Received Notes (incoming stock) of a SalesPlay shop, filtered by number, status or date. Send parameters as a JSON request body (`shop_ids`, `grn_numbers`, `grn_status`, `created_at_min`, `created_at_max`, `limit`, `cursor`). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--get">GET</span><code>https://api.salesplaypos.com/v1.0/grn</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `application/json`

:::info Send filters as a JSON body
This endpoint reads its parameters from the JSON request body — even on `GET`. Query-string parameters are ignored.
:::

| Name | Type | Description |
|---|---|---|
| `shop_ids` | string | Comma-separated list of shop IDs |
| `grn_numbers` | string | Comma-separated list of GRN numbers to filter |
| `grn_status` | string | Status of the GRN to filter |
| `created_at_min` | string | Minimum created date (Y-m-d H:i:s) 24 hours format |
| `created_at_max` | string | Maximum created date (Y-m-d H:i:s) 24 hours format |
| `limit` | integer | Maximum number of results to return Default: `10` |
| `cursor` | string | Cursor for pagination |

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/grn" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "shop_ids": "string",
  "grn_numbers": "string",
  "grn_status": "string",
  "created_at_min": "string",
  "created_at_max": "string",
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
  "grn_numbers": "string",
  "grn_status": "string",
  "created_at_min": "string",
  "created_at_max": "string",
  "limit": 10,
  "cursor": "string"
});

const req = https.request("https://api.salesplaypos.com/v1.0/grn", {
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

url = "https://api.salesplaypos.com/v1.0/grn"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "shop_ids": "string",
    "grn_numbers": "string",
    "grn_status": "string",
    "created_at_min": "string",
    "created_at_max": "string",
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
$ch = curl_init("https://api.salesplaypos.com/v1.0/grn");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"shop_ids": "string", "grn_numbers": "string", "grn_status": "string", "created_at_min": "string", "created_at_max": "string", "limit": 10, "cursor": "string"}));
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
    .method("GET", HttpRequest.BodyPublishers.ofString(payload))
    .build();

HttpResponse<String> response = client.send(request,
    HttpResponse.BodyHandlers.ofString());
```

  </TabItem>

  <TabItem value="csharp" label="C#">

```csharp
var request = new HttpRequestMessage(new HttpMethod("GET"), "https://api.salesplaypos.com/v1.0/grn");
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

**200** — GRN list retrieved successfully

```json
{
  "grn_list": [
    {
      "grn_id": "string",
      "shop_id": "string",
      "supplier_id": "string",
      "supplier_code": "string",
      "supplier_name": "string",
      "supplier_invoice_no": "string",
      "grn_number": "string",
      "grn_amount": "string",
      "grn_date": "string",
      "grn_status": "TEMPORATY_SAVED",
      "grn_type": "DIRECT GRN",
      "po_number": "string",
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
          "grn_qty": "string",
          "unit_cost": "string",
          "total_unit_cost": "string",
          "expire_date": "string"
        }
      ],
      "additional_cost": [
        {
          "cost_name": "string",
          "cost_amount": "string"
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
| `grn_list` | array[object] |  |
| `cursor` | string | Cursor for pagination |

<details>
<summary><code>grn_list[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `grn_id` | string | Unique identifier for the GRN. |
| `shop_id` | string | Identifier of the shop. |
| `supplier_id` | string | Identifier of the supplier. |
| `supplier_code` | string | Code of the supplier. |
| `supplier_name` | string | Name of the supplier. |
| `supplier_invoice_no` | string | Invoice number from the supplier. |
| `grn_number` | string | Number assigned to the GRN. |
| `grn_amount` | string | Total amount for the GRN. |
| `grn_date` | string | Date of the GRN. |
| `grn_status` | string<br/>enum: `TEMPORATY_SAVED` \| `COMPLETED` \| `CLOSED` | Status of the GRN. |
| `grn_type` | string<br/>enum: `DIRECT GRN` \| `PO BASED` | GRN type name . |
| `po_number` | string | Associated purchase order number, if any. |
| `payment_type_id` | string | Identifier of the payment method used for the GRN. |
| `payment_type_code` | string | Code of the payment method used for the GRN. |
| `payment_type_name` | string | Name of the payment method used for the GRN. |
| `additional_information` | string | Additional information or comments about the GRN. |
| `items` | array[object] |  |
| `additional_cost` | array[object] |  |

<details>
<summary><code>grn_list[].items[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `product_id` | string | Identifier of the product. |
| `product_code` | string | Code of the product. |
| `product_name` | string | Name of the product. |
| `measurement` | string | Measurement unit or variant. |
| `grn_qty` | string | Quantity received. |
| `unit_cost` | string | Cost per unit. |
| `total_unit_cost` | string | Total cost for this item. |
| `expire_date` | string | Expiry date for the product. |

</details>

<details>
<summary><code>grn_list[].additional_cost[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `cost_name` | string | Name of the additional cost. |
| `cost_amount` | string | Amount of the additional cost. |

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
