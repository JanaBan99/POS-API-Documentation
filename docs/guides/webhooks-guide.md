---
description: "Register, list and delete webhooks on a SalesPlay account, the events you can subscribe to, and how to receive event payloads."
title: Webhooks Guide
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Webhooks Guide

Real-time notifications for various SalesPlay system events are most effectively delivered through webhooks. While periodic polling of specific endpoints can maintain synchronization with SalesPlay updates, webhooks provide a more efficient solution for this requirement.

---

## Which events can a webhook subscribe to?

SalesPlay triggers notifications for the following system events:

| Event | Description |
|:---|:---|
| `inventory_levels.update` | Fired when an item’s inventory level changes. |
| `Products.update` | Fired when a product is created, updated, or deleted. |
| `customers.update` | Fired when a customer profile is created, updated, or deleted. |
| `receipts.update` | Fired when a receipt is created or updated. |
| `credit_note.update` | Fired when a credit note or cash refund is created or updated. |

Upon an event occurrence, SalesPlay gathers the relevant data, generates a notification, and transmits it via a **POST** request to the notification URL registered in your configuration.

---

## Managing Webhooks

You can programmatically manage your webhook subscriptions using the supported endpoints.

There are two primary ways to configure your subscriptions:

### 1. Create a Webhook (POST)
Programmatically manage subscriptions using the `/webhookss` endpoint.

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X POST https://api.salesplaypos.com/v1.0/webhookss \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-server.com/webhookss",
    "event": "inventory_levels.update"
  }'
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
const response = await fetch('https://api.salesplaypos.com/v1.0/webhookss', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://your-server.com/webhookss',
    event: 'inventory_levels.update'
  })
});
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

url = "https://api.salesplaypos.com/v1.0/webhookss"
payload = {
    "url": "https://your-server.com/webhookss",
    "event": "inventory_levels.update"
}
headers = {
    "Authorization": "Bearer YOUR_TOKEN",
    "Content-Type": "application/json"
}

response = requests.post(url, json=payload, headers=headers)
```

  </TabItem>
  <TabItem value="php" label="PHP">

```php
$data = json_encode([
    "url" => "https://your-server.com/webhookss",
    "event" => "inventory_levels.update"
]);

$ch = curl_init('https://api.salesplaypos.com/v1.0/webhookss');
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer YOUR_TOKEN', 'Content-Type: application/json']);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
echo curl_exec($ch);
```

  </TabItem>
  <TabItem value="java" label="Java (Standard)">

```java
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.salesplaypos.com/v1.0/webhookss"))
    .header("Authorization", "Bearer YOUR_TOKEN")
    .header("Content-Type", "application/json")
    .POST(HttpRequest.BodyPublishers.ofString("{\"url\":\"...\",\"event\":\"...\"}"))
    .build();
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
Map<String, String> body = Map.of(
    "url", "https://your-server.com/webhookss",
    "event", "inventory_levels.update"
);

HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
ResponseEntity<String> response = restTemplate.postForEntity(
    "https://api.salesplaypos.com/v1.0/webhookss", request, String.class
);
```

  </TabItem>
  <TabItem value="csharp" label="C# (.NET)">

```csharp
var payload = new { url = "https://your-server/webhookss", @event = "inventory_levels.update" };
var content = JsonContent.Create(payload);
var response = await client.PostAsync("https://api.salesplaypos.com/v1.0/webhookss", content);
```

  </TabItem>
</Tabs>

### 2. Webhook Payload

After creation, SalesPlay will dispatch an HTTP POST request to your URL whenever the subscribed event triggers. The request includes JSON data detailing the object that initiated the event.

#### Example Payload (`inventory_levels.update`)

```json
{
  "merchant_id": "WFpYWmQwMkJGVWtDT3RHY1NHYjdBT0YzZE5xOD0=",
  "type": "inventory_levels.update",
  "created_at": "2025-06-30 12:54:31",
  "inventory_levels": [
    {
      "product_id": "QWhxek54UkQ3eTArdml2d1NkSDVnUT09",
      "shop_id": "bHF2M2pMakkzTVZ0NFh2SE1WNnNoUT09",
      "product_code": "10003",
      "in_stock": 10
    }
  ]
}
```

### 3. List Your Webhooks (GET)

Retrieve all existing webhook subscriptions for your account.

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET https://api.salesplaypos.com/v1.0/webhookss \
  -H "Authorization: Bearer YOUR_TOKEN"
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
const response = await fetch('https://api.salesplaypos.com/v1.0/webhookss', {
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
});
const data = await response.json();
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

response = requests.get(
    'https://api.salesplaypos.com/v1.0/webhookss', 
    headers={'Authorization': 'Bearer YOUR_TOKEN'}
)
print(response.json())
```

  </TabItem>
  <TabItem value="php" label="PHP">

```php
$ch = curl_init('https://api.salesplaypos.com/v1.0/webhookss');
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer YOUR_TOKEN']);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
echo curl_exec($ch);
```

  </TabItem>
  <TabItem value="java" label="Java (Standard)">

```java
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.salesplaypos.com/v1.0/webhookss"))
    .header("Authorization", "Bearer YOUR_TOKEN")
    .GET().build();
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
ResponseEntity<List> response = restTemplate.exchange(
    "https://api.salesplaypos.com/v1.0/webhookss", 
    HttpMethod.GET, 
    entity, 
    List.class
);
```

  </TabItem>
  <TabItem value="csharp" label="C# (.NET)">

```csharp
var response = await client.GetAsync("https://api.salesplaypos.com/v1.0/webhookss");
```

  </TabItem>
</Tabs>

### 4. Update a Webhook (PUT)

Modify an existing webhook subscription by its ID.

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X PUT https://api.salesplaypos.com/v1.0/webhookss/WEBHOOK_ID \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "url": "https://your-server.com/webhookss-updated",
    "event": "inventory_levels.update"
  }'
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
await fetch('https://api.salesplaypos.com/v1.0/webhookss/WEBHOOK_ID', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer YOUR_TOKEN',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    url: 'https://your-server.com/webhookss-updated',
    event: 'inventory_levels.update'
  })
});
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

url = "https://api.salesplaypos.com/v1.0/webhookss/WEBHOOK_ID"
payload = {
    "url": "https://your-server.com/webhookss-updated",
    "event": "inventory_levels.update"
}
headers = {
    "Authorization": "Bearer YOUR_TOKEN",
    "Content-Type": "application/json"
}

response = requests.put(url, json=payload, headers=headers)
```

  </TabItem>
  <TabItem value="php" label="PHP">

```php
$data = json_encode([
    "url" => "https://your-server.com/webhookss-updated",
    "event" => "inventory_levels.update"
]);

$ch = curl_init('https://api.salesplaypos.com/v1.0/webhookss/WEBHOOK_ID');
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer YOUR_TOKEN', 'Content-Type: application/json']);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "PUT");
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
echo curl_exec($ch);
```

  </TabItem>
  <TabItem value="java" label="Java (Standard)">

```java
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.salesplaypos.com/v1.0/webhookss/WEBHOOK_ID"))
    .header("Authorization", "Bearer YOUR_TOKEN")
    .header("Content-Type", "application/json")
    .PUT(HttpRequest.BodyPublishers.ofString("{\"url\":\"...\",\"event\":\"...\"}"))
    .build();
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
Map<String, String> body = Map.of(
    "url", "https://your-server.com/webhookss-updated",
    "event", "inventory_levels.update"
);

HttpEntity<Map<String, String>> request = new HttpEntity<>(body, headers);
restTemplate.put("https://api.salesplaypos.com/v1.0/webhookss/WEBHOOK_ID", request);
```

  </TabItem>
  <TabItem value="csharp" label="C# (.NET)">

```csharp
var payload = new { url = "...", @event = "..." };
var content = JsonContent.Create(payload);
var response = await client.PutAsync("https://api.salesplaypos.com/v1.0/webhookss/WEBHOOK_ID", content);
```

  </TabItem>
</Tabs>

### 5. Remove a Webhook (DELETE)

Delete an existing webhook subscription by its ID.

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X DELETE https://api.salesplaypos.com/v1.0/webhookss/WEBHOOK_ID \
  -H "Authorization: Bearer YOUR_TOKEN"
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
await fetch('https://api.salesplaypos.com/v1.0/webhookss/WEBHOOK_ID', {
  method: 'DELETE',
  headers: { 'Authorization': 'Bearer YOUR_TOKEN' }
});
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

url = "https://api.salesplaypos.com/v1.0/webhookss/WEBHOOK_ID"
response = requests.delete(
    url, 
    headers={'Authorization': 'Bearer YOUR_TOKEN'}
)
```

  </TabItem>
  <TabItem value="php" label="PHP">

```php
$ch = curl_init('https://api.salesplaypos.com/v1.0/webhookss/WEBHOOK_ID');
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Authorization: Bearer YOUR_TOKEN']);
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
echo curl_exec($ch);
```

  </TabItem>
  <TabItem value="java" label="Java (Standard)">

```java
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.salesplaypos.com/v1.0/webhookss/WEBHOOK_ID"))
    .header("Authorization", "Bearer YOUR_TOKEN")
    .DELETE().build();
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
restTemplate.delete("https://api.salesplaypos.com/v1.0/webhooks/WEBHOOK_ID");
```

  </TabItem>
  <TabItem value="csharp" label="C# (.NET)">

```csharp
var response = await client.DeleteAsync("https://api.salesplaypos.com/v1.0/webhooks/WEBHOOK_ID");
```

  </TabItem>
</Tabs>

---

## Testing Your Webhook

When using the web interface, you can validate your setup by triggering a **Test Notification**. SalesPlay will send a sample POST request to your URL. 

To receive and inspect these requests during development, you can:
- Use your own local server with a tunnel (like [ngrok](https://ngrok.com)).
- Use online testing services like [Beeceptor](https://beeceptor.com).

---

## Timeouts and Retries

> **🔒 Reliability is Key**
> 
> Your endpoint **must** return a `2xx` HTTP status code. Any other response (or a redirect) will be treated as a failure.
> 
> - **Retries**: SalesPlay will attempt to resend failed requests up to **200 times** over a **48-hour** window.
> - **Auto-Disable**: If no successful response is received after this period, the webhook will be automatically set to **"Disabled"**.

---

## API Reference

For detailed specifications, visit the **[Webhook API Suite Reference](../API-reference/Webhooks)**
