---
title: Get Employees
sidebar_label: Get Employees
sidebar_position: 1
description: "GET /employee — list the employees registered in a SalesPlay account (read-only), paginated with a cursor."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Get Employees

**GET /employee** — list the employees registered in a SalesPlay account (read-only), paginated with a cursor. Send parameters as a JSON request body (`employee_ids`, `created_at_min`, `created_at_max`, `limit`, `cursor`). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--get">GET</span><code>https://api.salesplaypos.com/v1.0/employee</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `application/json`

:::info Send filters as a JSON body
This endpoint reads its parameters from the JSON request body — even on `GET`. Query-string parameters are ignored.
:::

| Name | Type | Description |
|---|---|---|
| `employee_ids` | string | Comma-separated list of employee IDs |
| `created_at_min` | string (date-time) | Minimum creation date (Y-m-d H:i:s) 24 hours format |
| `created_at_max` | string (date-time) | Maximum creation date (Y-m-d H:i:s) 24 hours format |
| `limit` | integer | Number of customers to return Default: `10` |
| `cursor` | string | Cursor for pagination |

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/employee" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "employee_ids": "string",
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
  "employee_ids": "string",
  "created_at_min": "2025-01-15 10:30:00",
  "created_at_max": "2025-01-15 10:30:00",
  "limit": 10,
  "cursor": "string"
});

const req = https.request("https://api.salesplaypos.com/v1.0/employee", {
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

url = "https://api.salesplaypos.com/v1.0/employee"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "employee_ids": "string",
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
$ch = curl_init("https://api.salesplaypos.com/v1.0/employee");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"employee_ids": "string", "created_at_min": "2025-01-15 10:30:00", "created_at_max": "2025-01-15 10:30:00", "limit": 10, "cursor": "string"}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/employee"))
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
var request = new HttpRequestMessage(new HttpMethod("GET"), "https://api.salesplaypos.com/v1.0/employee");
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
  "cursor": "string",
  "employees": [
    {
      "id": "string",
      "Name": "string",
      "User_Role": "string",
      "POS_Login_PIN": "string",
      "POS_user_name": "string",
      "Backoffice_login_email": "string",
      "Phone": "string",
      "shops": [
        "string"
      ]
    }
  ]
}
```

**Response fields**

| Name | Type | Description |
|---|---|---|
| `cursor` | string | Cursor for pagination |
| `employees` | array[object] |  |

<details>
<summary><code>employees[]</code> — child attributes</summary>

| Name | Type | Description |
|---|---|---|
| `id` | string | Unique identifier of the employee |
| `Name` | string | Employee name |
| `User_Role` | string | Role of the employee |
| `POS_Login_PIN` | string | POS login PIN |
| `POS_user_name` | string | POS username |
| `Backoffice_login_email` | string (email) | Backoffice login email |
| `Phone` | string | Employee phone number |
| `shops` | array[string] | List of shop IDs assigned to the employee |

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
