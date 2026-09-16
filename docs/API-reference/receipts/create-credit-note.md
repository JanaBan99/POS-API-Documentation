---
title: Create Credit Note
sidebar_label: Create Credit Note
sidebar_position: 4
description: "POST /credit_note_and_refund — issue a credit note or cash refund against an existing SalesPlay receipt, line by line."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Create Credit Note

**POST /credit_note_and_refund** — issue a credit note or cash refund against an existing SalesPlay receipt, line by line. Send parameters as a JSON request body (`receipt_number`, `shop_id`, `pos_device_id`, `receipt_type`, `transaction_date`, `line_products`). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--post">POST</span><code>https://api.salesplaypos.com/v1.0/credit_note_and_refund</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `application/json`

| Name | Type | Description |
|---|---|---|
| `receipt_number` <span className="api-required">required</span> | string | The receipt number (invoice number). |
| `shop_id` <span className="api-required">required</span> | string | The ID of the shop. |
| `pos_device_id` <span className="api-required">required</span> | string | The ID of the pos key (treminal key). |
| `receipt_type` <span className="api-required">required</span> | string<br/>enum: `CASH_REFUND` \| `CREDIT_NOTE` | Type of the receipt. |
| `transaction_date` <span className="api-required">required</span> | string (date-time) | Date and time of the transaction (YYYY-MM-DD HH:MM:SS). |
| `line_products` <span className="api-required">required</span> | array[object] | List of product line items for the credit note. |

<details>
<summary><code>line_products[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `product_id` <span className="api-required">required</span> | string | The ID of the product. |
| `product_line_no` <span className="api-required">required</span> | string | Line number of the product in the original receipt. |
| `quantity` <span className="api-required">required</span> | string | Quantity being refunded. |
| `comment` | string | Optional comment for the line item. |

</details>

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X POST "https://api.salesplaypos.com/v1.0/credit_note_and_refund" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "receipt_number": "string",
  "shop_id": "string",
  "pos_device_id": "string",
  "receipt_type": "CASH_REFUND",
  "transaction_date": "2025-01-15 10:30:00",
  "line_products": [
    {
      "product_id": "string",
      "product_line_no": "string",
      "quantity": "string",
      "comment": "string"
    }
  ]
}'
```

  </TabItem>

  <TabItem value="js" label="JavaScript">

```javascript
const res = await fetch("https://api.salesplaypos.com/v1.0/credit_note_and_refund", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "receipt_number": "string",
  "shop_id": "string",
  "pos_device_id": "string",
  "receipt_type": "CASH_REFUND",
  "transaction_date": "2025-01-15 10:30:00",
  "line_products": [
    {
      "product_id": "string",
      "product_line_no": "string",
      "quantity": "string",
      "comment": "string"
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

url = "https://api.salesplaypos.com/v1.0/credit_note_and_refund"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "receipt_number": "string",
    "shop_id": "string",
    "pos_device_id": "string",
    "receipt_type": "CASH_REFUND",
    "transaction_date": "2025-01-15 10:30:00",
    "line_products": [
        {
            "product_id": "string",
            "product_line_no": "string",
            "quantity": "string",
            "comment": "string"
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
$ch = curl_init("https://api.salesplaypos.com/v1.0/credit_note_and_refund");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"receipt_number": "string", "shop_id": "string", "pos_device_id": "string", "receipt_type": "CASH_REFUND", "transaction_date": "2025-01-15 10:30:00", "line_products": [{"product_id": "string", "product_line_no": "string", "quantity": "string", "comment": "string"}]}));
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
    .method("POST", HttpRequest.BodyPublishers.ofString(payload))
    .build();

HttpResponse<String> response = client.send(request,
    HttpResponse.BodyHandlers.ofString());
```

  </TabItem>

  <TabItem value="csharp" label="C#">

```csharp
var request = new HttpRequestMessage(new HttpMethod("POST"), "https://api.salesplaypos.com/v1.0/credit_note_and_refund");
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

**200** — Credit note successfully created.

```json
{
  "success": {
    "code": "string",
    "details": "string",
    "reference_number": "string"
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
| `code` | string | Response code indicating success. |
| `details` | string | Description of the result. |
| `reference_number` | string | Unique reference number for the created credit note. |

</details>

  </TabItem>

  <TabItem value="400" label="400">

**400** — Invalid input or missing required fields.

Some endpoints return validation errors with status `401` instead of `400`; check `errors.code`, not just the status.

See [Troubleshooting & Errors](../../guides/errors-guide) for how to handle this response.

```json
{
  "error": {
    "code": "string",
    "details": "string",
    "field": "string"
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
| `code` | string | Error code. |
| `details` | string | Error message describing the issue. |
| `field` | string | Field name where validation failed. |

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
