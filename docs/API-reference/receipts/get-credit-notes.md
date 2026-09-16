---
title: Get Credit Notes
sidebar_label: Get Credit Notes
sidebar_position: 3
description: "GET /credit_note_and_refund — list the credit notes and cash refunds of a SalesPlay shop for a date range, paginated with a cursor."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get Credit Notes

**GET /credit_note_and_refund** — list the credit notes and cash refunds of a SalesPlay shop for a date range, paginated with a cursor. Send parameters as a JSON request body (`receipt_numbers`, `shop_id`, `created_at_min`, `created_at_max`, `limit`, `cursor`). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--get">GET</span><code>https://api.salesplaypos.com/v1.0/credit_note_and_refund</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `application/json`

:::info Send filters as a JSON body
This endpoint reads its parameters from the JSON request body — even on `GET`. Query-string parameters are ignored.
:::

| Name | Type | Description |
|---|---|---|
| `receipt_numbers` | string | Comma-separated list of receipt numbers |
| `shop_id` | string | Show receipts only for the specified shop |
| `created_at_min` <span className="api-required">required</span> | string (date-time) | Show resources created after date (Y-m-d H:i:s) 24 hours format Required. |
| `created_at_max` <span className="api-required">required</span> | string (date-time) | Show resources created before date (Y-m-d H:i:s) 24 hours format Required. |
| `limit` | string | Limit the number of results returned |
| `cursor` | string | Cursor for pagination |

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/credit_note_and_refund" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "receipt_numbers": "string",
  "shop_id": "string",
  "created_at_min": "2025-01-15 10:30:00",
  "created_at_max": "2025-01-15 10:30:00",
  "limit": "string",
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
  "limit": "string",
  "cursor": "string"
});

const req = https.request("https://api.salesplaypos.com/v1.0/credit_note_and_refund", {
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

url = "https://api.salesplaypos.com/v1.0/credit_note_and_refund"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "receipt_numbers": "string",
    "shop_id": "string",
    "created_at_min": "2025-01-15 10:30:00",
    "created_at_max": "2025-01-15 10:30:00",
    "limit": "string",
    "cursor": "string"
}
res = requests.get(url, json=payload, headers=headers)
print(res.json())
```

  </TabItem>

  <TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init("https://api.salesplaypos.com/v1.0/credit_note_and_refund");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"receipt_numbers": "string", "shop_id": "string", "created_at_min": "2025-01-15 10:30:00", "created_at_max": "2025-01-15 10:30:00", "limit": "string", "cursor": "string"}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/credit_note_and_refund"))
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
var request = new HttpRequestMessage(new HttpMethod("GET"), "https://api.salesplaypos.com/v1.0/credit_note_and_refund");
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
      "receipt_type": "string",
      "refund_for": "string",
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
      "order_number": "string",
      "note": "string",
      "total_tax": 0.0,
      "total_charge": 0.0,
      "line_products": [
        {
          "product_id": "string",
          "product_code": "string",
          "product_name": "string",
          "category_id": "string",
          "category_name": "string",
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
              "tax_name": "string",
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
          "paid_at": "2025-01-15 10:30:00",
          "is_advance": 0
        }
      ],
      "receipt_delete_status": true,
      "receipt_delete_date_time": "2025-01-15 10:30:00"
    }
  ],
  "cursor": "string"
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `receipts` | array[object] | List of receipts |
| `cursor` | string | Cursor for pagination |

<details>
<summary><code>receipts[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `receipt_number` | string | Unique receipt identifier |
| `receipt_type` | string | Type of receipt (CASH_REFUND/CREDIT_NOTE) |
| `refund_for` | string | Reference to the original receipt if it's a refund |
| `receipt_date` | string (date) | Date of the receipt |
| `receipt_time` | string | Time the receipt was issued |
| `receipt_date_time` | string (date-time) | Full date and time of the receipt |
| `total_money` | number | Total amount for the receipt |
| `customer_id` | string | ID of the customer |
| `customer` | array[object] | Customer details |
| `total_discount` | number | Total discount applied |
| `total_discounts` | array[object] | Detailed list of applied discount plans |
| `employee_id` | string | ID of the employee handling the transaction |
| `shop_id` | string | Shop where the transaction occurred |
| `pos_device_id` | string | ID of the POS device |
| `order_type` | string | Type of order |
| `order_number` | string | Related order number |
| `note` | string | Additional notes |
| `total_tax` | number | Total tax amount |
| `total_charge` | number | Total additional charges |
| `line_products` | array[object] | Products included in the receipt |
| `payments` | array[object] | List of payments for this receipt |
| `receipt_delete_status` | boolean | Whether the receipt was deleted |
| `receipt_delete_date_time` | string (date-time) | Deletion timestamp if deleted |

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
| `plan_id` | string | Discount plan ID |
| `plan_name` | string | Name of the discount plan |
| `discount_type` | string | Type of discount (e.g., Percentage) |
| `discount_value` | number | Value of the discount |
| `money_amount` | number | Discounted money amount |

</details>

<details>
<summary><code>receipts[].line_products[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `product_id` | string | ID of the product |
| `product_code` | string | Product code |
| `product_name` | string | Name of the product |
| `category_id` | string | ID of the product category |
| `category_name` | string | Name of the product category |
| `quantity` | number | Quantity sold |
| `price` | number | Unit price |
| `gross_total_money` | number | Gross total amount before discounts |
| `total_discount` | number | Total discount on the line item |
| `total_money` | number | Total after discounts and tax |
| `cost` | number | Unit cost of the product |
| `cost_total` | number | Total cost for the line |
| `line_note` | string | Note for the line item |
| `line_discounts` | array[object] | Discounts applied to this line item |
| `line_taxes` | array[object] | Taxes applied to this line item |
| `line_modifiers` | array[object] | Modifiers applied to the line item |

<details>
<summary><code>receipts[].line_products[].line_discounts[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `plan_id` | string | Discount plan ID |
| `plan_name` | string | Name of the discount plan |
| `discount_type` | string | Type of discount |
| `discount_value` | number | Discount value |
| `money_amount` | number | Discounted amount |

</details>

<details>
<summary><code>receipts[].line_products[].line_taxes[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `id` | string | Tax ID |
| `tax_code` | string | Tax code |
| `tax_name` | string | Name of the tax |
| `money_amount` | number | Taxed money amount |
| `rate` | number | Tax rate |

</details>

<details>
<summary><code>receipts[].line_products[].line_modifiers[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `id` | string | Modifier ID |
| `modifier_code` | string | Modifier code |
| `quantity` | number | Quantity of modifier applied |
| `money_amount` | number | Modifier cost |

</details>

</details>

<details>
<summary><code>receipts[].payments[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `payment_type_id` | string | ID of the payment method |
| `payment_type` | string | Payment method used |
| `money_amount` | number | Amount paid |
| `paid_at` | string (date-time) | Timestamp of payment |
| `is_advance` | integer | Whether this is an advance payment (0 or 1) |

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
