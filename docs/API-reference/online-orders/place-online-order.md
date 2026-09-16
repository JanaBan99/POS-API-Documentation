---
title: Place Online Order
sidebar_label: Place Online Order
sidebar_position: 1
description: "POST /online_orders — place an order from an external channel (website, delivery app) into the SalesPlay POS of a shop."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Place Online Order

**POST /online_orders** — place an order from an external channel (website, delivery app) into the SalesPlay POS of a shop. Send parameters as a JSON request body (`shop_id`, `order_date`, `order_reference_number`, `order_reference_id`, `order_total`, `channel_order_status_id`, `channel_order_status_name`, `order_comment`, …). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.

The request should include all necessary details to place an order, such as customer information, payment information and items being ordered.

<div className="api-endpoint"><span className="api-badge api-badge--post">POST</span><code>https://api.salesplaypos.com/v1.0/online_orders</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `application/json`

| Name | Type | Description |
|---|---|---|
| `shop_id` | string | Unique identifier for the shop. Example: `string` |
| `order_date` | string (date) | Date when the order was placed. Example: `Y-m-d` |
| `order_reference_number` | string | Reference number for the order. Example: `string` |
| `order_reference_id` | string | Reference ID for the order. Example: `string` |
| `order_total` | number | Total amount for the order. Example: `` |
| `channel_order_status_id` | string | The status ID of the order in the channel should be 0. Example: `` |
| `channel_order_status_name` | string | The status name of the order in the channel should be 'pending'. Example: `string` |
| `order_comment` | string | Comments about the order. Example: `` |
| `table_code` | string | Code of the table if the order is for dine-in. Example: `` |
| `order_type` | string | Type of the order (e.g., Delivery, Dine-in). (Order type must be enabled in the backoffice.) Example: `string` |
| `target_terminal` | string | Identifier for the target terminal where the order is sent. Example: `string` |
| `customer_first_name` | string | First name of the customer. Example: `string` |
| `customer_last_name` | string | Last name of the customer. Example: `string` |
| `customer_phone` | string | Phone number of the customer. Example: `string` |
| `customer_email` | string (email) | Email address of the customer. Example: `string` |
| `order_date_time` | string (date-time) | Date and time when the order details were recorded. Example: `Y-m-d H:i:s` |
| `order_items` | array[object] | List of items in the order. |
| `fixed_charges` | array[object] | List of fixed charges applied to the order. |
| `order_total_discounts` | array[object] | List of total discounts applied to the order. |
| `order_payments` | array[object] | List of payments for the order. |

<details>
<summary><code>order_items[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `product_code` | string | Code for the product. Example: `string` |
| `product_name` | string | Name of the product. Example: `string` |
| `product_qty` | number | Quantity of the product ordered. Example: `1` |
| `product_unit_price` | number | Unit price of the product. Example: `` |
| `product_price` | number | Total price of the product. Example: `` |
| `product_cost` | number | Cost of the product. Example: `` |
| `product_remark` | string | Remarks for the product. Example: `` |
| `product_modifiers` | array[object] | List of modifiers for the product. |
| `product_taxes` | array[object] | List of taxes applied to the product. |
| `product_discounts` | array[object] | List of discounts applied to the product. |

<details>
<summary><code>order_items[].product_modifiers[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `modifier_code` | string | Code for the modifier. Example: `1` |
| `modifier_name` | string | Name of the modifier. Example: `option 1` |
| `modifier_price` | number | Price of the modifier. Example: `` |
| `modifier_cost` | number | Cost of the modifier. Example: `` |
| `modifier_qty` | number | Quantity of the modifier. Example: `1` |
| `product_qty` | number | Quantity of the product that the modifier is applied to. Example: `1` |

</details>

<details>
<summary><code>order_items[].product_taxes[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `tax_code` | string | Code for the tax. Example: `string` |
| `tax_name` | string | Name of the tax. Example: `string` |
| `tax_value_type` | string | Type of the tax value (e.g., Percentage, Value). Example: `Percentage` |
| `tax_rate` | number | Rate of the tax. Example: `` |
| `tax_type` | number | Specify the type of tax. Possible values are 1 for ADDED and 2 for INCLUDED. Example: `1` |
| `tax_amount` | number | Amount of the tax. Example: `` |
| `is_charge` | number | Indicates if the tax is a charge. Example: `` |
| `apply_tax_after_other_taxes` | number | Indicates if the tax should be applied after other taxes. Example: `` |

</details>

<details>
<summary><code>order_items[].product_discounts[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `plan_id` | string | ID of the discount plan. Example: `` |
| `plan_name` | string | Name of the discount plan. Example: `Custom` |
| `discount_type` | string | Type of the discount (e.g., Percentage, Value). Example: `Percentage` |
| `discount_value` | number | Value of the discount. Example: `` |
| `discount_ref` | number | Value/Percentage of discounted. Example: `` |

</details>

</details>

<details>
<summary><code>fixed_charges[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `tax_code` | string | Code for the fixed charge. Example: `string` |
| `tax_name` | string | Name of the fixed charge. Example: `string` |
| `tax_value_type` | string | Specifies the type of the fixed charge value. The only valid value is 'Percentage'. Example: `Percentage` |
| `tax_rate` | number | Rate of the fixed charge. Example: `` |
| `tax_type` | number | Type of the fixed charge (Tax type should be 3). Example: `3` |
| `tax_amount` | number | Amount of the fixed charge. Example: `` |
| `is_charge` | number | Indicates if it is a charge. Example: `1` |
| `apply_tax_after_other_taxes` | number | Indicates if the fixed charge should be applied after other taxes. Example: `` |

</details>

<details>
<summary><code>order_total_discounts[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `plan_id` | string | ID of the discount plan. Example: `` |
| `plan_name` | string | Name of the discount plan. Example: `Custom` |
| `discount_type` | string | Type of the discount (e.g., Percentage, Value). Example: `Percentage` |
| `discount_value` | number | Value of the discount. Example: `` |
| `discount_ref` | number | Value/Percentage of discounted. Example: `` |

</details>

<details>
<summary><code>order_payments[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `payment_type` | string | Type of the payment. Example: `Cash` |
| `payment_amount` | number (float) | Amount of the payment. Example: `` |
| `payment_reference` | string | Reference for the payment. Example: `` |
| `is_advance` | integer | Indicates if it is an advance payment (1 for true, 0 for false). Example: `` |

</details>

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X POST "https://api.salesplaypos.com/v1.0/online_orders" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "shop_id": "string",
  "order_date": "Y-m-d",
  "order_reference_number": "string",
  "order_reference_id": "string",
  "order_total": 0,
  "channel_order_status_id": 0,
  "channel_order_status_name": "string",
  "order_comment": "",
  "table_code": " ",
  "order_type": "string",
  "target_terminal": "string",
  "customer_first_name": "string",
  "customer_last_name": "string",
  "customer_phone": "string",
  "customer_email": "string",
  "order_date_time": "Y-m-d H:i:s",
  "order_items": [
    {
      "product_code": "string",
      "product_name": "string",
      "product_qty": 1,
      "product_unit_price": 0,
      "product_price": 0,
      "product_cost": 0,
      "product_remark": "",
      "product_modifiers": [
        {
          "modifier_code": "1",
          "modifier_name": "option 1",
          "modifier_price": 0,
          "modifier_cost": 0,
          "modifier_qty": 1,
          "product_qty": 1
        }
      ],
      "product_taxes": [
        {
          "tax_code": "string",
          "tax_name": "string",
          "tax_value_type": "Percentage",
          "tax_rate": 0,
          "tax_type": 1,
          "tax_amount": 0,
          "is_charge": 0,
          "apply_tax_after_other_taxes": 0
        }
      ],
      "product_discounts": [
        {
          "plan_id": "",
          "plan_name": "Custom",
          "discount_type": "Percentage",
          "discount_value": 0,
          "discount_ref": 0
        }
      ]
    }
  ],
  "fixed_charges": [
    {
      "tax_code": "string",
      "tax_name": "string",
      "tax_value_type": "Percentage",
      "tax_rate": 0,
      "tax_type": 3,
      "tax_amount": 0,
      "is_charge": 1,
      "apply_tax_after_other_taxes": 0
    }
  ],
  "order_total_discounts": [
    {
      "plan_id": "",
      "plan_name": "Custom",
      "discount_type": "Percentage",
      "discount_value": 0,
      "discount_ref": 0
    }
  ],
  "order_payments": [
    {
      "payment_type": "Cash",
      "payment_amount": "",
      "payment_reference": "",
      "is_advance": 0
    }
  ]
}'
```

  </TabItem>

  <TabItem value="js" label="JavaScript">

```javascript
const res = await fetch("https://api.salesplaypos.com/v1.0/online_orders", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "shop_id": "string",
  "order_date": "Y-m-d",
  "order_reference_number": "string",
  "order_reference_id": "string",
  "order_total": 0,
  "channel_order_status_id": 0,
  "channel_order_status_name": "string",
  "order_comment": "",
  "table_code": " ",
  "order_type": "string",
  "target_terminal": "string",
  "customer_first_name": "string",
  "customer_last_name": "string",
  "customer_phone": "string",
  "customer_email": "string",
  "order_date_time": "Y-m-d H:i:s",
  "order_items": [
    {
      "product_code": "string",
      "product_name": "string",
      "product_qty": 1,
      "product_unit_price": 0,
      "product_price": 0,
      "product_cost": 0,
      "product_remark": "",
      "product_modifiers": [
        {
          "modifier_code": "1",
          "modifier_name": "option 1",
          "modifier_price": 0,
          "modifier_cost": 0,
          "modifier_qty": 1,
          "product_qty": 1
        }
      ],
      "product_taxes": [
        {
          "tax_code": "string",
          "tax_name": "string",
          "tax_value_type": "Percentage",
          "tax_rate": 0,
          "tax_type": 1,
          "tax_amount": 0,
          "is_charge": 0,
          "apply_tax_after_other_taxes": 0
        }
      ],
      "product_discounts": [
        {
          "plan_id": "",
          "plan_name": "Custom",
          "discount_type": "Percentage",
          "discount_value": 0,
          "discount_ref": 0
        }
      ]
    }
  ],
  "fixed_charges": [
    {
      "tax_code": "string",
      "tax_name": "string",
      "tax_value_type": "Percentage",
      "tax_rate": 0,
      "tax_type": 3,
      "tax_amount": 0,
      "is_charge": 1,
      "apply_tax_after_other_taxes": 0
    }
  ],
  "order_total_discounts": [
    {
      "plan_id": "",
      "plan_name": "Custom",
      "discount_type": "Percentage",
      "discount_value": 0,
      "discount_ref": 0
    }
  ],
  "order_payments": [
    {
      "payment_type": "Cash",
      "payment_amount": "",
      "payment_reference": "",
      "is_advance": 0
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

url = "https://api.salesplaypos.com/v1.0/online_orders"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "shop_id": "string",
    "order_date": "Y-m-d",
    "order_reference_number": "string",
    "order_reference_id": "string",
    "order_total": 0,
    "channel_order_status_id": 0,
    "channel_order_status_name": "string",
    "order_comment": "",
    "table_code": " ",
    "order_type": "string",
    "target_terminal": "string",
    "customer_first_name": "string",
    "customer_last_name": "string",
    "customer_phone": "string",
    "customer_email": "string",
    "order_date_time": "Y-m-d H:i:s",
    "order_items": [
        {
            "product_code": "string",
            "product_name": "string",
            "product_qty": 1,
            "product_unit_price": 0,
            "product_price": 0,
            "product_cost": 0,
            "product_remark": "",
            "product_modifiers": [
                {
                    "modifier_code": "1",
                    "modifier_name": "option 1",
                    "modifier_price": 0,
                    "modifier_cost": 0,
                    "modifier_qty": 1,
                    "product_qty": 1
                }
            ],
            "product_taxes": [
                {
                    "tax_code": "string",
                    "tax_name": "string",
                    "tax_value_type": "Percentage",
                    "tax_rate": 0,
                    "tax_type": 1,
                    "tax_amount": 0,
                    "is_charge": 0,
                    "apply_tax_after_other_taxes": 0
                }
            ],
            "product_discounts": [
                {
                    "plan_id": "",
                    "plan_name": "Custom",
                    "discount_type": "Percentage",
                    "discount_value": 0,
                    "discount_ref": 0
                }
            ]
        }
    ],
    "fixed_charges": [
        {
            "tax_code": "string",
            "tax_name": "string",
            "tax_value_type": "Percentage",
            "tax_rate": 0,
            "tax_type": 3,
            "tax_amount": 0,
            "is_charge": 1,
            "apply_tax_after_other_taxes": 0
        }
    ],
    "order_total_discounts": [
        {
            "plan_id": "",
            "plan_name": "Custom",
            "discount_type": "Percentage",
            "discount_value": 0,
            "discount_ref": 0
        }
    ],
    "order_payments": [
        {
            "payment_type": "Cash",
            "payment_amount": "",
            "payment_reference": "",
            "is_advance": 0
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
$ch = curl_init("https://api.salesplaypos.com/v1.0/online_orders");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"shop_id": "string", "order_date": "Y-m-d", "order_reference_number": "string", "order_reference_id": "string", "order_total": 0, "channel_order_status_id": 0, "channel_order_status_name": "string", "order_comment": "", "table_code": " ", "order_type": "string", "target_terminal": "string", "customer_first_name": "string", "customer_last_name": "string", "customer_phone": "string", "customer_email": "string", "order_date_time": "Y-m-d H:i:s", "order_items": [{"product_code": "string", "product_name": "string", "product_qty": 1, "product_unit_price": 0, "product_price": 0, "product_cost": 0, "product_remark": "", "product_modifiers": [{"modifier_code": "1", "modifier_name": "option 1", "modifier_price": 0, "modifier_cost": 0, "modifier_qty": 1, "product_qty": 1}], "product_taxes": [{"tax_code": "string", "tax_name": "string", "tax_value_type": "Percentage", "tax_rate": 0, "tax_type": 1, "tax_amount": 0, "is_charge": 0, "apply_tax_after_other_taxes": 0}], "product_discounts": [{"plan_id": "", "plan_name": "Custom", "discount_type": "Percentage", "discount_value": 0, "discount_ref": 0}]}], "fixed_charges": [{"tax_code": "string", "tax_name": "string", "tax_value_type": "Percentage", "tax_rate": 0, "tax_type": 3, "tax_amount": 0, "is_charge": 1, "apply_tax_after_other_taxes": 0}], "order_total_discounts": [{"plan_id": "", "plan_name": "Custom", "discount_type": "Percentage", "discount_value": 0, "discount_ref": 0}], "order_payments": [{"payment_type": "Cash", "payment_amount": "", "payment_reference": "", "is_advance": 0}]}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/online_orders"))
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
var request = new HttpRequestMessage(new HttpMethod("POST"), "https://api.salesplaypos.com/v1.0/online_orders");
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

**200** — Order placed successfully

```json
{
  "success": {
    "message": "order_place_ok",
    "order_reference_id": "string",
    "order_reference_number": "string",
    "system_unique_id": "string",
    "order_date": "Y-m-d H:i:s"
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
| `message` | string | Success message. Example: `order_place_ok` |
| `order_reference_id` | string | Reference ID of the placed order. Example: `string` |
| `order_reference_number` | string | Reference number of the placed order. Example: `string` |
| `system_unique_id` | string | System-generated unique identifier for the order. Example: `string` |
| `order_date` | string (date-time) | Date and time when the order was placed. Example: `Y-m-d H:i:s` |

</details>

  </TabItem>

  <TabItem value="400" label="400">

**400** — Invalid input

Some endpoints return validation errors with status `401` instead of `400`; check `errors.code`, not just the status.

See [Troubleshooting & Errors](../../guides/errors-guide) for how to handle this response.

```json
{
  "error": {
    "message": "Invalid order data"
  }
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `error` | object |  |

<details>
<summary><code>error</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `message` | string | Error message. Example: `Invalid order data` |

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
