---
title: Get Shops
sidebar_label: Get Shops
sidebar_position: 1
description: "GET /shops — list the shops (locations) and their POS terminals under a SalesPlay account (read-only)."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get Shops

**GET /shops** — list the shops (locations) and their POS terminals under a SalesPlay account (read-only). Send parameters as a JSON request body (`shop_ids`, `updated_at_min`, `updated_at_max`, `limit`, `cursor`). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--get">GET</span><code>https://api.salesplaypos.com/v1.0/shops</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `application/json`

:::info Send filters as a JSON body
This endpoint reads its parameters from the JSON request body — even on `GET`. Query-string parameters are ignored.
:::

| Name | Type | Description |
|---|---|---|
| `shop_ids` | string | Comma-separated shop IDs |
| `updated_at_min` | string (date-time) | Minimum updated date |
| `updated_at_max` | string (date-time) | Maximum updated date |
| `limit` | integer (int32) | Maximum number of results to return |
| `cursor` | string | Cursor for pagination |

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/shops" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "shop_ids": "string",
  "updated_at_min": "2025-01-15 10:30:00",
  "updated_at_max": "2025-01-15 10:30:00",
  "limit": 0,
  "cursor": "string"
}'
```

  </TabItem>

  <TabItem value="js" label="JavaScript">

```javascript
import https from "node:https";

const payload = JSON.stringify({
  "shop_ids": "string",
  "updated_at_min": "2025-01-15 10:30:00",
  "updated_at_max": "2025-01-15 10:30:00",
  "limit": 0,
  "cursor": "string"
});

const req = https.request("https://api.salesplaypos.com/v1.0/shops", {
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

url = "https://api.salesplaypos.com/v1.0/shops"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "shop_ids": "string",
    "updated_at_min": "2025-01-15 10:30:00",
    "updated_at_max": "2025-01-15 10:30:00",
    "limit": 0,
    "cursor": "string"
}
res = requests.get(url, json=payload, headers=headers)
print(res.json())
```

  </TabItem>

  <TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init("https://api.salesplaypos.com/v1.0/shops");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"shop_ids": "string", "updated_at_min": "2025-01-15 10:30:00", "updated_at_max": "2025-01-15 10:30:00", "limit": 0, "cursor": "string"}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/shops"))
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
var request = new HttpRequestMessage(new HttpMethod("GET"), "https://api.salesplaypos.com/v1.0/shops");
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
  "shops": [
    {
      "id": "MnczNjdrVllFVTZoKzBHak1XZXkrZz09",
      "shop_name": "Main Street Store",
      "address": "",
      "phone_number": "",
      "city": "",
      "email": "",
      "longitude": "",
      "latitude": "",
      "terminal_list": [
        {
          "pos_name": "POS 01",
          "pos_key": "SP25443956"
        }
      ],
      "is_enable": "1",
      "updated_date": "2026-09-14 12:27:10"
    }
  ],
  "cursor": "MT@sMT@="
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `shops` | array[object] |  |
| `cursor` | string | Pagination cursor. Send it back in the next request to fetch the following page; absent on the last page. |

<details>
<summary><code>shops[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `id` | string | The unique identifier of the shop. |
| `shop_name` | string | The name of the shop. |
| `address` | string | The address of the shop. |
| `phone_number` | string | The phone number of the shop. |
| `city` | string | The city where the shop is located. |
| `email` | string | The email address of the shop. |
| `longitude` | string | The longitude coordinate of the shop's location. |
| `latitude` | string | The latitude coordinate of the shop's location. |
| `terminal_list` | array[object] | List of POS terminals associated with the shop. |
| `is_enable` | string | Indicates whether the shop is enabled (1) or disabled (0). |
| `updated_date` | string | The date and time when the shop information was last updated. |

<details>
<summary><code>shops[].terminal_list[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `pos_name` | string | The name of the POS terminal. |
| `pos_key` | string | The unique key identifying the POS terminal. |

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

**401** — Unauthorized

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
| `code` | string | The error code. |
| `details` | string | The details of the error. |

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
