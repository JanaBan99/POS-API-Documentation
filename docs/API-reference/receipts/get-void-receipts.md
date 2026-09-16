---
title: Get Void Receipts
sidebar_label: Get Void Receipts
sidebar_position: 2
description: "GET /void_receipts — list the voided receipts of a SalesPlay shop for a date range, paginated with a cursor."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get Void Receipts

**GET /void_receipts** — list the voided receipts of a SalesPlay shop for a date range, paginated with a cursor. Send parameters as a JSON request body (`receipt_numbers`, `shop_id`, `created_at_min`, `created_at_max`, `limit`, `cursor`). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--get">GET</span><code>https://api.salesplaypos.com/v1.0/void_receipts</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `application/json`

:::info Send filters as a JSON body
This endpoint reads its parameters from the JSON request body — even on `GET`. Query-string parameters are ignored.
:::

| Name | Type | Description |
|---|---|---|
| `receipt_numbers` | string | Return only receipts specified by a comma-separated list of receipt numbers |
| `shop_id` | string | Show receipts only for the specified shop |
| `created_at_min` <span className="api-required">required</span> | string (date-time) | Show resources created after date (Y-m-d H:i:s) 24 hours format Required. |
| `created_at_max` <span className="api-required">required</span> | string (date-time) | Show resources created before date (Y-m-d H:i:s) 24 hours format Required. |
| `limit` | integer | Maximum number of void receipts to return Default: `10` |
| `cursor` | string | Cursor for pagination |

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/void_receipts" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "receipt_numbers": "string",
  "shop_id": "string",
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
  "receipt_numbers": "string",
  "shop_id": "string",
  "created_at_min": "2025-01-15 10:30:00",
  "created_at_max": "2025-01-15 10:30:00",
  "limit": 10,
  "cursor": "string"
});

const req = https.request("https://api.salesplaypos.com/v1.0/void_receipts", {
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

url = "https://api.salesplaypos.com/v1.0/void_receipts"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "receipt_numbers": "string",
    "shop_id": "string",
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
$ch = curl_init("https://api.salesplaypos.com/v1.0/void_receipts");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"receipt_numbers": "string", "shop_id": "string", "created_at_min": "2025-01-15 10:30:00", "created_at_max": "2025-01-15 10:30:00", "limit": 10, "cursor": "string"}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/void_receipts"))
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
var request = new HttpRequestMessage(new HttpMethod("GET"), "https://api.salesplaypos.com/v1.0/void_receipts");
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

**200** — Successful response

```json
{
  "receipts": [
    {
      "receipt_number": "string",
      "receipt_date": "string",
      "receipt_time": "string",
      "receipt_date_time": "2025-01-15 10:30:00",
      "total_money": 0.0,
      "customer_id": "string",
      "customer": [
        {
          "id": "string",
          "customer_code": "string",
          "name": "string",
          "email": "string",
          "phone_number": "string",
          "address": "string",
          "city": "string",
          "region": "string",
          "postal_code": "string",
          "country_code": "string",
          "vat_number": "string",
          "tin_number": "string",
          "business_registration_number": "string",
          "customer_id_type_code": "string",
          "customer_id_type_name": "string",
          "customer_id_number": "string",
          "description": "string"
        }
      ],
      "total_discount": 0.0,
      "employee_id": "string",
      "shop_id": "string",
      "pos_device_id": "string",
      "order_type": "string",
      "order_number": "string",
      "note": "string",
      "total_tax": 0.0,
      "total_charge": 0.0,
      "line_products": [
        {
          "product_id": "string",
          "product_code": "string",
          "quantity": 0.0,
          "price": 0.0,
          "gross_total_money": 0.0,
          "total_discount": 0.0,
          "total_money": 0.0,
          "cost": 0.0,
          "cost_total": 0.0,
          "line_note": "string",
          "line_taxes": [
            {
              "id": "string",
              "tax_code": "string",
              "money_amount": 0.0,
              "rate": 0.0
            }
          ],
          "line_modifiers": [
            {
              "id": "string",
              "modifier_code": "string",
              "quantity": 0.0,
              "money_amount": 0.0
            }
          ]
        }
      ],
      "payments": [
        {
          "payment_type_id": "string",
          "payment_type": "string",
          "money_amount": 0.0,
          "paid_at": "2025-01-15 10:30:00"
        }
      ],
      "receipt_delete_status": true,
      "receipt_delete_date_time": "2025-01-15 10:30:00",
      "deleted_by": "string",
      "deleted_date": "2025-01-15 10:30:00",
      "cashier_name": "string",
      "kot_reference_number": "string"
    }
  ],
  "cursor": "string"
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `receipts` | array[object] |  |
| `cursor` | string | Cursor for pagination |

<details>
<summary><code>receipts[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `receipt_number` | string | The internal identifier for the receipt. It is unique. |
| `receipt_date` | string (date) | The date of the receipt |
| `receipt_time` | string (time) | The time of the receipt |
| `receipt_date_time` | string (date-time) | The date and time of the receipt |
| `total_money` | number | The total amount of the receipt |
| `customer_id` | string | The ID of the customer |
| `customer` | array[object] | Customer details |
| `total_discount` | number | The total discount |
| `employee_id` | string | The ID of the employee |
| `shop_id` | string | The ID of the shop |
| `pos_device_id` | string | The ID of the POS device |
| `order_type` | string | The type of order |
| `order_number` | string | The order number |
| `note` | string | Any notes related to the receipt |
| `total_tax` | number | The total tax amount |
| `total_charge` | number | The total charge |
| `line_products` | array[object] |  |
| `payments` | array[object] |  |
| `receipt_delete_status` | boolean | The status of receipt deletion |
| `receipt_delete_date_time` | string (date-time) | The date and time of receipt deletion |
| `deleted_by` | string | The email of the user who deleted the receipt |
| `deleted_date` | string (date-time) | The date of receipt deletion |
| `cashier_name` | string | The name of the cashier |
| `kot_reference_number` | string | The KOT reference number |

<details>
<summary><code>receipts[].customer[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `id` | string | Customer ID |
| `customer_code` | string | Customer reference code |
| `name` | string | Customer name |
| `email` | string | Customer email |
| `phone_number` | string | Customer phone number |
| `address` | string | Customer address |
| `city` | string | Customer city |
| `region` | string | Customer region |
| `postal_code` | string | Postal code |
| `country_code` | string | ISO country code |
| `vat_number` | string | VAT number |
| `tin_number` | string | TIN number |
| `business_registration_number` | string | Business registration number |
| `customer_id_type_code` | string | Customer ID type code |
| `customer_id_type_name` | string | Customer ID type name |
| `customer_id_number` | string | Customer ID number |
| `description` | string | Notes or comments |

</details>

<details>
<summary><code>receipts[].line_products[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `product_id` | string | The ID of the product |
| `product_code` | string | The code of the product |
| `quantity` | number | The quantity of the product |
| `price` | number | The price of the product |
| `gross_total_money` | number | The gross total amount of the product |
| `total_discount` | number | The total discount |
| `total_money` | number | The total amount of the product |
| `cost` | number | The cost of the product |
| `cost_total` | number | The total cost |
| `line_note` | string | Any notes related to the product |
| `line_taxes` | array[object] |  |
| `line_modifiers` | array[object] | The list of modifiers applied to the line item |

<details>
<summary><code>receipts[].line_products[].line_taxes[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `id` | string | The ID of the tax |
| `tax_code` | string | The code of the tax |
| `money_amount` | number | The amount of money for the tax |
| `rate` | number | The rate of the tax |

</details>

<details>
<summary><code>receipts[].line_products[].line_modifiers[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `id` | string | The modifier id |
| `modifier_code` | string | The modifier code |
| `quantity` | number | The quantity |
| `money_amount` | number | The total money amount of the modifier applied to the line product |

</details>

</details>

<details>
<summary><code>receipts[].payments[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `payment_type_id` | string | The ID of the payment type |
| `payment_type` | string | The type of payment |
| `money_amount` | number | The amount of money for the payment |
| `paid_at` | string (date-time) | The time of payment |

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
