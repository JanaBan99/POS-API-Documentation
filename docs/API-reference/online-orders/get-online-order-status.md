---
title: Get Online Order Status
sidebar_label: Get Online Order Status
sidebar_position: 2
description: "GET /online_order_status — check the current status of online orders placed into SalesPlay, by their system unique ID."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get Online Order Status

**GET /online_order_status** — check the current status of online orders placed into SalesPlay, by their system unique ID. Send parameters as a JSON request body (`system_unique_ids`, `created_at_min`, `created_at_max`, `limit`, `cursor`). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.

The request to get the order status should include the order reference ID as a path parameter.

<div className="api-endpoint"><span className="api-badge api-badge--get">GET</span><code>https://api.salesplaypos.com/v1.0/online_order_status</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `application/json`

:::info Send filters as a JSON body
This endpoint reads its parameters from the JSON request body — even on `GET`. Query-string parameters are ignored.
:::

| Name | Type | Description |
|---|---|---|
| `system_unique_ids` | string | Comma-separated list of system unique IDs to filter the orders |
| `created_at_min` | string (date-time) | Minimum created date (Y-m-d H:i:s) 24 hours format |
| `created_at_max` | string (date-time) | Maximum created date (Y-m-d H:i:s) 24 hours format |
| `limit` | integer | Limit the number of results (optional) Default: `10` |
| `cursor` | string | Cursor for pagination (optional) |

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/online_order_status" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "system_unique_ids": "string",
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
  "system_unique_ids": "string",
  "created_at_min": "2025-01-15 10:30:00",
  "created_at_max": "2025-01-15 10:30:00",
  "limit": 10,
  "cursor": "string"
});

const req = https.request("https://api.salesplaypos.com/v1.0/online_order_status", {
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

url = "https://api.salesplaypos.com/v1.0/online_order_status"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "system_unique_ids": "string",
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
$ch = curl_init("https://api.salesplaypos.com/v1.0/online_order_status");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"system_unique_ids": "string", "created_at_min": "2025-01-15 10:30:00", "created_at_max": "2025-01-15 10:30:00", "limit": 10, "cursor": "string"}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/online_order_status"))
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
var request = new HttpRequestMessage(new HttpMethod("GET"), "https://api.salesplaypos.com/v1.0/online_order_status");
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

**200** — A list of order statuses

```json
{
  "order_status": [
    {
      "system_unique_id": "string",
      "order_reference_id": "string",
      "order_reference_number": "string",
      "order_status": "0",
      "status_name": "Pending"
    }
  ],
  "cursor": "MT@sMT@="
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `order_status` | array[object] | List of order statuses |
| `cursor` | string | Cursor for pagination to fetch the next set of results. Example: `MT@sMT@=` |

<details>
<summary><code>order_status[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `system_unique_id` | string | System-generated unique identifier for the order. Example: `string` |
| `order_reference_id` | string | A unique identifier for the order reference id. Example: `string` |
| `order_reference_number` | string | A unique identifier for the order reference number. Example: `string` |
| `order_status` | string | Status code of the order. Example: `0` |
| `status_name` | string | Name of the order status. Example: `Pending` |

</details>

  </TabItem>

  <TabItem value="400" label="400">

**400** — Invalid input

Some endpoints return validation errors with status `401` instead of `400`; check `errors.code`, not just the status.

See [Troubleshooting & Errors](../../guides/errors-guide) for how to handle this response.

```json
{
  "error": {
    "message": "Invalid request parameters"
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
| `message` | string | Error message Example: `Invalid request parameters` |

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
