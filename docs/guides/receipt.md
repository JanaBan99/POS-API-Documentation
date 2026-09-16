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
  <TabItem value="php" label="PHP">

```php
<?php
// ── Service ─────────────────────────────────────────
// services/ReceiptService.php

class ReceiptService
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

    // Get all receipts
    public function getAll(): array
    {
        return $this->request('GET', '/receipts');
    }

    // Get single receipt by ID
    public function getById(string $id): array
    {
        return $this->request('GET', "/receipts/{$id}");
    }
}

// ── Controller ──────────────────────────────────────
// controllers/ReceiptController.php

class ReceiptController
{
    public function __construct(private ReceiptService $service) {}

    // GET /receipts
    public function index(): void
    {
        $receipts = $this->service->getAll();
        header('Content-Type: application/json');
        echo json_encode($receipts);
    }

    // GET /receipts?id={id}
    public function show(string $id): void
    {
        $receipt = $this->service->getById($id);
        header('Content-Type: application/json');
        echo json_encode($receipt);
    }
}

// ── Router ──────────────────────────────────────────
// index.php

$controller = new ReceiptController(new ReceiptService());
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
// app/Services/ReceiptService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ReceiptService
{
    private function client()
    {
        return Http::withToken(config('salesplay.access_token'))
                   ->acceptJson()
                   ->baseUrl(config('salesplay.base_url'));
    }

    // Get all receipts
    public function getAll(): array
    {
        $response = $this->client()->get('/receipts');
        $response->throw();
        return $response->json();
    }

    // Get single receipt by ID
    public function getById(string $id): array
    {
        $response = $this->client()->get("/receipts/{$id}");
        $response->throw();
        return $response->json();
    }
}

// ── Controller ──────────────────────────────────────
// app/Http/Controllers/ReceiptController.php

// GET /api/receipts
public function index(): JsonResponse
{
    $receipts = $this->service->getAll();
    return response()->json($receipts);
}

// GET /api/receipts/{id}
public function show(string $id): JsonResponse
{
    $receipt = $this->service->getById($id);
    return response()->json($receipt);
}

// ── Routes ──────────────────────────────────────────
// routes/api.php

Route::get('/receipts',      [ReceiptController::class, 'index']);
Route::get('/receipts/{id}', [ReceiptController::class, 'show']);
```

  </TabItem>
  <TabItem value="express" label="Node.js / Express">

```javascript
// ── Service ─────────────────────────────────────────
// services/receiptService.js

const axios = require('axios');
const { baseUrl, accessToken } = require('../config/salesplay');

const client = axios.create({
  baseURL: baseUrl,
  headers: { Authorization: `Bearer ${accessToken}` },
});

// Get all receipts
const getAll = async () => {
  const { data } = await client.get('/receipts');
  return data;
};

// Get single receipt by ID
const getById = async (id) => {
  const { data } = await client.get(`/receipts/${id}`);
  return data;
};

module.exports = { getAll, getById };

// ── Controller ──────────────────────────────────────
// controllers/receiptController.js

// GET /api/receipts
const index = async (req, res) => {
  const receipts = await receiptService.getAll();
  res.json(receipts);
};

// GET /api/receipts/:id
const show = async (req, res) => {
  const receipt = await receiptService.getById(req.params.id);
  res.json(receipt);
};

// ── Routes ──────────────────────────────────────────
// routes/receipts.js

router.get('/',    asyncHandler(ctrl.index));
router.get('/:id', asyncHandler(ctrl.show));
```

  </TabItem>
  <TabItem value="fastapi" label="Python / FastAPI">

```python
# ── Service ─────────────────────────────────────────
# services/receipt_service.py

import httpx
from config.salesplay import settings

HEADERS = {"Authorization": f"Bearer {settings.access_token}"}

# Get all receipts
async def get_all() -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.base_url}/receipts",
            headers=HEADERS
        )
        response.raise_for_status()
        return response.json()

# Get single receipt by ID
async def get_by_id(receipt_id: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.base_url}/receipts/{receipt_id}",
            headers=HEADERS
        )
        response.raise_for_status()
        return response.json()

# ── Controller ──────────────────────────────────────
# controllers/receipt_controller.py

# GET /api/receipts
@router.get("/")
async def index():
    return await service.get_all()

# GET /api/receipts/{id}
@router.get("/{receipt_id}")
async def show(receipt_id: str):
    return await service.get_by_id(receipt_id)
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
// ── Service ─────────────────────────────────────────
// services/ReceiptService.java

@Service
public class ReceiptService {

    // Get all receipts
    public String getAll() {
        HttpEntity<Void> entity = new HttpEntity<>(headers());
        return restTemplate.exchange(
            url("/receipts"), HttpMethod.GET, entity, String.class
        ).getBody();
    }

    // Get single receipt by ID
    public String getById(String id) {
        HttpEntity<Void> entity = new HttpEntity<>(headers());
        return restTemplate.exchange(
            url("/receipts/" + id), HttpMethod.GET, entity, String.class
        ).getBody();
    }
}

// ── Controller ──────────────────────────────────────
// controllers/ReceiptController.java

// GET /receipts
@GetMapping
public ResponseEntity<String> index() {
    return ResponseEntity.ok(receiptService.getAll());
}

// GET /receipts/{id}
@GetMapping("/{id}")
public ResponseEntity<String> show(@PathVariable String id) {
    return ResponseEntity.ok(receiptService.getById(id));
}
```

  </TabItem>
</Tabs>

- See [**Get Receipts**](/API-reference/receipts/get-receipts) in API reference.
---

## Get Void Receipts

Retrieve a list of all voided receipts.

<Tabs>
  <TabItem value="php" label="PHP">

```php
<?php
// ── Service ─────────────────────────────────────────
// services/ReceiptService.php

// Retrieve all void receipts
public function getVoidReceipts(array $params = []): array
{
    $query = http_build_query($params);
    return $this->request('GET', "/receipts/void?{$query}");
}

// ── Controller ──────────────────────────────────────
// controllers/ReceiptController.php

// GET /receipts/void
public function getVoidReceipts(): void
{
    $params = $_GET ?? [];
    $receipts = $this->service->getVoidReceipts($params);

    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode($receipts);
}

// ── Router ──────────────────────────────────────────
// index.php

if ($method === 'GET' && $path === '/receipts/void') {
    $controller->getVoidReceipts();
}
```

  </TabItem>
  <TabItem value="laravel" label="Laravel">

```php
<?php
// ── Service ─────────────────────────────────────────
// app/Services/ReceiptService.php

// Retrieve all void receipts
public function getVoidReceipts(array $params = []): array
{
    $response = $this->client()->get('/receipts/void', $params);
    $response->throw();
    return $response->json();
}

// ── Controller ──────────────────────────────────────
// app/Http/Controllers/ReceiptController.php

// GET /api/receipts/void
public function getVoidReceipts(Request $request): JsonResponse
{
    $params = $request->only(['page', 'limit', 'from', 'to']);
    $receipts = $this->service->getVoidReceipts($params);
    return response()->json($receipts, 200);
}

// ── Routes ──────────────────────────────────────────
// routes/api.php

Route::get('/receipts/void', [ReceiptController::class, 'getVoidReceipts']);
```

  </TabItem>
  <TabItem value="express" label="Node.js / Express">

```javascript
// ── Service ─────────────────────────────────────────
// services/receiptService.js

// Retrieve all void receipts
const getVoidReceipts = async (params = {}) => {
  const { data } = await client.get('/receipts/void', { params });
  return data;
};

module.exports = { getVoidReceipts };

// ── Controller ──────────────────────────────────────
// controllers/receiptController.js

// GET /api/receipts/void
const getVoidReceipts = async (req, res) => {
  const { page, limit, from, to } = req.query;
  const receipts = await receiptService.getVoidReceipts({ page, limit, from, to });
  res.status(200).json(receipts);
};

// ── Routes ──────────────────────────────────────────
// routes/receipts.js

router.get('/void', asyncHandler(ctrl.getVoidReceipts));
```

  </TabItem>
  <TabItem value="fastapi" label="Python / FastAPI">

```python
# ── Service ─────────────────────────────────────────
# services/receipt_service.py

# Retrieve all void receipts
async def get_void_receipts(params: dict = {}) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.base_url}/receipts/void",
            params=params,
            headers=HEADERS
        )
        response.raise_for_status()
        return response.json()

# ── Controller ──────────────────────────────────────
# controllers/receipt_controller.py

# GET /api/receipts/void
@router.get("/void", status_code=200)
async def get_void_receipts(
    page: Optional[int] = None,
    limit: Optional[int] = None,
    from_date: Optional[str] = None,
    to_date: Optional[str] = None,
):
    params = {k: v for k, v in {
        "page": page,
        "limit": limit,
        "from": from_date,
        "to": to_date,
    }.items() if v is not None}
    return await service.get_void_receipts(params)
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
// ── Service ─────────────────────────────────────────
// services/ReceiptService.java

// Retrieve all void receipts
public String getVoidReceipts(Map<String, String> params) {
    String query = params.entrySet().stream()
        .map(e -> e.getKey() + "=" + e.getValue())
        .collect(Collectors.joining("&"));
    HttpEntity<Void> entity = new HttpEntity<>(headers());
    return restTemplate.exchange(
        url("/receipts/void?" + query),
        HttpMethod.GET,
        entity,
        String.class
    ).getBody();
}

// ── Controller ──────────────────────────────────────
// controllers/ReceiptController.java

// GET /receipts/void
@GetMapping("/void")
public ResponseEntity<String> getVoidReceipts(
    @RequestParam Map<String, String> params
) {
    return ResponseEntity.ok(receiptService.getVoidReceipts(params));
}
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