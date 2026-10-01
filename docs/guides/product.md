---
description: "Create, update and retrieve products in SalesPlay via the API, including category, pricing, tax, stock control and images, with examples in six languages."
title: Creating and Managing Products
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Creating and Managing Products

Products are the items your merchants sell through the SalesPlay POS. Each product must belong to a category. This guide covers how to implement **Get, Create, and Edit** product operations on your backend.

---

## Product Object

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `product_code` | string | ✅ Yes | The code of the product |
| `product_name` | string | ✅ Yes | The name of the product |
| `cost` | string | ✅ Yes | The cost of the product |
| `stock_control` | boolean | ✅ Yes | Indicates if stock control is enabled |
| `product_price_change` | boolean | ✅ Yes | Indicates if product price change is allowed |
| `qty_change_option` | boolean | ✅ Yes | Indicates if quantity change option is enabled |
| `expire_mode` | boolean | ✅ Yes | Indicates if expiration mode is enabled |
| `is_composite` | boolean | ✅ Yes | Indicates if the product is a composite |
| `use_production` | boolean | ✅ Yes | Indicates if production is used |
| `is_variant` | boolean | ✅ Yes | Indicates if the product is a variant |

- To see the complete list of available fields, click here:
**[View All Fields](/API-reference/products/create-product)**     
---


## Create Product

Create a new product by sending a `POST` request. A valid `category_id` is required. Send a `POST` request to `https://api.salesplaypos.com/v1.0/products` with a Bearer token in the `Authorization` header and the product fields as a JSON body.

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X POST "https://api.salesplaypos.com/v1.0/products" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "product_code": "string",
  "product_name": "string",
  "barcode": "string",
  "description": "string",
  "category_id": "string",
  "sub_category_id": "string",
  "measurement_id": "string",
  "cost": "string",
  "stock_control": true,
  "product_price_change": true,
  "qty_change_option": true,
  "expire_mode": true,
  "is_composite": false,
  "use_production": false,
  "is_variant": true,
  "components": [
    {}
  ],
  "tax_ids": [
    "string"
  ],
  "modifiers_ids": [
    "string"
  ],
  "option1_name": "string",
  "option2_name": "string",
  "option3_name": "string",
  "created_at": "2025-01-15 10:30:00",
  "updated_at": "2025-01-15 10:30:00",
  "variants": [
    {
      "product_code": "string",
      "option1_value": "string",
      "option2_value": "string",
      "option3_value": "string",
      "barcode": "string",
      "default_cost": 0.0,
      "shops": [
        {
          "store_id": "string",
          "price": "string",
          "available_for_sale": true,
          "safety_stock": "string"
        }
      ]
    }
  ],
  "shops": [
    {
      "shop_id": "string",
      "price": "string",
      "available_for_sale": true,
      "safety_stock": "string"
    }
  ]
}'
```

  </TabItem>

  <TabItem value="js" label="JavaScript">

```javascript
const res = await fetch("https://api.salesplaypos.com/v1.0/products", {
  method: "POST",
  headers: {
    "Authorization": "Bearer YOUR_ACCESS_TOKEN",
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
  "product_code": "string",
  "product_name": "string",
  "barcode": "string",
  "description": "string",
  "category_id": "string",
  "sub_category_id": "string",
  "measurement_id": "string",
  "cost": "string",
  "stock_control": true,
  "product_price_change": true,
  "qty_change_option": true,
  "expire_mode": true,
  "is_composite": false,
  "use_production": false,
  "is_variant": true,
  "components": [
    {}
  ],
  "tax_ids": [
    "string"
  ],
  "modifiers_ids": [
    "string"
  ],
  "option1_name": "string",
  "option2_name": "string",
  "option3_name": "string",
  "created_at": "2025-01-15 10:30:00",
  "updated_at": "2025-01-15 10:30:00",
  "variants": [
    {
      "product_code": "string",
      "option1_value": "string",
      "option2_value": "string",
      "option3_value": "string",
      "barcode": "string",
      "default_cost": 0.0,
      "shops": [
        {
          "store_id": "string",
          "price": "string",
          "available_for_sale": true,
          "safety_stock": "string"
        }
      ]
    }
  ],
  "shops": [
    {
      "shop_id": "string",
      "price": "string",
      "available_for_sale": true,
      "safety_stock": "string"
    }
  ]
}),
});
const data = await res.json();
```

  </TabItem>

  <TabItem value="python" label="Python">

```python
import requests

url = "https://api.salesplaypos.com/v1.0/products"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "product_code": "string",
    "product_name": "string",
    "barcode": "string",
    "description": "string",
    "category_id": "string",
    "sub_category_id": "string",
    "measurement_id": "string",
    "cost": "string",
    "stock_control": true,
    "product_price_change": true,
    "qty_change_option": true,
    "expire_mode": true,
    "is_composite": false,
    "use_production": false,
    "is_variant": true,
    "components": [
        {}
    ],
    "tax_ids": [
        "string"
    ],
    "modifiers_ids": [
        "string"
    ],
    "option1_name": "string",
    "option2_name": "string",
    "option3_name": "string",
    "created_at": "2025-01-15 10:30:00",
    "updated_at": "2025-01-15 10:30:00",
    "variants": [
        {
            "product_code": "string",
            "option1_value": "string",
            "option2_value": "string",
            "option3_value": "string",
            "barcode": "string",
            "default_cost": 0.0,
            "shops": [
                {
                    "store_id": "string",
                    "price": "string",
                    "available_for_sale": true,
                    "safety_stock": "string"
                }
            ]
        }
    ],
    "shops": [
        {
            "shop_id": "string",
            "price": "string",
            "available_for_sale": true,
            "safety_stock": "string"
        }
    ]
}
res = requests.post(url, json=payload, headers=headers)
print(res.json())
```

  </TabItem>

  <TabItem value="php" label="PHP">

```php
<?php
$ch = curl_init("https://api.salesplaypos.com/v1.0/products");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "POST");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"product_code": "string", "product_name": "string", "barcode": "string", "description": "string", "category_id": "string", "sub_category_id": "string", "measurement_id": "string", "cost": "string", "stock_control": true, "product_price_change": true, "qty_change_option": true, "expire_mode": true, "is_composite": false, "use_production": false, "is_variant": true, "components": [{}], "tax_ids": ["string"], "modifiers_ids": ["string"], "option1_name": "string", "option2_name": "string", "option3_name": "string", "created_at": "2025-01-15 10:30:00", "updated_at": "2025-01-15 10:30:00", "variants": [{"product_code": "string", "option1_value": "string", "option2_value": "string", "option3_value": "string", "barcode": "string", "default_cost": 0.0, "shops": [{"store_id": "string", "price": "string", "available_for_sale": true, "safety_stock": "string"}]}], "shops": [{"shop_id": "string", "price": "string", "available_for_sale": true, "safety_stock": "string"}]}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/products"))
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
var request = new HttpRequestMessage(new HttpMethod("POST"), "https://api.salesplaypos.com/v1.0/products");
request.Headers.Add("Authorization", "Bearer YOUR_ACCESS_TOKEN");
request.Content = new StringContent(payload, Encoding.UTF8, "application/json");
var response = await client.SendAsync(request);
var body = await response.Content.ReadAsStringAsync();
```

  </TabItem>

</Tabs>

> **💡 Tip**
> Save the returned `id` — you will need it when adding products to an order.

- To create a product via the API, refer to the [Create Product](/API-reference/products/create-product) API reference.

---

## Get Products

Retrieve all products or fetch a single product by ID. Send a `GET` request to `https://api.salesplaypos.com/v1.0/products` with a Bearer token in the `Authorization` header and any filters (`product_ids`, date range, `limit`, `cursor`) as a JSON body — query-string parameters are ignored.

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/products" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
  "product_ids": "string",
  "created_at_min": "2025-01-15 10:30:00",
  "created_at_max": "2025-01-15 10:30:00",
  "updated_at_min": "2025-01-15 10:30:00",
  "updated_at_max": "2025-01-15 10:30:00",
  "limit": 10,
  "cursor": "string"
}'
```

  </TabItem>

  <TabItem value="js" label="JavaScript">

```javascript
import https from "node:https";

const payload = JSON.stringify({
  "product_ids": "string",
  "created_at_min": "2025-01-15 10:30:00",
  "created_at_max": "2025-01-15 10:30:00",
  "updated_at_min": "2025-01-15 10:30:00",
  "updated_at_max": "2025-01-15 10:30:00",
  "limit": 10,
  "cursor": "string"
});

const req = https.request("https://api.salesplaypos.com/v1.0/products", {
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

url = "https://api.salesplaypos.com/v1.0/products"
headers = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}
payload = {
    "product_ids": "string",
    "created_at_min": "2025-01-15 10:30:00",
    "created_at_max": "2025-01-15 10:30:00",
    "updated_at_min": "2025-01-15 10:30:00",
    "updated_at_max": "2025-01-15 10:30:00",
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
$ch = curl_init("https://api.salesplaypos.com/v1.0/products");
curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode({"product_ids": "string", "created_at_min": "2025-01-15 10:30:00", "created_at_max": "2025-01-15 10:30:00", "updated_at_min": "2025-01-15 10:30:00", "updated_at_max": "2025-01-15 10:30:00", "limit": 10, "cursor": "string"}));
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
    .uri(URI.create("https://api.salesplaypos.com/v1.0/products"))
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
var request = new HttpRequestMessage(new HttpMethod("GET"), "https://api.salesplaypos.com/v1.0/products");
request.Headers.Add("Authorization", "Bearer YOUR_ACCESS_TOKEN");
request.Content = new StringContent(payload, Encoding.UTF8, "application/json");
var response = await client.SendAsync(request);
var body = await response.Content.ReadAsStringAsync();
```

  </TabItem>

</Tabs>

- See [**Get Products**](/API-reference/products/get-products) in API reference.
---

## Edit Product

There is no separate update call. `POST /products` creates a product, or updates it when the `product_code` already exists — send the same request as in [Create Product](#create-product) with the new values.

- For full request and response details, see the [**Create or Update Product**](/API-reference/products/create-product) API reference.

---

## Error Reference

| HTTP Status | Error Code | Meaning |
|-------------|------------|---------|
| `401` | `UNAUTHORIZED` | Invalid or expired access token |
| `404` | `NOT_FOUND` | Product ID does not exist |
| `409` | `DUPLICATE_SKU` | A product with the same SKU already exists |
| `422` | `VALIDATION_ERROR` | Missing or invalid fields |

---

## Next Steps

- **[Process & Manage Orders](order-integration)** — Create orders using your products.
- **[Generate Receipts](receipt)** — Generate receipts from completed orders.
- **[Process & Manage Inventory](/category/inventory)** — Get Inventory, Update Inventory.
- **[Process & Manage Online Orders](/category/online-orders)** — Place Online Order, Get Online Order Status, Cancel Online Order.
- **[Process & Manage POS Devices](/category/pos-devices)** — Get POS Devices.
- **[Every product endpoint](/category/products)** — the full `/products` reference, with fields, parameters and responses.