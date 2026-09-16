---
title: Upload Product Image
sidebar_label: Upload Product Image
sidebar_position: 1
description: "POST /product_image — upload or replace the image of a SalesPlay product, identified by product code, as a multipart upload."
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Upload Product Image

**POST /product_image** — upload or replace the image of a SalesPlay product, identified by product code, as a multipart upload. Send a multipart form (`product_code`, `image`). Requires a Bearer token in the `Authorization` header. Base URL: `https://api.salesplaypos.com/v1.0`.



<div className="api-endpoint"><span className="api-badge api-badge--post">POST</span><code>https://api.salesplaypos.com/v1.0/product_image</code></div>

## Authorization

Bearer token in the `Authorization` header — see [Personal Access Tokens](../../guides/personal-access-tokens) or [OAuth 2.0](../../guides/oauth).

## Request body

Content type: `multipart/form-data`

| Name | Type | Description |
|---|---|---|
| `product_code` <span className="api-required">required</span> | string | Unique product code |
| `image` <span className="api-required">required</span> | file (.png / .jpg / .jpeg) | Product image file |

## Example request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X POST "https://api.salesplaypos.com/v1.0/product_image" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

  </TabItem>

  <TabItem value="js" label="JavaScript">

```javascript
const res = await fetch("https://api.salesplaypos.com/v1.0/product_image", {
  method: "POST",
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

url = "https://api.salesplaypos.com/v1.0/product_image"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
res = requests.post(url, headers=headers)
print(res.json())
```

  </TabItem>

  <TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init("https://api.salesplaypos.com/v1.0/product_image");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/product_image"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .method("POST", HttpRequest.BodyPublishers.noBody())
    .build();

HttpResponse<String> response = client.send(request,
    HttpResponse.BodyHandlers.ofString());
```

  </TabItem>

  <TabItem value="csharp" label="C#">

```csharp
var request = new HttpRequestMessage(new HttpMethod("POST"), "https://api.salesplaypos.com/v1.0/product_image");
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
  "success": {
    "code": "SUCCESS",
    "details": "Product image successfully updated"
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
| `code` | string | Response code for success. Example: `SUCCESS` |
| `details` | string | Details of the success message. Example: `Product image successfully updated` |

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
