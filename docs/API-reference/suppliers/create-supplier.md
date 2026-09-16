---
title: Create or Update Supplier
sidebar_label: Create or Update Supplier
sidebar_position: 2
description: "POST /suppliers — create a supplier in SalesPlay, or update it when the supplier code already exists."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Create or Update Supplier

**POST /suppliers** — create a supplier in SalesPlay, or update it when the supplier code already exists. Send parameters as a JSON request body (`supplier_name`, `supplier_id`, `phone_number`, `email`, `type`, `address`, `description`, `created_at`). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--post">POST</span><code>https://api.salesplaypos.com/v1.0/suppliers</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `application/json`

| Name | Type | Description |
|---|---|---|
| `supplier_name` <span className="api-required">required</span> | string | The name of the supplier. Only letters, numbers, dot (.) and underscore (_) are accepted. |
| `supplier_id` <span className="api-required">required</span> | string | The ID of the supplier |
| `phone_number` | string | The phone number of the supplier |
| `email` | string | The email address of the supplier |
| `type` <span className="api-required">required</span> | string | Type of the supplier (Possible supplier types - Cash, Credit, N/A) |
| `address` | string | The address of the supplier |
| `description` | string | Description of the supplier |
| `created_at` <span className="api-required">required</span> | string (date-time) | The creation date of the supplier (Y-m-d H:i:s) 24 hours format |

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X POST "https://api.salesplaypos.com/v1.0/suppliers" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "supplier_name": "string",
  "supplier_id": "string",
  "phone_number": "string",
  "email": "string",
  "type": "string",
  "address": "string",
  "description": "string",
  "created_at": "2025-01-15 10:30:00"
}'
```

  </TabItem>

  <TabItem value="js" label="JavaScript">

```javascript
const res = await fetch("https://api.salesplaypos.com/v1.0/suppliers", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "supplier_name": "string",
  "supplier_id": "string",
  "phone_number": "string",
  "email": "string",
  "type": "string",
  "address": "string",
  "description": "string",
  "created_at": "2025-01-15 10:30:00"
}),
});
const data = await res.json();
```

  </TabItem>

  <TabItem value="python" label="Python">

```python
import requests

url = "https://api.salesplaypos.com/v1.0/suppliers"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "supplier_name": "string",
    "supplier_id": "string",
    "phone_number": "string",
    "email": "string",
    "type": "string",
    "address": "string",
    "description": "string",
    "created_at": "2025-01-15 10:30:00"
}
res = requests.post(url, json=payload, headers=headers)
print(res.json())
```

  </TabItem>

  <TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init("https://api.salesplaypos.com/v1.0/suppliers");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"supplier_name": "string", "supplier_id": "string", "phone_number": "string", "email": "string", "type": "string", "address": "string", "description": "string", "created_at": "2025-01-15 10:30:00"}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/suppliers"))
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
var request = new HttpRequestMessage(new HttpMethod("POST"), "https://api.salesplaypos.com/v1.0/suppliers");
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

**200** — Supplier created successfully

```json
{
  "id": "string",
  "supplier_name": "string",
  "supplier_id": "string",
  "phone_number": "string",
  "email": "string",
  "type": "string",
  "address": "string",
  "created_at": "2025-01-15 10:30:00"
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `id` | string | The unique identifier for the supplier |
| `supplier_name` | string | The name of the supplier |
| `supplier_id` | string | The ID of the supplier |
| `phone_number` | string | The phone number of the supplier |
| `email` | string | The email address of the supplier |
| `type` | string | Type of the supplier |
| `address` | string | The address of the supplier |
| `created_at` | string (date-time) | The creation date of the supplier (Y-m-d H:i:s) 24 hours format |

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
