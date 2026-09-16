---
title: Get Receipts
sidebar_label: Get Receipts
sidebar_position: 1
description: "GET /receipts — list the sales receipts (invoices) of a SalesPlay shop for a date range, paginated with a cursor."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get Receipts

**GET /receipts** — list the sales receipts (invoices) of a SalesPlay shop for a date range, paginated with a cursor. Send parameters as a JSON request body (`receipt_numbers`, `shop_id`, `created_at_min`, `created_at_max`, `limit`, `cursor`). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--get">GET</span><code>https://api.salesplaypos.com/v1.0/receipts</code></div>

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
| `limit` | integer | Maximum number of receipts to return Default: `10` |
| `cursor` | string | Cursor for pagination |

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/receipts" \
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

const req = https.request("https://api.salesplaypos.com/v1.0/receipts", {
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

url = "https://api.salesplaypos.com/v1.0/receipts"
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
$ch = curl_init("https://api.salesplaypos.com/v1.0/receipts");
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/receipts"))
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
var request = new HttpRequestMessage(new HttpMethod("GET"), "https://api.salesplaypos.com/v1.0/receipts");
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

**200** — successful operation

```json
{
  "receipts": [
    {
      "receipt_number": "1-2207203",
      "receipt_type": "SALE",
      "refund_for": null,
      "order_reference_id": "",
      "order_reference_number": "",
      "receipt_date": "2022-07-20",
      "receipt_time": "5:21 PM",
      "receipt_date_time": "2022-07-20 17:21:26",
      "total_money": "600.00",
      "customer_id": "1000",
      "total_discount": "0.00",
      "total_discounts": [
        {
          "plan_id": "",
          "plan_name": "Custom",
          "discount_type": "Percentage",
          "discount_value": "",
          "money_amount": ""
        }
      ],
      "employee_id": "d3BXNFo1VC9oRGtlTzNQYnpXQzdMUT09",
      "cashier_name": "John Doe",
      "shop_id": "QUV4bFFxc0dvcm5UZzRKakRobnpQZz09",
      "pos_device_id": "WnB3L2w0UHl4K2U2Rk1iZWFpSE55dz09",
      "order_type": "",
      "order_number": "",
      "kot_reference_number": "",
      "note": "",
      "total_tax": 0,
      "total_charge": 0,
      "line_products": [
        {
          "product_id": "eEFGdG9QL3lUV0hqRVMvd2lGaWZCZz09",
          "product_code": "10030",
          "quantity": "1",
          "price": 600.0,
          "gross_total_money": 600.0,
          "total_discount": 0,
          "total_money": 600.0,
          "cost": 0,
          "cost_total": 0,
          "line_note": "",
          "line_discounts": [
            {
              "plan_id": "",
              "plan_name": "Custom",
              "discount_type": "Percentage",
              "discount_value": 0,
              "money_amount": 0
            }
          ],
          "line_taxes": [
            {
              "id": "azlpMTFuYUk2NFVnai9qRG11S0Z2dz09",
              "tax_code": "ENV",
              "money_amount": "",
              "rate": ""
            },
            {
              "id": "QzFxbFpRYVpnQkM4Q1cxaFI0aDRqdz09",
              "tax_code": "VAT",
              "money_amount": "",
              "rate": ""
            }
          ],
          "line_modifiers": [
            {
              "id": "T20yMFgvQmthWVZkK0E5RjVnQkVPdz09",
              "modifier_code": "",
              "quantity": "",
              "money_amount": ""
            }
          ]
        }
      ],
      "payments": [
        {
          "payment_type_id": "TldVZ1lzSnVUejBPRjN5RVVkWnAxdz09",
          "payment_type": "Cash",
          "money_amount": 600.0,
          "paid_at": "2022-07-20 17:21:26"
        }
      ],
      "receipt_delete_status": false
    }
  ]
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `receipts` | array[object] | Array of receipts |
| `cursor` | string | Pagination cursor. Send it back in the next request to fetch the following page; absent on the last page. |

<details>
<summary><code>receipts[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `receipt_number` | string | The internal identifier for the receipt. It is unique. |
| `receipt_type` | string | Type of receipt (SALE) |
| `refund_for` | string | Reference to the original receipt if it's a refund |
| `order_reference_id` | string | Order reference id |
| `order_reference_number` | string | Order reference number |
| `receipt_date` | string (date) | The receipt date |
| `receipt_time` | string (time) | The receipt time |
| `receipt_date_time` | string (date-time) | The receipt date and time |
| `total_money` | number | The total money amount paid by customer (or returned to customer in case of refund). The value includes discounts, taxes, surcharges and tips. |
| `customer_id` | string | The customer id associated with the receipt |
| `customer` | array[object] | Customer details |
| `total_discount` | number | The total amount of all discounts applied in the receipt |
| `total_discounts` | array[object] | The list of discounts and it's amounts applied to the receipt |
| `employee_id` | string | The employee id |
| `shop_id` | string | The shop id |
| `pos_device_id` | string | The POS device id |
| `order_type` | string | The order type |
| `order_number` | string | the order number |
| `note` | string | The receipt's note |
| `total_tax` | number | The total amount of all taxes (VAT and sales tax) applied in the receipt |
| `total_charge` | number | The total charges |
| `line_products` | array[object] | The line products included in the receipt |
| `payments` | array[object] |  |
| `receipt_delete_status` | boolean | Receipt delete status |
| `receipt_delete_date_time` | string (date-time) | Receipt delete date and time |
| `cashier_name` | string | The cashier name of the receipt |
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
<summary><code>receipts[].total_discounts[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `plan_id` | string | The plan id |
| `plan_name` | string | The plan name |
| `discount_type` | string | The type of the applied discount |
| `discount_value` | number | The discount value |
| `money_amount` | number | The total money amount of this discount for the receipt. |

</details>

<details>
<summary><code>receipts[].line_products[]</code> — child attributes</summary>

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
<summary><code>receipts[].line_products[].line_discounts[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `plan_id` | string | The plan id |
| `plan_name` | string | The plan name |
| `discount_type` | string | The discount type |
| `discount_value` | number | The discount value |
| `money_amount` | number | The money amount of this discount for the line product. |

</details>

<details>
<summary><code>receipts[].line_products[].line_taxes[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `id` | string | TThe tax id |
| `tax_code` | string | The tax code |
| `money_amount` | number | Money amount |
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
