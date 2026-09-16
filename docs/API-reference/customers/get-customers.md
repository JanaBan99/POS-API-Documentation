---
title: Get Customers
sidebar_label: Get Customers
sidebar_position: 1
description: "GET /customers — list the customers in a SalesPlay account, filtered by ID or date, paginated with a cursor."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get Customers

**GET /customers** — list the customers in a SalesPlay account, filtered by ID or date, paginated with a cursor. Send parameters as a JSON request body (`customer_ids`, `email`, `created_at_min`, `created_at_max`, `limit`, `cursor`). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--get">GET</span><code>https://api.salesplaypos.com/v1.0/customers</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `application/json`

:::info Send filters as a JSON body
This endpoint reads its parameters from the JSON request body — even on `GET`. Query-string parameters are ignored.
:::

| Name | Type | Description |
|---|---|---|
| `customer_ids` | string | Comma-separated list of customer IDs |
| `email` | string | Filter customers by email |
| `created_at_min` | string (date-time) | Minimum creation date (Y-m-d H:i:s) 24 hours format |
| `created_at_max` | string (date-time) | Maximum creation date (Y-m-d H:i:s) 24 hours format |
| `limit` | integer | Number of customers to return Default: `10` |
| `cursor` | string | Cursor for pagination |

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/customers" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "customer_ids": "string",
  "email": "string",
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
  "customer_ids": "string",
  "email": "string",
  "created_at_min": "2025-01-15 10:30:00",
  "created_at_max": "2025-01-15 10:30:00",
  "limit": 10,
  "cursor": "string"
});

const req = https.request("https://api.salesplaypos.com/v1.0/customers", {
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

url = "https://api.salesplaypos.com/v1.0/customers"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "customer_ids": "string",
    "email": "string",
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
$ch = curl_init("https://api.salesplaypos.com/v1.0/customers");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"customer_ids": "string", "email": "string", "created_at_min": "2025-01-15 10:30:00", "created_at_max": "2025-01-15 10:30:00", "limit": 10, "cursor": "string"}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/customers"))
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
var request = new HttpRequestMessage(new HttpMethod("GET"), "https://api.salesplaypos.com/v1.0/customers");
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
  "customers": [
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
      "description": "string",
      "first_visit": "string",
      "last_visit": "string",
      "total_visits": "string",
      "total_spent": "string",
      "total_points": "string",
      "credit_limit": 0,
      "created_at": "2025-01-15 10:30:00",
      "updated_at": "2025-01-15 10:30:00",
      "membership_status": "string",
      "membership_details": {
        "start_date": "string",
        "end_date": "string",
        "discount_plan": "string",
        "discount_plan_id": "string"
      },
      "business_registration_number": "string",
      "customer_id_type_code": "string",
      "customer_id_type_name": "string",
      "customer_id_number": "string"
    }
  ],
  "cursor": "string"
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `customers` | array[object] |  |
| `cursor` | string | Cursor for pagination |

<details>
<summary><code>customers[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `id` | string | The unique identifier of the customer |
| `customer_code` | string | Code assigned to the customer |
| `name` | string | Customer's full name |
| `email` | string | Customer's email address |
| `phone_number` | string | Customer's phone number |
| `address` | string | Customer's street address |
| `city` | string | City of the customer |
| `region` | string | Region or state of the customer |
| `postal_code` | string | Postal code |
| `country_code` | string | ISO country code |
| `vat_number` | string | VAT number |
| `tin_number` | string | Tax Identification Number |
| `description` | string | Optional description or notes |
| `first_visit` | string (date) | Date of the first visit |
| `last_visit` | string (date) | Date of the last visit |
| `total_visits` | string | Number of visits |
| `total_spent` | string | Total amount spent by the customer |
| `total_points` | string | Total loyalty/reward points earned |
| `credit_limit` | integer | Customer Credit limit |
| `created_at` | string (date-time) | Timestamp of when the customer was created |
| `updated_at` | string (date-time) | Timestamp of when the customer was last updated |
| `membership_status` | string | Additional Details of the Membership status |
| `membership_details` | object | Membership details |
| `business_registration_number` | string | Business registration number |
| `customer_id_type_code` | string | Code of the ID document type |
| `customer_id_type_name` | string | Name of the ID document type |
| `customer_id_number` | string | ID document number |

<details>
<summary><code>customers[].membership_details</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `start_date` | string (date) | Membership start date. |
| `end_date` | string (date) | Membership end date. |
| `discount_plan` | string | Name of the discount plan. |
| `discount_plan_id` | string | The unique identifier of the discount plan. |

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
