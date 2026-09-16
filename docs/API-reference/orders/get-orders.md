---
title: Get Orders
sidebar_label: Get Orders
sidebar_position: 1
description: "GET /orders — list the orders placed through the SalesPlay POS in a shop for a date range (read-only), paginated with a cursor."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get Orders

**GET /orders** — list the orders placed through the SalesPlay POS in a shop for a date range (read-only), paginated with a cursor. Send parameters as a JSON request body (`order_numbers`, `shop_id`, `created_at_min`, `created_at_max`, `limit`, `cursor`). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--get">GET</span><code>https://api.salesplaypos.com/v1.0/orders</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `application/json`

:::info Send filters as a JSON body
This endpoint reads its parameters from the JSON request body — even on `GET`. Query-string parameters are ignored.
:::

| Name | Type | Description |
|---|---|---|
| `order_numbers` | string | Return only orders specified by a comma-separated list of order numbers |
| `shop_id` | string | Show orders only for the specified shop |
| `created_at_min` <span className="api-required">required</span> | string (date-time) | Show resources created after date (Y-m-d H:i:s) 24 hours format Required. |
| `created_at_max` <span className="api-required">required</span> | string (date-time) | Show resources created before date (Y-m-d H:i:s) 24 hours format Required. |
| `limit` | integer | Limit the number of results (optional) Default: `10` |
| `cursor` | string | Cursor for pagination (optional) |

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/orders" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "order_numbers": "string",
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
  "order_numbers": "string",
  "shop_id": "string",
  "created_at_min": "2025-01-15 10:30:00",
  "created_at_max": "2025-01-15 10:30:00",
  "limit": 10,
  "cursor": "string"
});

const req = https.request("https://api.salesplaypos.com/v1.0/orders", {
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

url = "https://api.salesplaypos.com/v1.0/orders"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "order_numbers": "string",
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
$ch = curl_init("https://api.salesplaypos.com/v1.0/orders");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"order_numbers": "string", "shop_id": "string", "created_at_min": "2025-01-15 10:30:00", "created_at_max": "2025-01-15 10:30:00", "limit": 10, "cursor": "string"}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/orders"))
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
var request = new HttpRequestMessage(new HttpMethod("GET"), "https://api.salesplaypos.com/v1.0/orders");
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

**200** — Successful response containing order details

```json
{
  "orders": [
    {
      "order_number": "string",
      "order_date": "string",
      "order_time": "string",
      "order_date_time": "2025-01-15 10:30:00",
      "total_money": 0.0,
      "customer_id": "string",
      "total_discount": 0.0,
      "total_discounts": [
        {
          "plan_id": "string",
          "plan_name": "string",
          "discount_type": "string",
          "discount_value": 0.0,
          "money_amount": 0.0
        }
      ],
      "employee_id": "string",
      "shop_id": "string",
      "pos_device_id": "string",
      "order_type": "string",
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
          "line_discounts": [
            {
              "plan_id": "string",
              "plan_name": "string",
              "discount_type": "string",
              "discount_value": 0.0,
              "money_amount": 0.0
            }
          ],
          "line_taxes": [
            {
              "id": "string",
              "tax_code": "string",
              "money_amount": "string",
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
          "paid_at": "2025-01-15 10:30:00",
          "is_advance": 0
        }
      ],
      "order_status": "string",
      "order_delete_status": true,
      "order_delete_date_time": "2025-01-15 10:30:00"
    }
  ],
  "cursor": "string"
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `orders` | array[object] |  |
| `cursor` | string | Pagination cursor. Send it back in the next request to fetch the following page; absent on the last page. |

<details>
<summary><code>orders[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `order_number` | string | Unique order number |
| `order_date` | string (date) | Date of the order |
| `order_time` | string (time) | Time of the order |
| `order_date_time` | string (date-time) | Date and time of the order |
| `total_money` | number | Total amount of the order |
| `customer_id` | string | ID of the customer |
| `total_discount` | number | Total discount applied |
| `total_discounts` | array[object] |  |
| `employee_id` | string | ID of the employee |
| `shop_id` | string | ID of the shop |
| `pos_device_id` | string | ID of the point-of-sale device |
| `order_type` | string | Type of order |
| `note` | string | Additional notes for the order |
| `total_tax` | number (float) | Total tax applied |
| `total_charge` | number (float) | Total charge |
| `line_products` | array[object] | The line products included in the receipt |
| `payments` | array[object] |  |
| `order_status` | string | Status of the order (PENDING/COMPLETED/DELETED) |
| `order_delete_status` | boolean | Status of order deletion |
| `order_delete_date_time` | string (date-time) | Date and time of order deletion |

<details>
<summary><code>orders[].total_discounts[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `plan_id` | string | The plan id |
| `plan_name` | string | The plan name |
| `discount_type` | string | The type of the applied discount |
| `discount_value` | number | The discount value |
| `money_amount` | number | The total money amount of this discount for the order. |

</details>

<details>
<summary><code>orders[].line_products[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `product_id` | string | The product id for this line product |
| `product_code` | string | The product code |
| `quantity` | number | The number of products that were purchased (or refunded in case of refund) |
| `price` | number | The price of the one product. |
| `gross_total_money` | number | The total money amount for this line product |
| `total_discount` | number | The total discount amount applied to the line product |
| `total_money` | number | The total money amount for this line product after applying discounts and all taxes for this line item |
| `cost` | number | The cost of the single item at the moment of transaction |
| `cost_total` | number | The total cost for this line item at the moment of transaction |
| `line_note` | string | The line product note |
| `line_discounts` | array[object] | The list of discounts applied to the line product |
| `line_taxes` | array[object] | The money amount of this tax for the line item |
| `line_modifiers` | array[object] | The list of modifiers applied to the line item |

<details>
<summary><code>orders[].line_products[].line_discounts[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `plan_id` | string | The plan id |
| `plan_name` | string | The plan name |
| `discount_type` | string | The discount type |
| `discount_value` | number | The discount value |
| `money_amount` | number | The money amount of this discount for the line product. |

</details>

<details>
<summary><code>orders[].line_products[].line_taxes[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `id` | string | TThe tax id |
| `tax_code` | string | The tax code |
| `money_amount` | string | Money amount |
| `rate` | number | The rate of the tax |

</details>

<details>
<summary><code>orders[].line_products[].line_modifiers[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `id` | string | The modifier id |
| `modifier_code` | string | The modifier code |
| `quantity` | number | The quantity |
| `money_amount` | number | The total money amount of the modifier applied to the line product |

</details>

</details>

<details>
<summary><code>orders[].payments[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `payment_type_id` | string | Payment type ID |
| `payment_type` | string | Payment type |
| `money_amount` | number | Money amount |
| `paid_at` | string (date-time) | Payment timestamp |
| `is_advance` | integer | Indicates it's an advance payment (1 for advance payment) |

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
