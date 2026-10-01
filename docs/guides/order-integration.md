---
description: "Retrieve orders, place online orders into the SalesPlay POS, check their status and cancel them via the API, with examples in six languages."
title: Process & Manage Orders
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Process & Manage Orders

Orders represent sales transactions in the SalesPlay POS. Each order contains one or more products and is linked to a merchant's shop. This guide covers how to implement **Get, Create, Edit, and Delete** order operations on your backend.

---


## Order Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `created-at_min` | string `<date-time>` | ✅ Yes | Show resources created after date (Y-m-d H:i:s) 24 hours format |
| `created_at_max` | string `<date-time>` | ✅ Yes | Show resources created before date (Y-m-d H:i:s) 24 hours format |

- To see the complete list of available fields, click here:
**[View All Fields](/API-reference/orders/get-orders)** 

---

## Get Orders

Retrieve all orders or fetch a single order by ID. Send a `GET` request to `https://api.salesplaypos.com/v1.0/orders` with a Bearer token in the `Authorization` header and the filters (`order_numbers`, `shop_id`, `created_at_min`, `created_at_max`, `limit`, `cursor`) as a JSON body — query-string parameters are ignored.

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/orders" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "order_numbers": "string",
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
  "order_numbers": "string",
  "shop_id": "string",
  "created_at_min": "2025-01-15 10:30:00",
  "created_at_max": "2025-01-15 10:30:00",
  "limit": 10,
  "cursor": "string"
});

const req = https.request("https://api.salesplaypos.com/v1.0/orders", {
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

url = "https://api.salesplaypos.com/v1.0/orders"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "order_numbers": "string",
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
$ch = curl_init("https://api.salesplaypos.com/v1.0/orders");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"order_numbers": "string", "shop_id": "string", "created_at_min": "2025-01-15 10:30:00", "created_at_max": "2025-01-15 10:30:00", "limit": 10, "cursor": "string"}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/orders"))
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
var request = new HttpRequestMessage(new HttpMethod("GET"), "https://api.salesplaypos.com/v1.0/orders");
request.Headers.Add("Authorization", "Bearer YOUR_ACCESS_TOKEN");
request.Content = new StringContent(payload, Encoding.UTF8, "application/json");
var response = await client.SendAsync(request);
var body = await response.Content.ReadAsStringAsync();
```

  </TabItem>

</Tabs>

- See [**Get orders**](/API-reference/orders/get-orders) in API reference.

---



## Error Reference

| HTTP Status | Error Code | Meaning |
|-------------|------------|---------|
| `401` | `UNAUTHORIZED` | Invalid or expired access token |
| `404` | `NOT_FOUND` | Order ID does not exist |
| `409` | `ORDER_LOCKED` | Order cannot be modified — already completed or cancelled |
| `422` | `VALIDATION_ERROR` | Missing or invalid fields (e.g. `shop_id`, `items`) |

---

## Next Steps

- **[Generate Receipts](receipt)** — Generate a receipt once an order is completed.