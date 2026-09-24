---
description: "Create, update and retrieve products in SalesPlay via the API, including category, pricing, tax, stock control and images, with examples in six languages."
title: Creating and Managing Products
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Creating and Managing Products

Products are the items your merchants sell through the SalesPlay POS. Each product must belong to a category. This guide covers how to implement **Get, Create, Edit, and Delete** product operations on your backend.

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
  <TabItem value="php" label="PHP">

```php
<?php
// ── Service ─────────────────────────────────────────
// services/ProductService.php

// Create a new product
public function create(array $data): array
{
    return $this->request('POST', '/products', $data);
}

// ── Controller ──────────────────────────────────────
// controllers/ProductController.php

// POST /products
public function store(): void
{
    $body = json_decode(file_get_contents('php://input'), true);

    if (empty($body['name'])) {
        http_response_code(422);
        echo json_encode(['error' => 'The name field is required.']);
        return;
    }

    if (empty($body['category_id'])) {
        http_response_code(422);
        echo json_encode(['error' => 'The category_id field is required.']);
        return;
    }

    if (!isset($body['price'])) {
        http_response_code(422);
        echo json_encode(['error' => 'The price field is required.']);
        return;
    }

    $data = array_filter([
        'name'        => $body['name'],
        'category_id' => $body['category_id'],
        'price'       => $body['price'],
        'description' => $body['description'] ?? null,
        'sku'         => $body['sku']         ?? null,
        'barcode'     => $body['barcode']     ?? null,
        'cost'        => $body['cost']        ?? null,
        'tax_rate'    => $body['tax_rate']    ?? null,
        'track_stock' => $body['track_stock'] ?? false,
        'stock_qty'   => $body['stock_qty']   ?? null,
        'is_active'   => $body['is_active']   ?? true,
    ], fn($value) => !is_null($value));

    $product = $this->service->create($data);

    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode($product);
}

// ── Router ──────────────────────────────────────────
// index.php

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $controller->store();
}
```

  </TabItem>
  <TabItem value="laravel" label="Laravel">

```php
<?php
// ── Service ─────────────────────────────────────────
// app/Services/ProductService.php

// Create a new product
public function create(array $data): array
{
    $response = $this->client()->post('/products', $data);
    $response->throw();
    return $response->json();
}

// ── Controller ──────────────────────────────────────
// app/Http/Controllers/ProductController.php

// POST /api/products
public function store(Request $request): JsonResponse
{
    $validated = $request->validate([
        'name'        => 'required|string|max:255',
        'category_id' => 'required|string',
        'price'       => 'required|numeric|min:0',
        'description' => 'nullable|string',
        'sku'         => 'nullable|string|max:100',
        'barcode'     => 'nullable|string|max:100',
        'cost'        => 'nullable|numeric|min:0',
        'tax_rate'    => 'nullable|numeric|min:0|max:100',
        'track_stock' => 'nullable|boolean',
        'stock_qty'   => 'nullable|integer|min:0',
        'is_active'   => 'nullable|boolean',
    ]);

    $product = $this->service->create($validated);
    return response()->json($product, 201);
}

// ── Routes ──────────────────────────────────────────
// routes/api.php

Route::post('/products', [ProductController::class, 'store']);
```

  </TabItem>
  <TabItem value="express" label="Node.js / Express">

```javascript
// ── Service ─────────────────────────────────────────
// services/productService.js

// Create a new product
const create = async (payload) => {
  const { data } = await client.post('/products', payload);
  return data;
};

module.exports = { create };

// ── Controller ──────────────────────────────────────
// controllers/productController.js

// POST /api/products
const store = async (req, res) => {
  const {
    name, category_id, price, description,
    sku, barcode, cost, tax_rate,
    track_stock, stock_qty, is_active,
  } = req.body;

  if (!name)        return res.status(422).json({ error: 'The name field is required.' });
  if (!category_id) return res.status(422).json({ error: 'The category_id field is required.' });
  if (price == null) return res.status(422).json({ error: 'The price field is required.' });

  const product = await productService.create({
    name, category_id, price, description,
    sku, barcode, cost, tax_rate,
    track_stock, stock_qty, is_active,
  });
  res.status(201).json(product);
};

// ── Routes ──────────────────────────────────────────
// routes/products.js

router.post('/', asyncHandler(ctrl.store));
```

  </TabItem>
  <TabItem value="fastapi" label="Python / FastAPI">

```python
# ── Service ─────────────────────────────────────────
# services/product_service.py

# Create a new product
async def create(data: dict) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.base_url}/products",
            json=data,
            headers=HEADERS
        )
        response.raise_for_status()
        return response.json()

# ── Controller ──────────────────────────────────────
# controllers/product_controller.py

class ProductRequest(BaseModel):
    name: str
    category_id: str
    price: float
    description: Optional[str] = None
    sku: Optional[str] = None
    barcode: Optional[str] = None
    cost: Optional[float] = None
    tax_rate: Optional[float] = None
    track_stock: Optional[bool] = False
    stock_qty: Optional[int] = None
    is_active: Optional[bool] = True

# POST /api/products
@router.post("/", status_code=201)
async def store(body: ProductRequest):
    return await service.create(body.model_dump(exclude_none=True))
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
// ── Service ─────────────────────────────────────────
// services/ProductService.java

// Create a new product
public String create(Map<String, Object> body) {
    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers());
    return restTemplate.postForEntity(
        url("/products"), entity, String.class
    ).getBody();
}

// ── Controller ──────────────────────────────────────
// controllers/ProductController.java

// POST /products
@PostMapping
public ResponseEntity<String> store(@RequestBody Map<String, Object> body) {
    if (!body.containsKey("name")) {
        return ResponseEntity.unprocessableEntity()
            .body("{\"error\": \"The name field is required.\"}");
    }
    if (!body.containsKey("category_id")) {
        return ResponseEntity.unprocessableEntity()
            .body("{\"error\": \"The category_id field is required.\"}");
    }
    if (!body.containsKey("price")) {
        return ResponseEntity.unprocessableEntity()
            .body("{\"error\": \"The price field is required.\"}");
    }
    return ResponseEntity.status(201).body(productService.create(body));
}
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
  <TabItem value="php" label="PHP">

```php
<?php
// ── Service ─────────────────────────────────────────
// services/ProductService.php

class ProductService
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

    // Get all products
    public function getAll(): array
    {
        return $this->request('GET', '/products');
    }

    // Get single product by ID
    public function getById(string $id): array
    {
        return $this->request('GET', "/products/{$id}");
    }
}

// ── Controller ──────────────────────────────────────
// controllers/ProductController.php

class ProductController
{
    public function __construct(private ProductService $service) {}

    // GET /products
    public function index(): void
    {
        $products = $this->service->getAll();
        header('Content-Type: application/json');
        echo json_encode($products);
    }

    // GET /products?id={id}
    public function show(string $id): void
    {
        $product = $this->service->getById($id);
        header('Content-Type: application/json');
        echo json_encode($product);
    }
}

// ── Router ──────────────────────────────────────────
// index.php

$controller = new ProductController(new ProductService());
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
// app/Services/ProductService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class ProductService
{
    private function client()
    {
        return Http::withToken(config('salesplay.access_token'))
                   ->acceptJson()
                   ->baseUrl(config('salesplay.base_url'));
    }

    // Get all products
    public function getAll(): array
    {
        $response = $this->client()->get('/products');
        $response->throw();
        return $response->json();
    }

    // Get single product by ID
    public function getById(string $id): array
    {
        $response = $this->client()->get("/products/{$id}");
        $response->throw();
        return $response->json();
    }
}

// ── Controller ──────────────────────────────────────
// app/Http/Controllers/ProductController.php

// GET /api/products
public function index(): JsonResponse
{
    $products = $this->service->getAll();
    return response()->json($products);
}

// GET /api/products/{id}
public function show(string $id): JsonResponse
{
    $product = $this->service->getById($id);
    return response()->json($product);
}

// ── Routes ──────────────────────────────────────────
// routes/api.php

Route::get('/products',      [ProductController::class, 'index']);
Route::get('/products/{id}', [ProductController::class, 'show']);
```

  </TabItem>
  <TabItem value="express" label="Node.js / Express">

```javascript
// ── Service ─────────────────────────────────────────
// services/productService.js

const axios = require('axios');
const { baseUrl, accessToken } = require('../config/salesplay');

const client = axios.create({
  baseURL: baseUrl,
  headers: { Authorization: `Bearer ${accessToken}` },
});

// Get all products
const getAll = async () => {
  const { data } = await client.get('/products');
  return data;
};

// Get single product by ID
const getById = async (id) => {
  const { data } = await client.get(`/products/${id}`);
  return data;
};

module.exports = { getAll, getById };

// ── Controller ──────────────────────────────────────
// controllers/productController.js

// GET /api/products
const index = async (req, res) => {
  const products = await productService.getAll();
  res.json(products);
};

// GET /api/products/:id
const show = async (req, res) => {
  const product = await productService.getById(req.params.id);
  res.json(product);
};

// ── Routes ──────────────────────────────────────────
// routes/products.js

router.get('/',    asyncHandler(ctrl.index));
router.get('/:id', asyncHandler(ctrl.show));
```

  </TabItem>
  <TabItem value="fastapi" label="Python / FastAPI">

```python
# ── Service ─────────────────────────────────────────
# services/product_service.py

import httpx
from config.salesplay import settings

HEADERS = {"Authorization": f"Bearer {settings.access_token}"}

# Get all products
async def get_all() -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.base_url}/products",
            headers=HEADERS
        )
        response.raise_for_status()
        return response.json()

# Get single product by ID
async def get_by_id(product_id: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.base_url}/products/{product_id}",
            headers=HEADERS
        )
        response.raise_for_status()
        return response.json()

# ── Controller ──────────────────────────────────────
# controllers/product_controller.py

# GET /api/products
@router.get("/")
async def index():
    return await service.get_all()

# GET /api/products/{id}
@router.get("/{product_id}")
async def show(product_id: str):
    return await service.get_by_id(product_id)
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
// ── Service ─────────────────────────────────────────
// services/ProductService.java

@Service
public class ProductService {

    // Get all products
    public String getAll() {
        HttpEntity<Void> entity = new HttpEntity<>(headers());
        return restTemplate.exchange(
            url("/products"), HttpMethod.GET, entity, String.class
        ).getBody();
    }

    // Get single product by ID
    public String getById(String id) {
        HttpEntity<Void> entity = new HttpEntity<>(headers());
        return restTemplate.exchange(
            url("/products/" + id), HttpMethod.GET, entity, String.class
        ).getBody();
    }
}

// ── Controller ──────────────────────────────────────
// controllers/ProductController.java

// GET /products
@GetMapping
public ResponseEntity<String> index() {
    return ResponseEntity.ok(productService.getAll());
}

// GET /products/{id}
@GetMapping("/{id}")
public ResponseEntity<String> show(@PathVariable String id) {
    return ResponseEntity.ok(productService.getById(id));
}
```

  </TabItem>
</Tabs>

- See [**Get Products**](/API-reference/products/get-products) in API reference.
---

## Edit Product

Update an existing product by sending a `PUT` request. All fields are optional — only include what needs updating.

<Tabs>
  <TabItem value="php" label="PHP">

```php
<?php
// ── Service ─────────────────────────────────────────
// services/ProductService.php

// Update a product
public function update(string $id, array $data): array
{
    return $this->request('PUT', "/products/{$id}", $data);
}

// ── Controller ──────────────────────────────────────
// controllers/ProductController.php

// PUT /products?id={id}
public function update(string $id): void
{
    $body = json_decode(file_get_contents('php://input'), true);

    $data = array_filter([
        'name'        => $body['name']        ?? null,
        'category_id' => $body['category_id'] ?? null,
        'price'       => $body['price']       ?? null,
        'description' => $body['description'] ?? null,
        'sku'         => $body['sku']         ?? null,
        'barcode'     => $body['barcode']     ?? null,
        'cost'        => $body['cost']        ?? null,
        'tax_rate'    => $body['tax_rate']    ?? null,
        'track_stock' => $body['track_stock'] ?? null,
        'stock_qty'   => $body['stock_qty']   ?? null,
        'is_active'   => $body['is_active']   ?? null,
    ], fn($value) => !is_null($value));

    $product = $this->service->update($id, $data);

    header('Content-Type: application/json');
    echo json_encode($product);
}

// ── Router ──────────────────────────────────────────
// index.php

if ($_SERVER['REQUEST_METHOD'] === 'PUT' && $id) {
    $controller->update($id);
}
```

  </TabItem>
  <TabItem value="laravel" label="Laravel">

```php
<?php
// ── Service ─────────────────────────────────────────
// app/Services/ProductService.php

// Update a product
public function update(string $id, array $data): array
{
    $response = $this->client()->put("/products/{$id}", $data);
    $response->throw();
    return $response->json();
}

// ── Controller ──────────────────────────────────────
// app/Http/Controllers/ProductController.php

// PUT /api/products/{id}
public function update(Request $request, string $id): JsonResponse
{
    $validated = $request->validate([
        'name'        => 'sometimes|string|max:255',
        'category_id' => 'sometimes|string',
        'price'       => 'sometimes|numeric|min:0',
        'description' => 'nullable|string',
        'sku'         => 'nullable|string|max:100',
        'barcode'     => 'nullable|string|max:100',
        'cost'        => 'nullable|numeric|min:0',
        'tax_rate'    => 'nullable|numeric|min:0|max:100',
        'track_stock' => 'nullable|boolean',
        'stock_qty'   => 'nullable|integer|min:0',
        'is_active'   => 'nullable|boolean',
    ]);

    $product = $this->service->update($id, $validated);
    return response()->json($product);
}

// ── Routes ──────────────────────────────────────────
// routes/api.php

Route::put('/products/{id}', [ProductController::class, 'update']);
```

  </TabItem>
  <TabItem value="express" label="Node.js / Express">

```javascript
// ── Service ─────────────────────────────────────────
// services/productService.js

// Update a product
const update = async (id, payload) => {
  const { data } = await client.put(`/products/${id}`, payload);
  return data;
};

module.exports = { update };

// ── Controller ──────────────────────────────────────
// controllers/productController.js

// PUT /api/products/:id
const update = async (req, res) => {
  const product = await productService.update(req.params.id, req.body);
  res.json(product);
};

// ── Routes ──────────────────────────────────────────
// routes/products.js

router.put('/:id', asyncHandler(ctrl.update));
```

  </TabItem>
  <TabItem value="fastapi" label="Python / FastAPI">

```python
# ── Service ─────────────────────────────────────────
# services/product_service.py

# Update a product
async def update(product_id: str, data: dict) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"{settings.base_url}/products/{product_id}",
            json=data,
            headers=HEADERS
        )
        response.raise_for_status()
        return response.json()

# ── Controller ──────────────────────────────────────
# controllers/product_controller.py

class ProductUpdateRequest(BaseModel):
    name: Optional[str] = None
    category_id: Optional[str] = None
    price: Optional[float] = None
    description: Optional[str] = None
    sku: Optional[str] = None
    barcode: Optional[str] = None
    cost: Optional[float] = None
    tax_rate: Optional[float] = None
    track_stock: Optional[bool] = None
    stock_qty: Optional[int] = None
    is_active: Optional[bool] = None

# PUT /api/products/{id}
@router.put("/{product_id}")
async def update(product_id: str, body: ProductUpdateRequest):
    return await service.update(
        product_id,
        body.model_dump(exclude_none=True)
    )
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
// ── Service ─────────────────────────────────────────
// services/ProductService.java

// Update a product
public String update(String id, Map<String, Object> body) {
    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers());
    return restTemplate.exchange(
        url("/products/" + id), HttpMethod.PUT, entity, String.class
    ).getBody();
}

// ── Controller ──────────────────────────────────────
// controllers/ProductController.java

// PUT /products/{id}
@PutMapping("/{id}")
public ResponseEntity<String> update(
    @PathVariable String id,
    @RequestBody Map<String, Object> body
) {
    return ResponseEntity.ok(productService.update(id, body));
}
```

  </TabItem>
</Tabs>

---

## Delete Product

Permanently remove a product by sending a `DELETE` request with its ID.

> **⚠️ Warning**
> Deleting a product that is part of existing orders may affect historical records. Consider setting `is_active: false` to hide it instead of deleting.

<Tabs>
  <TabItem value="php" label="PHP">

```php
<?php
// ── Service ─────────────────────────────────────────
// services/ProductService.php

// Delete a product
public function delete(string $id): bool
{
    $this->request('DELETE', "/products/{$id}");
    return true;
}

// ── Controller ──────────────────────────────────────
// controllers/ProductController.php

// DELETE /products?id={id}
public function destroy(string $id): void
{
    $this->service->delete($id);

    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode(['message' => 'Product deleted successfully']);
}

// ── Router ──────────────────────────────────────────
// index.php

if ($_SERVER['REQUEST_METHOD'] === 'DELETE' && $id) {
    $controller->destroy($id);
}
```

  </TabItem>
  <TabItem value="laravel" label="Laravel">

```php
<?php
// ── Service ─────────────────────────────────────────
// app/Services/ProductService.php

// Delete a product
public function delete(string $id): bool
{
    $response = $this->client()->delete("/products/{$id}");
    $response->throw();
    return true;
}

// ── Controller ──────────────────────────────────────
// app/Http/Controllers/ProductController.php

// DELETE /api/products/{id}
public function destroy(string $id): JsonResponse
{
    $this->service->delete($id);
    return response()->json(['message' => 'Product deleted successfully']);
}

// ── Routes ──────────────────────────────────────────
// routes/api.php

Route::delete('/products/{id}', [ProductController::class, 'destroy']);
```

  </TabItem>
  <TabItem value="express" label="Node.js / Express">

```javascript
// ── Service ─────────────────────────────────────────
// services/productService.js

// Delete a product
const remove = async (id) => {
  await client.delete(`/products/${id}`);
  return true;
};

module.exports = { remove };

// ── Controller ──────────────────────────────────────
// controllers/productController.js

// DELETE /api/products/:id
const destroy = async (req, res) => {
  await productService.remove(req.params.id);
  res.json({ message: 'Product deleted successfully' });
};

// ── Routes ──────────────────────────────────────────
// routes/products.js

router.delete('/:id', asyncHandler(ctrl.destroy));
```

  </TabItem>
  <TabItem value="fastapi" label="Python / FastAPI">

```python
# ── Service ─────────────────────────────────────────
# services/product_service.py

# Delete a product
async def delete(product_id: str) -> bool:
    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"{settings.base_url}/products/{product_id}",
            headers=HEADERS
        )
        response.raise_for_status()
        return True

# ── Controller ──────────────────────────────────────
# controllers/product_controller.py

# DELETE /api/products/{id}
@router.delete("/{product_id}")
async def destroy(product_id: str):
    await service.delete(product_id)
    return {"message": "Product deleted successfully"}
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
// ── Service ─────────────────────────────────────────
// services/ProductService.java

// Delete a product
public void delete(String id) {
    HttpEntity<Void> entity = new HttpEntity<>(headers());
    restTemplate.exchange(
        url("/products/" + id), HttpMethod.DELETE, entity, String.class
    );
}

// ── Controller ──────────────────────────────────────
// controllers/ProductController.java

// DELETE /products/{id}
@DeleteMapping("/{id}")
public ResponseEntity<Map<String, String>> destroy(@PathVariable String id) {
    productService.delete(id);
    return ResponseEntity.ok(Map.of("message", "Product deleted successfully"));
}
```

  </TabItem>
</Tabs>

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