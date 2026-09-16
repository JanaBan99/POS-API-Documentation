---
title: Get Modifiers
sidebar_label: Get Modifiers
sidebar_position: 1
description: "GET /modifiers — list the product modifiers (add-ons and options) in a SalesPlay account, paginated with a cursor."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get Modifiers

**GET /modifiers** — list the product modifiers (add-ons and options) in a SalesPlay account, paginated with a cursor. Send parameters as a JSON request body (`modifier_ids`, `created_at_min`, `created_at_max`, `updated_at_min`, `updated_at_max`, `limit`, `cursor`). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--get">GET</span><code>https://api.salesplaypos.com/v1.0/modifiers</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `application/json`

:::info Send filters as a JSON body
This endpoint reads its parameters from the JSON request body — even on `GET`. Query-string parameters are ignored.
:::

| Name | Type | Description |
|---|---|---|
| `modifier_ids` | string | Comma-separated modifier IDs |
| `created_at_min` | string (date) | Minimum created date (Y-m-d H:i:s) 24 hours format |
| `created_at_max` | string (date) | Maximum created date (Y-m-d H:i:s) 24 hours format |
| `updated_at_min` | string (date) | Minimum updated date (Y-m-d H:i:s) 24 hours format |
| `updated_at_max` | string (date) | Maximum updated date (Y-m-d H:i:s) 24 hours format |
| `limit` | integer | Maximum number of results to return Default: `10` |
| `cursor` | string | Cursor for pagination |

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/modifiers" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "modifier_ids": "string",
  "created_at_min": "string",
  "created_at_max": "string",
  "updated_at_min": "string",
  "updated_at_max": "string",
  "limit": 10,
  "cursor": "string"
}'
```

  </TabItem>

  <TabItem value="js" label="JavaScript">

```javascript
import https from "node:https";

const payload = JSON.stringify({
  "modifier_ids": "string",
  "created_at_min": "string",
  "created_at_max": "string",
  "updated_at_min": "string",
  "updated_at_max": "string",
  "limit": 10,
  "cursor": "string"
});

const req = https.request("https://api.salesplaypos.com/v1.0/modifiers", {
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

url = "https://api.salesplaypos.com/v1.0/modifiers"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "modifier_ids": "string",
    "created_at_min": "string",
    "created_at_max": "string",
    "updated_at_min": "string",
    "updated_at_max": "string",
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
$ch = curl_init("https://api.salesplaypos.com/v1.0/modifiers");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"modifier_ids": "string", "created_at_min": "string", "created_at_max": "string", "updated_at_min": "string", "updated_at_max": "string", "limit": 10, "cursor": "string"}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/modifiers"))
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
var request = new HttpRequestMessage(new HttpMethod("GET"), "https://api.salesplaypos.com/v1.0/modifiers");
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
  "modifier_groups": [
    {
      "id": "string",
      "modifier_group_name": "string",
      "modifiers": [
        {
          "modifier_id": "string",
          "modifier_code": "string",
          "modifier_name": "string",
          "modifier_price": "string",
          "modifier_cost": "string",
          "modifier_status": true
        }
      ],
      "shops": [
        "string"
      ],
      "created_date": "string",
      "updated_date": "string"
    }
  ],
  "cursor": "string"
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `modifier_groups` | array[object] |  |
| `cursor` | string | Pagination cursor. Send it back in the next request to fetch the following page; absent on the last page. |

<details>
<summary><code>modifier_groups[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `id` | string | The unique identifier of the modifier group. |
| `modifier_group_name` | string | The name of the modifier group. |
| `modifiers` | array[object] |  |
| `shops` | array[string] |  |
| `created_date` | string | The date and time when the modifier group was created. |
| `updated_date` | string | The date and time when the modifier group was last updated. |

<details>
<summary><code>modifier_groups[].modifiers[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `modifier_id` | string | The unique identifier of the modifier. |
| `modifier_code` | string | The code of the modifier. |
| `modifier_name` | string | The name of the modifier. |
| `modifier_price` | string | The price of the modifier. |
| `modifier_cost` | string | The cost of the modifier. |
| `modifier_status` | boolean | The status of the modifier. |

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
