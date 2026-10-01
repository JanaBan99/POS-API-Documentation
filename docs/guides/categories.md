---
description: "Create, update, list and delete product categories and sub categories in SalesPlay via the API, with examples in six languages."
title: Set Up Categories
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Set Up Categories

This guide covers how to implement **Get, Create, Edit, and Delete** category operations on your backend, communicating with the SalesPlay API.


## Create Category

Create a new category by sending a `POST` request with the category data.

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X POST "https://api.salesplaypos.com/v1.0/category" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "category_name": "string",
  "item_classification_code": "string",
  "created_at": "2025-01-15 10:30:00"
}'
```

  </TabItem>

  <TabItem value="js" label="JavaScript">

```javascript
const res = await fetch("https://api.salesplaypos.com/v1.0/category", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "category_name": "string",
  "item_classification_code": "string",
  "created_at": "2025-01-15 10:30:00"
}),
});
const data = await res.json();
```

  </TabItem>

  <TabItem value="python" label="Python">

```python
import requests

url = "https://api.salesplaypos.com/v1.0/category"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "category_name": "string",
    "item_classification_code": "string",
    "created_at": "2025-01-15 10:30:00"
}
res = requests.post(url, json=payload, headers=headers)
print(res.json())
```

  </TabItem>

  <TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init("https://api.salesplaypos.com/v1.0/category");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"category_name": "string", "item_classification_code": "string", "created_at": "2025-01-15 10:30:00"}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/category"))
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
var request = new HttpRequestMessage(new HttpMethod("POST"), "https://api.salesplaypos.com/v1.0/category");
request.Headers.Add("Authorization", "Bearer YOUR_ACCESS_TOKEN");
request.Content = new StringContent(payload, Encoding.UTF8, "application/json");
var response = await client.SendAsync(request);
var body = await response.Content.ReadAsStringAsync();
```

  </TabItem>

</Tabs>

> **💡 Tip**
> Save the returned `id` — you will need it when assigning products to this category.


- To create a category via the API, refer to the [Create Category](/API-reference/categories/create-category) API reference.

---

## Get Categories

Retrieve all categories or fetch a single category by ID.

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/category" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "category_ids": "string",
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
  "category_ids": "string",
  "created_at_min": "2025-01-15 10:30:00",
  "created_at_max": "2025-01-15 10:30:00",
  "limit": 10,
  "cursor": "string"
});

const req = https.request("https://api.salesplaypos.com/v1.0/category", {
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

url = "https://api.salesplaypos.com/v1.0/category"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "category_ids": "string",
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
$ch = curl_init("https://api.salesplaypos.com/v1.0/category");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"category_ids": "string", "created_at_min": "2025-01-15 10:30:00", "created_at_max": "2025-01-15 10:30:00", "limit": 10, "cursor": "string"}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/category"))
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
var request = new HttpRequestMessage(new HttpMethod("GET"), "https://api.salesplaypos.com/v1.0/category");
request.Headers.Add("Authorization", "Bearer YOUR_ACCESS_TOKEN");
request.Content = new StringContent(payload, Encoding.UTF8, "application/json");
var response = await client.SendAsync(request);
var body = await response.Content.ReadAsStringAsync();
```

  </TabItem>

</Tabs>


- See [**Get Categories**](/API-reference/categories/get-categories) in the API reference.


---

## Edit Category

There is no separate update call. `POST /category` creates a category, or updates it when the category code already exists — send the same request as in [Create Category](#create-category) with the new values.

- For full request and response details, see the [**Create or Update Category**](/API-reference/categories/create-category) API reference.

---

## Delete Category

Permanently remove a category by sending a `DELETE` request with its ID.

> **⚠️ Warning**
> Deleting a category that has products assigned to it may fail. Reassign or remove those products first.

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X DELETE "https://api.salesplaypos.com/v1.0/category" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "category_id": "string"
}'
```

  </TabItem>

  <TabItem value="js" label="JavaScript">

```javascript
import https from "node:https";

const payload = JSON.stringify({
  "category_id": "string"
});

const req = https.request("https://api.salesplaypos.com/v1.0/category", {
  method: "DELETE",
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

url = "https://api.salesplaypos.com/v1.0/category"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "category_id": "string"
}
res = requests.delete(url, json=payload, headers=headers)
print(res.json())
```

  </TabItem>

  <TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init("https://api.salesplaypos.com/v1.0/category");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"category_id": "string"}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/category"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("Content-Type", "application/json")
    .method("DELETE", HttpRequest.BodyPublishers.ofString(payload))
    .build();

HttpResponse<String> response = client.send(request,
    HttpResponse.BodyHandlers.ofString());
```

  </TabItem>

  <TabItem value="csharp" label="C#">

```csharp
var request = new HttpRequestMessage(new HttpMethod("DELETE"), "https://api.salesplaypos.com/v1.0/category");
request.Headers.Add("Authorization", "Bearer YOUR_ACCESS_TOKEN");
request.Content = new StringContent(payload, Encoding.UTF8, "application/json");
var response = await client.SendAsync(request);
var body = await response.Content.ReadAsStringAsync();
```

  </TabItem>

</Tabs>

- Explore the [**Delete Categories**](/API-reference/categories/delete-category) API reference to delete categories.

---

## Error Reference

| HTTP Status | Error Code | Meaning |
|-------------|------------|---------|
| `401` | `UNAUTHORIZED` | Invalid or expired access token |
| `404` | `NOT_FOUND` | Category ID does not exist |
| `409` | `DUPLICATE_NAME` | A category with the same name already exists |
| `422` | `VALIDATION_ERROR` | Missing or invalid fields |

---

## Next Steps

- **[Create Products](product)** — Assign products under your categories.
- **[Create Orders](order-integration)** — Build orders using your products.
- **[Receipts](receipt)** — Generate receipts from completed orders.