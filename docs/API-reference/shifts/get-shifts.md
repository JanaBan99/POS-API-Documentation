---
title: Get Shifts
sidebar_label: Get Shifts
sidebar_position: 1
description: "GET /shifts — list the cashier shifts of SalesPlay POS terminals for a date range (read-only), paginated with a cursor."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get Shifts

**GET /shifts** — list the cashier shifts of SalesPlay POS terminals for a date range (read-only), paginated with a cursor. Send parameters as a JSON request body (`shift_ids`, `pos_device_ids`, `created_at_min`, `created_at_max`, `limit`, `cursor`). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--get">GET</span><code>https://api.salesplaypos.com/v1.0/shifts</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `application/json`

:::info Send filters as a JSON body
This endpoint reads its parameters from the JSON request body — even on `GET`. Query-string parameters are ignored.
:::

| Name | Type | Description |
|---|---|---|
| `shift_ids` | string | Comma-separated list of shift IDs |
| `pos_device_ids` | string | List of pos device keys (comma-separated) |
| `created_at_min` | string (date-time) | Minimum creation date (Y-m-d H:i:s) 24 hours format |
| `created_at_max` | string (date-time) | Maximum creation date (Y-m-d H:i:s) 24 hours format |
| `limit` | integer | Number of shifts to return Default: `10` |
| `cursor` | string | Cursor for pagination |

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/shifts" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "shift_ids": "string",
  "pos_device_ids": "string",
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
  "shift_ids": "string",
  "pos_device_ids": "string",
  "created_at_min": "2025-01-15 10:30:00",
  "created_at_max": "2025-01-15 10:30:00",
  "limit": 10,
  "cursor": "string"
});

const req = https.request("https://api.salesplaypos.com/v1.0/shifts", {
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

url = "https://api.salesplaypos.com/v1.0/shifts"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "shift_ids": "string",
    "pos_device_ids": "string",
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
$ch = curl_init("https://api.salesplaypos.com/v1.0/shifts");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"shift_ids": "string", "pos_device_ids": "string", "created_at_min": "2025-01-15 10:30:00", "created_at_max": "2025-01-15 10:30:00", "limit": 10, "cursor": "string"}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/shifts"))
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
var request = new HttpRequestMessage(new HttpMethod("GET"), "https://api.salesplaypos.com/v1.0/shifts");
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
  "shifts": [
    {
      "id": "string",
      "pos_device_id": "string",
      "opened_at": "2025-01-15 10:30:00",
      "closed_at": "2025-01-15 10:30:00",
      "opened_by_employee": "string",
      "closed_by_employee": "string",
      "starting_cash": 0.0,
      "cash_payments": 0.0,
      "cash_refunds": 0.0,
      "paid_in": 0.0,
      "paid_out": 0.0,
      "expected_cash": 0.0,
      "actual_cash": 0.0,
      "gross_sales": 0.0,
      "refunds": 0.0,
      "discounts": 0.0,
      "net_sales": 0.0,
      "tip": 0.0,
      "surcharge": 0.0,
      "taxes": [
        {
          "tax_id": "string",
          "money_amount": 0.0
        }
      ],
      "payments": [
        {
          "payment_type_id": "string",
          "money_amount": 0.0
        }
      ],
      "cash_movements": [
        {
          "type": "PAY_IN",
          "money_amount": 0.0,
          "comment": "string",
          "employee_id": "string",
          "created_at": "2025-01-15 10:30:00"
        }
      ],
      "shop_id": "string",
      "shift_id": "string"
    }
  ],
  "cursor": "string"
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `shifts` | array[object] |  |
| `cursor` | string | Cursor for pagination |

<details>
<summary><code>shifts[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `id` | string | Unique identifier of the shift |
| `pos_device_id` | string | POS device ID |
| `opened_at` | string (date-time) | Shift opened date and time |
| `closed_at` | string (date-time) | Shift closed date and time |
| `opened_by_employee` | string | Employee ID who opened the shift |
| `closed_by_employee` | string | Employee ID who closed the shift |
| `starting_cash` | number | The initial money amount at the start of the shift |
| `cash_payments` | number | The total money amount of cash payments for the shift |
| `cash_refunds` | number | The total money amount of cash refunds for the shift |
| `paid_in` | number | The money amount added to the cash drawer |
| `paid_out` | number | The money amount removed from the cash drawer (always positive) |
| `expected_cash` | number | The expected money amount at the end of the shift |
| `actual_cash` | number | The actual money amount at the end of the shift |
| `gross_sales` | number | The gross money amount for the shift. Calculated as sum of all payments before discounts but after INCLUDED taxes |
| `refunds` | number | The total money amount of refunds for the shift |
| `discounts` | number | The total money amount of discounts for the shift (always positive) |
| `net_sales` | number | Gross sales minus discounts and refunds |
| `tip` | number | The total money amount of tips for the shift |
| `surcharge` | number | The total money amount of surcharge for the shift |
| `taxes` | array[object] | The list of taxes and it's totals for the shift |
| `payments` | array[object] | The list of total money amounts for every payment type in the shift |
| `cash_movements` | array[object] | The list of shift cash movements |
| `shop_id` | string | Shop ID |
| `shift_id` | string | Shift ID |

<details>
<summary><code>shifts[].taxes[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `tax_id` | string |  |
| `money_amount` | number (float) | The total money amount for the tax in the shift |

</details>

<details>
<summary><code>shifts[].payments[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `payment_type_id` | string |  |
| `money_amount` | number (float) | The total money amount for the payment type |

</details>

<details>
<summary><code>shifts[].cash_movements[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `type` | string | The type of cash movement Example: `PAY_IN` |
| `money_amount` | number (float) | The money amount. The value is always positive. |
| `comment` | string | The description of the cash movement |
| `employee_id` | string | The employee id who made the cash movement |
| `created_at` | string (date-time) | The time when this cash movement was created |

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
