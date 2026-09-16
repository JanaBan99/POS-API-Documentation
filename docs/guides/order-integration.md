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
  <TabItem value="php" label="PHP">

```php
<?php
// ── Service ─────────────────────────────────────────
// services/OrderService.php

class OrderService
{
    private string $baseUrl;
    private string $token;

    public function __construct()
    {
        $this->baseUrl = $_ENV['SALESPLAY_BASE_URL'];
        $this->token   = $_ENV['SALESPLAY_ACCESS_TOKEN'];
    }

    private function request(string $method, string $path, array $body = []): array
    {
        $ch = curl_init($this->baseUrl . $path);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, $method);
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Authorization: Bearer ' . $this->token,
            'Content-Type: application/json',
        ]);

        if (!empty($body)) {
            curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        }

        $response = curl_exec($ch);
        curl_close($ch);
        return json_decode($response, true);
    }

    // Get all orders
    public function getAll(): array
    {
        return $this->request('GET', '/orders');
    }

    // Get single order by ID
    public function getById(string $id): array
    {
        return $this->request('GET', "/orders/{$id}");
    }
}

// ── Controller ──────────────────────────────────────
// controllers/OrderController.php

class OrderController
{
    public function __construct(private OrderService $service) {}

    // GET /orders
    public function index(): void
    {
        $orders = $this->service->getAll();
        header('Content-Type: application/json');
        echo json_encode($orders);
    }

    // GET /orders?id={id}
    public function show(string $id): void
    {
        $order = $this->service->getById($id);
        header('Content-Type: application/json');
        echo json_encode($order);
    }
}

// ── Router ──────────────────────────────────────────
// index.php

$controller = new OrderController(new OrderService());
$method     = $_SERVER['REQUEST_METHOD'];
$id         = $_GET['id'] ?? null;

if ($method === 'GET' && $id) {
    $controller->show($id);
} elseif ($method === 'GET') {
    $controller->index();
}
```

  </TabItem>
  <TabItem value="laravel" label="Laravel">

```php
<?php
// ── Service ─────────────────────────────────────────
// app/Services/OrderService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class OrderService
{
    private function client()
    {
        return Http::withToken(config('salesplay.access_token'))
                   ->acceptJson()
                   ->baseUrl(config('salesplay.base_url'));
    }

    // Get all orders
    public function getAll(): array
    {
        $response = $this->client()->get('/orders');
        $response->throw();
        return $response->json();
    }

    // Get single order by ID
    public function getById(string $id): array
    {
        $response = $this->client()->get("/orders/{$id}");
        $response->throw();
        return $response->json();
    }
}

// ── Controller ──────────────────────────────────────
// app/Http/Controllers/OrderController.php

// GET /api/orders
public function index(): JsonResponse
{
    $orders = $this->service->getAll();
    return response()->json($orders);
}

// GET /api/orders/{id}
public function show(string $id): JsonResponse
{
    $order = $this->service->getById($id);
    return response()->json($order);
}

// ── Routes ──────────────────────────────────────────
// routes/api.php

Route::get('/orders',      [OrderController::class, 'index']);
Route::get('/orders/{id}', [OrderController::class, 'show']);
```

  </TabItem>
  <TabItem value="express" label="Node.js / Express">

```javascript
// ── Service ─────────────────────────────────────────
// services/orderService.js

const axios = require('axios');
const { baseUrl, accessToken } = require('../config/salesplay');

const client = axios.create({
  baseURL: baseUrl,
  headers: { Authorization: `Bearer ${accessToken}` },
});

// Get all orders
const getAll = async () => {
  const { data } = await client.get('/orders');
  return data;
};

// Get single order by ID
const getById = async (id) => {
  const { data } = await client.get(`/orders/${id}`);
  return data;
};

module.exports = { getAll, getById };

// ── Controller ──────────────────────────────────────
// controllers/orderController.js

// GET /api/orders
const index = async (req, res) => {
  const orders = await orderService.getAll();
  res.json(orders);
};

// GET /api/orders/:id
const show = async (req, res) => {
  const order = await orderService.getById(req.params.id);
  res.json(order);
};

// ── Routes ──────────────────────────────────────────
// routes/orders.js

router.get('/',    asyncHandler(ctrl.index));
router.get('/:id', asyncHandler(ctrl.show));
```

  </TabItem>
  <TabItem value="fastapi" label="Python / FastAPI">

```python
# ── Service ─────────────────────────────────────────
# services/order_service.py

import httpx
from config.salesplay import settings

HEADERS = {"Authorization": f"Bearer {settings.access_token}"}

# Get all orders
async def get_all() -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.base_url}/orders",
            headers=HEADERS
        )
        response.raise_for_status()
        return response.json()

# Get single order by ID
async def get_by_id(order_id: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.base_url}/orders/{order_id}",
            headers=HEADERS
        )
        response.raise_for_status()
        return response.json()

# ── Controller ──────────────────────────────────────
# controllers/order_controller.py

# GET /api/orders
@router.get("/")
async def index():
    return await service.get_all()

# GET /api/orders/{id}
@router.get("/{order_id}")
async def show(order_id: str):
    return await service.get_by_id(order_id)
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
// ── Service ─────────────────────────────────────────
// services/OrderService.java

@Service
public class OrderService {

    // Get all orders
    public String getAll() {
        HttpEntity<Void> entity = new HttpEntity<>(headers());
        return restTemplate.exchange(
            url("/orders"), HttpMethod.GET, entity, String.class
        ).getBody();
    }

    // Get single order by ID
    public String getById(String id) {
        HttpEntity<Void> entity = new HttpEntity<>(headers());
        return restTemplate.exchange(
            url("/orders/" + id), HttpMethod.GET, entity, String.class
        ).getBody();
    }
}

// ── Controller ──────────────────────────────────────
// controllers/OrderController.java

// GET /orders
@GetMapping
public ResponseEntity<String> index() {
    return ResponseEntity.ok(orderService.getAll());
}

// GET /orders/{id}
@GetMapping("/{id}")
public ResponseEntity<String> show(@PathVariable String id) {
    return ResponseEntity.ok(orderService.getById(id));
}
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