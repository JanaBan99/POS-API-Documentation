---
title: Get Merchant Information
sidebar_label: Get Merchant Information
sidebar_position: 1
description: "GET /merchant — retrieve the SalesPlay merchant account details (name, contact, currency) for the current token (read-only)."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get Merchant Information

**GET /merchant** — retrieve the SalesPlay merchant account details (name, contact, currency) for the current token (read-only). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--get">GET</span><code>https://api.salesplaypos.com/v1.0/merchant</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/merchant" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

  </TabItem>

  <TabItem value="js" label="JavaScript">

```javascript
const res = await fetch("https://api.salesplaypos.com/v1.0/merchant", {
  method: "GET",
  headers: {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
  },
});
const data = await res.json();
```

  </TabItem>

  <TabItem value="python" label="Python">

```python
import requests

url = "https://api.salesplaypos.com/v1.0/merchant"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
res = requests.get(url, headers=headers)
print(res.json())
```

  </TabItem>

  <TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init("https://api.salesplaypos.com/v1.0/merchant");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ["Authorization: Bearer YOUR_ACCESS_TOKEN"]);
$response = curl_exec($ch);
curl_close($ch);
echo $response;
```

  </TabItem>

  <TabItem value="java" label="Java">

```java
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.salesplaypos.com/v1.0/merchant"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .method("GET", HttpRequest.BodyPublishers.noBody())
    .build();

HttpResponse<String> response = client.send(request,
    HttpResponse.BodyHandlers.ofString());
```

  </TabItem>

  <TabItem value="csharp" label="C#">

```csharp
var request = new HttpRequestMessage(new HttpMethod("GET"), "https://api.salesplaypos.com/v1.0/merchant");
request.Headers.Add("Authorization", "Bearer YOUR_ACCESS_TOKEN");
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
  "merchant": [
    {
      "id": "NDRnNnhWRGpXSWxsQmtiVkhiQ0M4SlJNM1NvaXRiajJlQXJsc3JXVG1tOD0=",
      "business_name": "NoCompany",
      "email": "owner@example.com",
      "country": "Sri Lanka",
      "currency": {
        "code": "LKR",
        "decimal_places": "2"
      },
      "created_at": "2026-09-14 12:27:10"
    }
  ]
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `merchant` | array[object] |  |

<details>
<summary><code>merchant[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `id` | string | The unique identifier of the merchant |
| `business_name` | string | The business name of the merchant |
| `email` | string | The email of the merchant |
| `country` | string | The country where the merchant is located |
| `currency` | object |  |
| `created_at` | string (date-time) | The date and time the merchant was created |

<details>
<summary><code>merchant[].currency</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `code` | string | Currency code |
| `decimal_places` | string | Number of decimal places used in the currency |

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
