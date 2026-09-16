---
title: Create or Update Customer
sidebar_label: Create or Update Customer
sidebar_position: 2
description: "POST /customers — create a customer profile in SalesPlay, or update it when the customer code already exists."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Create or Update Customer

**POST /customers** — create a customer profile in SalesPlay, or update it when the customer code already exists. Send parameters as a JSON request body (`first_name`, `last_name`, `email`, `phone`, `address`, `city`, `region`, `postal_code`, …). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--post">POST</span><code>https://api.salesplaypos.com/v1.0/customers</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `application/json`

| Name | Type | Description |
|---|---|---|
| `first_name` <span className="api-required">required</span> | string | Customer's first name. |
| `last_name` | string | Customer's last name. |
| `email` | string (email) | Customer's email address. |
| `phone` | string | Customer's phone number. |
| `address` | string | Customer's street address. |
| `city` | string | Customer's city. |
| `region` | string | Customer's region or state. |
| `postal_code` | string | Postal or ZIP code. |
| `country_code` | string | ISO country code (e.g., LK for Sri Lanka). |
| `date_of_birth` | string (date) | Date of birth of the customer (YYYY-MM-DD). |
| `billing_name` | string | Billing name of the customer. |
| `business_name` | string | Registered business name. |
| `customer_code` | string | Custom code identifying the customer. |
| `description` | string | Additional details or notes about the customer. |
| `vat_number` | string | Customer's VAT number. |
| `tin_number` | string | Customer's Tax Identification Number (TIN). |
| `id_type` | string | Type of identification document (supported ID types - NA / NRIC / PASSPORT / ARMY / MyPR / MyKAS / BRN). |
| `id_number` | string | Identification number. |
| `business_registration_number` | string | Business registration number. |
| `credit_limit` | number | Customer Credit limit. |

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X POST "https://api.salesplaypos.com/v1.0/customers" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "city": "string",
  "region": "string",
  "postal_code": "string",
  "country_code": "string",
  "date_of_birth": "string",
  "billing_name": "string",
  "business_name": "string",
  "customer_code": "string",
  "description": "string",
  "vat_number": "string",
  "tin_number": "string",
  "id_type": "string",
  "id_number": "string",
  "business_registration_number": "string",
  "credit_limit": 0.0
}'
```

  </TabItem>

  <TabItem value="js" label="JavaScript">

```javascript
const res = await fetch("https://api.salesplaypos.com/v1.0/customers", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "first_name": "string",
  "last_name": "string",
  "email": "string",
  "phone": "string",
  "address": "string",
  "city": "string",
  "region": "string",
  "postal_code": "string",
  "country_code": "string",
  "date_of_birth": "string",
  "billing_name": "string",
  "business_name": "string",
  "customer_code": "string",
  "description": "string",
  "vat_number": "string",
  "tin_number": "string",
  "id_type": "string",
  "id_number": "string",
  "business_registration_number": "string",
  "credit_limit": 0.0
}),
});
const data = await res.json();
```

  </TabItem>

  <TabItem value="python" label="Python">

```python
import requests

url = "https://api.salesplaypos.com/v1.0/customers"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "first_name": "string",
    "last_name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "city": "string",
    "region": "string",
    "postal_code": "string",
    "country_code": "string",
    "date_of_birth": "string",
    "billing_name": "string",
    "business_name": "string",
    "customer_code": "string",
    "description": "string",
    "vat_number": "string",
    "tin_number": "string",
    "id_type": "string",
    "id_number": "string",
    "business_registration_number": "string",
    "credit_limit": 0.0
}
res = requests.post(url, json=payload, headers=headers)
print(res.json())
```

  </TabItem>

  <TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init("https://api.salesplaypos.com/v1.0/customers");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"first_name": "string", "last_name": "string", "email": "string", "phone": "string", "address": "string", "city": "string", "region": "string", "postal_code": "string", "country_code": "string", "date_of_birth": "string", "billing_name": "string", "business_name": "string", "customer_code": "string", "description": "string", "vat_number": "string", "tin_number": "string", "id_type": "string", "id_number": "string", "business_registration_number": "string", "credit_limit": 0.0}));
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
    .method("POST", HttpRequest.BodyPublishers.ofString(payload))
    .build();

HttpResponse<String> response = client.send(request,
    HttpResponse.BodyHandlers.ofString());
```

  </TabItem>

  <TabItem value="csharp" label="C#">

```csharp
var request = new HttpRequestMessage(new HttpMethod("POST"), "https://api.salesplaypos.com/v1.0/customers");
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

**200** — Customer created successfully

```json
{
  "success": {
    "code": "SUCCESS",
    "details": "Customer successfully created",
    "customer_id": "VG5pZ0oyMFByUktDZDB0V2J3RHVtdz09"
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
| `code` | string | Response code for success. |
| `details` | string | Details of the success message. |
| `customer_id` | string | Encrypted ID of the created customer |

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
