---
title: Webhook API Suite
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Webhook API Suite

The Webhook API Suite allows you to manage webhooks in SalesPlay POS — retrieve, register, and delete webhook subscriptions for real-time event notifications.

**Base URL**
```
https://api.salesplaypos.com/v1.0
```

---

## Get a Webhook

Retrieve the details of a specific webhook using its unique ID.

```
GET /webhooks
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | ✅ Yes | The unique identifier of the webhook to retrieve |

### Example Request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/webhooks?id=wh_abc123" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
const axios = require('axios');

const response = await axios.get('https://api.salesplaypos.com/v1.0/webhooks', {
  params: { id: 'wh_abc123' },
  headers: { Authorization: 'Bearer YOUR_ACCESS_TOKEN' }
});

console.log(response.data);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    'https://api.salesplaypos.com/v1.0/webhooks',
    params={'id': 'wh_abc123'},
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN'}
)
  </TabItem>
  <TabItem value="php" label="PHP">

```php
$ch = curl_init('https://api.salesplaypos.com/v1.0/webhooks?id=wh_abc123');
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer YOUR_ACCESS_TOKEN']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
echo curl_exec($ch);
```

  </TabItem>
  <TabItem value="java" label="Java (Standard)">

```java
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.salesplaypos.com/v1.0/webhooks?id=wh_abc123"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .GET().build();
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
ResponseEntity<String> response = restTemplate.exchange(
    "https://api.salesplaypos.com/v1.0/webhooks?id=wh_abc123",
    HttpMethod.GET, entity, String.class
);
```

  </TabItem>
  <TabItem value="csharp" label="C# (.NET)">

```csharp
var response = await client.GetAsync("https://api.salesplaypos.com/v1.0/webhooks?id=wh_abc123");
```

  </TabItem>
</Tabs>

### Response `200 OK`

```json
{
  "id": "wh_abc123",
  "merchant_id": "enc_m_9f8e7d6c",
  "url": "https://myapp.com/webhooks/salesplay",
  "type": "inventory_levels.update",
  "status": "ENABLED",
  "created_at": "2024-01-10 09:00:00",
  "updated_at": "2024-03-15 14:30:00"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier of the webhook |
| `merchant_id` | string | Encrypted merchant ID |
| `url` | string (uri) | Registered webhook URL |
| `type` | string | Webhook event type |
| `status` | string | Webhook status (`ENABLED` or `DISABLED`) |
| `created_at` | string (date-time) | Creation date in `Y-m-d H:i:s` format (24hr) |
| `updated_at` | string (date-time) | Last updated date in `Y-m-d H:i:s` format (24hr) |

---

## Create a Webhook

Register a new webhook to start receiving real-time event notifications from SalesPlay POS.

```
POST /webhooks
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `url` | string (uri) | ✅ Yes | The URL to which webhook data will be sent |
| `type` | string | ✅ Yes | The event type to subscribe to (see values below) |
| `status` | string | ✅ Yes | `ENABLED` or `DISABLED` |
| `master_username` | string (email) | ✅ Yes | Master account username (email) for the merchant |

**Supported event types for `type`:**
- `inventory_levels.update`
- `products.update`
- `customers.update`
- `receipts.update`
- `credit_note.update`

### Example Request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X POST "https://api.salesplaypos.com/v1.0/webhooks" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "url=https://myapp.com/webhooks/salesplay" \
  -d "type=inventory_levels.update" \
  -d "status=ENABLED" \
  -d "master_username=admin@mystore.com"
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
const axios = require('axios');

const params = new URLSearchParams();
params.append('url', 'https://myapp.com/webhooks/salesplay');
params.append('type', 'inventory_levels.update');
params.append('status', 'ENABLED');
params.append('master_username', 'admin@mystore.com');

const response = await axios.post(
  'https://api.salesplaypos.com/v1.0/webhooks',
  params,
  { headers: { Authorization: 'Bearer YOUR_ACCESS_TOKEN' } }
);

console.log(response.data);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

data = {
    'url': 'https://myapp.com/webhooks/salesplay',
    'type': 'inventory_levels.update',
    'status': 'ENABLED',
    'master_username': 'admin@mystore.com'
}

response = requests.post(
    'https://api.salesplaypos.com/v1.0/webhooks',
    data=data,
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN'}
)

print(response.json())
```

  </TabItem>
  <TabItem value="php" label="PHP">

```php
$data = [
    'url' => 'https://myapp.com/webhooks/salesplay',
    'type' => 'inventory_levels.update',
    'status' => 'ENABLED',
    'master_username' => 'admin@mystore.com'
];

$ch = curl_init('https://api.salesplaypos.com/v1.0/webhooks');
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer YOUR_ACCESS_TOKEN']);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
echo curl_exec($ch);
```

  </TabItem>
  <TabItem value="java" label="Java (Standard)">

```java
String body = "url=https://myapp.com/webhooks/salesplay&type=inventory_levels.update&status=ENABLED&master_username=admin@mystore.com";
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.salesplaypos.com/v1.0/webhooks"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .header("Content-Type", "application/x-www-form-urlencoded")
    .POST(HttpRequest.BodyPublishers.ofString(body))
    .build();
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
MultiValueMap<String, String> body = new LinkedMultiValueMap<>();
body.add("url", "https://myapp.com/webhooks/salesplay");
body.add("type", "inventory_levels.update");
body.add("status", "ENABLED");
body.add("master_username", "admin@mystore.com");

HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(body, headers);
ResponseEntity<String> response = restTemplate.postForEntity(
    "https://api.salesplaypos.com/v1.0/webhooks", request, String.class
);
```

  </TabItem>
  <TabItem value="csharp" label="C# (.NET)">

```csharp
var values = new Dictionary<string, string>
{
    { "url", "https://myapp.com/webhooks/salesplay" },
    { "type", "inventory_levels.update" },
    { "status", "ENABLED" },
    { "master_username", "admin@mystore.com" }
};

var content = new FormUrlEncodedContent(values);
var response = await client.PostAsync("https://api.salesplaypos.com/v1.0/webhooks", content);
```

  </TabItem>
</Tabs>

### Response `200 OK`

```json
{
  "id": "wh_xyz789",
  "merchant_id": "enc_m_9f8e7d6c",
  "url": "https://myapp.com/webhooks/salesplay",
  "type": "inventory_levels.update",
  "status": "ENABLED",
  "created_at": "2024-04-10 10:15:00",
  "updated_at": "2024-04-10 10:15:00"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique identifier of the newly created webhook |
| `merchant_id` | string | Encrypted merchant ID |
| `url` | string (uri) | Registered webhook URL |
| `type` | string | Webhook event type |
| `status` | string | Webhook status |
| `created_at` | string (date-time) | Creation date in `Y-m-d H:i:s` format (24hr) |
| `updated_at` | string (date-time) | Last updated date in `Y-m-d H:i:s` format (24hr) |

---

## Delete a Webhook

Permanently delete a specific webhook from SalesPlay POS using its ID. Once deleted, the webhook will no longer receive event notifications.

```
DELETE /webhooks
```

### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | ✅ Yes | The unique identifier of the webhook to delete |

### Example Request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X DELETE "https://api.salesplaypos.com/v1.0/webhooks?id=wh_abc123" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
const axios = require('axios');

const response = await axios.delete('https://api.salesplaypos.com/v1.0/webhooks', {
  params: { id: 'wh_abc123' },
  headers: { Authorization: 'Bearer YOUR_ACCESS_TOKEN' }
});

console.log(response.data);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

response = requests.delete(
    'https://api.salesplaypos.com/v1.0/webhooks',
    params={'id': 'wh_abc123'},
    headers={'Authorization': 'Bearer YOUR_ACCESS_TOKEN'}
)

print(response.json())
```

  </TabItem>
  <TabItem value="php" label="PHP">

```php
$ch = curl_init('https://api.salesplaypos.com/v1.0/webhooks?id=wh_abc123');
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer YOUR_ACCESS_TOKEN']);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
echo curl_exec($ch);
```

  </TabItem>
  <TabItem value="java" label="Java (Standard)">

```java
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.salesplaypos.com/v1.0/webhooks?id=wh_abc123"))
    .header("Authorization", "Bearer YOUR_ACCESS_TOKEN")
    .DELETE().build();
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
ResponseEntity<String> response = restTemplate.exchange(
    "https://api.salesplaypos.com/v1.0/webhooks?id=wh_abc123",
    HttpMethod.DELETE, entity, String.class
);
```

  </TabItem>
  <TabItem value="csharp" label="C# (.NET)">

```csharp
var response = await client.DeleteAsync("https://api.salesplaypos.com/v1.0/webhooks?id=wh_abc123");
```

  </TabItem>
</Tabs>

### Response `200 OK`

```json
{
  "deleted_object_ids": "wh_abc123"
}
```

### Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `deleted_object_ids` | string | The ID of the successfully deleted webhook |

