---
description: "Retrieve sales receipts, void receipts and credit notes from SalesPlay, and issue credit notes and refunds via the API."
title: Generate Receipts
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Generate Receipts

A receipt is generated once an order is completed and paid. This guide covers how to implement **Get, Generate, and Download** receipt operations on your backend using the SalesPlay API.

## Get Receipts

Retrieve all receipts or fetch a single receipt by ID. Send a `GET` request to `https://api.salesplaypos.com/v1.0/receipts` with a Bearer token in the `Authorization` header and the filters (`receipt_numbers`, `shop_id`, `created_at_min`, `created_at_max`, `limit`, `cursor`) as a JSON body — query-string parameters are ignored.

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/receipts" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "receipt_numbers": "string",
  "shop_id": "string",
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
  "receipt_numbers": "string",
  "shop_id": "string",
  "created_at_min": "2025-01-15 10:30:00",
  "created_at_max": "2025-01-15 10:30:00",
  "limit": 10,
  "cursor": "string"
});

const req = https.request("https://api.salesplaypos.com/v1.0/receipts", {
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

url = "https://api.salesplaypos.com/v1.0/receipts"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "receipt_numbers": "string",
    "shop_id": "string",
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
$ch = curl_init("https://api.salesplaypos.com/v1.0/receipts");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"receipt_numbers": "string", "shop_id": "string", "created_at_min": "2025-01-15 10:30:00", "created_at_max": "2025-01-15 10:30:00", "limit": 10, "cursor": "string"}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/receipts"))
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
var request = new HttpRequestMessage(new HttpMethod("GET"), "https://api.salesplaypos.com/v1.0/receipts");
request.Headers.Add("Authorization", "Bearer YOUR_ACCESS_TOKEN");
request.Content = new StringContent(payload, Encoding.UTF8, "application/json");
var response = await client.SendAsync(request);
var body = await response.Content.ReadAsStringAsync();
```

  </TabItem>

</Tabs>

- See [**Get Receipts**](/API-reference/receipts/get-receipts) in API reference.
---

## Get Void Receipts

Retrieve a list of all voided receipts.

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/void_receipts" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "receipt_numbers": "string",
  "shop_id": "string",
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
  "receipt_numbers": "string",
  "shop_id": "string",
  "created_at_min": "2025-01-15 10:30:00",
  "created_at_max": "2025-01-15 10:30:00",
  "limit": 10,
  "cursor": "string"
});

const req = https.request("https://api.salesplaypos.com/v1.0/void_receipts", {
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

url = "https://api.salesplaypos.com/v1.0/void_receipts"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "receipt_numbers": "string",
    "shop_id": "string",
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
$ch = curl_init("https://api.salesplaypos.com/v1.0/void_receipts");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"receipt_numbers": "string", "shop_id": "string", "created_at_min": "2025-01-15 10:30:00", "created_at_max": "2025-01-15 10:30:00", "limit": 10, "cursor": "string"}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/void_receipts"))
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
var request = new HttpRequestMessage(new HttpMethod("GET"), "https://api.salesplaypos.com/v1.0/void_receipts");
request.Headers.Add("Authorization", "Bearer YOUR_ACCESS_TOKEN");
request.Content = new StringContent(payload, Encoding.UTF8, "application/json");
var response = await client.SendAsync(request);
var body = await response.Content.ReadAsStringAsync();
```

  </TabItem>

</Tabs>

- For full request and response details, see the [**Get Void Receipts**](/API-reference/receipts/get-void-receipts) API reference.


---

## Error Reference

| HTTP Status | Error Code | Meaning |
|-------------|------------|---------|
| `401` | `UNAUTHORIZED` | Invalid or expired access token |
| `404` | `NOT_FOUND` | Receipt or Order ID does not exist |
| `422` | `ORDER_NOT_COMPLETED` | Order is not in a completed or paid state |
| `422` | `RECEIPT_ALREADY_EXISTS` | A receipt has already been generated for this order |

---

## Next Steps

- **[OAuth 2.0](oauth)** — Review token management and refresh flows.
- **[Set up Categories](categories)** — Manage your product categories.
- **[Set up Products](product)** — Manage your product catalog.