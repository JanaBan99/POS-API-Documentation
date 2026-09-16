---
title: Create a Single Webhook
sidebar_label: Create a Single Webhook
sidebar_position: 6
description: "POST /webhooks — register a webhook URL on a SalesPlay account so it receives real-time event notifications."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Create a Single Webhook

**POST /webhooks** — register a webhook URL on a SalesPlay account so it receives real-time event notifications. Send parameters as a JSON request body (`url`, `type`, `status`, `master_username`). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--post">POST</span><code>https://api.salesplaypos.com/v1.0/webhooks</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `application/json`

| Name | Type | Description |
|---|---|---|
| `url` <span className="api-required">required</span> | string (uri) | The URL to which webhook data will be sent. |
| `type` <span className="api-required">required</span> | string<br/>enum: `receipts.update` | The event to subscribe to. See the Webhooks overview for the list of events. |
| `status` <span className="api-required">required</span> | string<br/>enum: `ENABLED` \| `DISABLED` | Status of the webhook. |
| `master_username` <span className="api-required">required</span> | string (email) | Master account username for the merchant. |

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X POST "https://api.salesplaypos.com/v1.0/webhooks" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "url": "string",
  "type": "receipts.update",
  "status": "ENABLED",
  "master_username": "string"
}'
```

  </TabItem>

  <TabItem value="js" label="JavaScript">

```javascript
const res = await fetch("https://api.salesplaypos.com/v1.0/webhooks", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "url": "string",
  "type": "receipts.update",
  "status": "ENABLED",
  "master_username": "string"
}),
});
const data = await res.json();
```

  </TabItem>

  <TabItem value="python" label="Python">

```python
import requests

url = "https://api.salesplaypos.com/v1.0/webhooks"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "url": "string",
    "type": "receipts.update",
    "status": "ENABLED",
    "master_username": "string"
}
res = requests.post(url, json=payload, headers=headers)
print(res.json())
```

  </TabItem>

  <TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init("https://api.salesplaypos.com/v1.0/webhooks");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"url": "string", "type": "receipts.update", "status": "ENABLED", "master_username": "string"}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/webhooks"))
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
var request = new HttpRequestMessage(new HttpMethod("POST"), "https://api.salesplaypos.com/v1.0/webhooks");
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

**200** — Webhook registered successfully

```json
{
  "id": "RDYzUXdTT21zRkw4TWY4Nk5sUW5xQT09",
  "merchant_id": "NDRnNnhWRGpXSWxsQmtiVkhiQ0M4SlJNM1NvaXRiajJlQXJsc3JXVG1tOD0=",
  "url": "https://example.com/webhooks/salesplay",
  "type": "receipts.update",
  "status": "DISABLED",
  "created_at": "2026-09-14 15:19:46",
  "updated_at": "2026-09-14 15:19:46"
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `id` | string | Unique identifier of the webhook |
| `merchant_id` | string | Encrypted merchant ID |
| `url` | string (uri) | Registered webhook URL |
| `type` | string | Webhook event type |
| `status` | string | Webhook status: `ENABLED` or `DISABLED` |
| `created_at` | string (date-time) | The creation date of the webhook (Y-m-d H:i:s) 24 hours format |
| `updated_at` | string (date-time) | The last updated date of the webhook (Y-m-d H:i:s) 24 hours format |

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
