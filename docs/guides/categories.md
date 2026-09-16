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
  <TabItem value="php" label="PHP">

```php
<?php
// ── Service ─────────────────────────────────────────
// services/CategoryService.php

// Create a new category
public function create(array $data): array
{
    return $this->request('POST', '/categories', $data);
}

// ── Controller ──────────────────────────────────────
// controllers/CategoryController.php

// POST /categories
public function store(): void
{
    $body = json_decode(file_get_contents('php://input'), true);

    if (empty($body['name'])) {
        http_response_code(422);
        echo json_encode(['error' => 'The name field is required.']);
        return;
    }

    $data = array_filter([
        'name'        => $body['name']        ?? null,
        'description' => $body['description'] ?? null,
        'color'       => $body['color']       ?? null,
        'sort_order'  => $body['sort_order']  ?? null,
        'is_active'   => $body['is_active']   ?? true,
    ]);

    $category = $this->service->create($data);

    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode($category);
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
// app/Services/CategoryService.php

// Create a new category
public function create(array $data): array
{
    $response = $this->client()->post('/categories', $data);
    $response->throw();
    return $response->json();
}

// ── Controller ──────────────────────────────────────
// app/Http/Controllers/CategoryController.php

// POST /api/categories
public function store(Request $request): JsonResponse
{
    $validated = $request->validate([
        'name'        => 'required|string|max:255',
        'description' => 'nullable|string',
        'color'       => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
        'sort_order'  => 'nullable|integer|min:0',
        'is_active'   => 'nullable|boolean',
    ]);

    $category = $this->service->create($validated);
    return response()->json($category, 201);
}

// ── Routes ──────────────────────────────────────────
// routes/api.php

Route::post('/categories', [CategoryController::class, 'store']);
```

  </TabItem>
  <TabItem value="express" label="Node.js / Express">

```javascript
// ── Service ─────────────────────────────────────────
// services/categoryService.js

// Create a new category
const create = async (payload) => {
  const { data } = await client.post('/categories', payload);
  return data;
};

module.exports = { create };

// ── Controller ──────────────────────────────────────
// controllers/categoryController.js

// POST /api/categories
const store = async (req, res) => {
  const { name, description, color, sort_order, is_active } = req.body;

  if (!name) {
    return res.status(422).json({ error: 'The name field is required.' });
  }

  const category = await categoryService.create({
    name, description, color, sort_order, is_active,
  });
  res.status(201).json(category);
};

// ── Routes ──────────────────────────────────────────
// routes/categories.js

router.post('/', asyncHandler(ctrl.store));
```

  </TabItem>
  <TabItem value="fastapi" label="Python / FastAPI">

```python
# ── Service ─────────────────────────────────────────
# services/category_service.py

# Create a new category
async def create(data: dict) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.post(
            f"{settings.base_url}/categories",
            json=data,
            headers=HEADERS
        )
        response.raise_for_status()
        return response.json()

# ── Controller ──────────────────────────────────────
# controllers/category_controller.py

class CategoryRequest(BaseModel):
    name: str
    description: Optional[str] = None
    color: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = True

# POST /api/categories
@router.post("/", status_code=201)
async def store(body: CategoryRequest):
    return await service.create(body.model_dump(exclude_none=True))
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
// ── Service ─────────────────────────────────────────
// services/CategoryService.java

// Create a new category
public String create(Map<String, Object> body) {
    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers());
    return restTemplate.postForEntity(
        url("/categories"), entity, String.class
    ).getBody();
}

// ── Controller ──────────────────────────────────────
// controllers/CategoryController.java

// POST /categories
@PostMapping
public ResponseEntity<String> store(@RequestBody Map<String, Object> body) {
    if (!body.containsKey("name")) {
        return ResponseEntity.unprocessableEntity()
            .body("{\"error\": \"The name field is required.\"}");
    }
    return ResponseEntity.status(201).body(categoryService.create(body));
}
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
  <TabItem value="php" label="PHP">

```php
<?php
// ── Service ─────────────────────────────────────────
// services/CategoryService.php

class CategoryService
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

    // Get all categories
    public function getAll(): array
    {
        return $this->request('GET', '/categories');
    }

    // Get single category by ID
    public function getById(string $id): array
    {
        return $this->request('GET', "/categories/{$id}");
    }
}

// ── Controller ──────────────────────────────────────
// controllers/CategoryController.php

class CategoryController
{
    public function __construct(private CategoryService $service) {}

    // GET /categories
    public function index(): void
    {
        $categories = $this->service->getAll();
        header('Content-Type: application/json');
        echo json_encode($categories);
    }

    // GET /categories?id={id}
    public function show(string $id): void
    {
        $category = $this->service->getById($id);
        header('Content-Type: application/json');
        echo json_encode($category);
    }
}

// ── Router ──────────────────────────────────────────
// index.php

$controller = new CategoryController(new CategoryService());
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
// app/Services/CategoryService.php

namespace App\Services;

use Illuminate\Support\Facades\Http;

class CategoryService
{
    private function client()
    {
        return Http::withToken(config('salesplay.access_token'))
                   ->acceptJson()
                   ->baseUrl(config('salesplay.base_url'));
    }

    // Get all categories
    public function getAll(): array
    {
        $response = $this->client()->get('/categories');
        $response->throw();
        return $response->json();
    }

    // Get single category by ID
    public function getById(string $id): array
    {
        $response = $this->client()->get("/categories/{$id}");
        $response->throw();
        return $response->json();
    }
}

// ── Controller ──────────────────────────────────────
// app/Http/Controllers/CategoryController.php

// GET /api/categories
public function index(): JsonResponse
{
    $categories = $this->service->getAll();
    return response()->json($categories);
}

// GET /api/categories/{id}
public function show(string $id): JsonResponse
{
    $category = $this->service->getById($id);
    return response()->json($category);
}

// ── Routes ──────────────────────────────────────────
// routes/api.php

Route::get('/categories',      [CategoryController::class, 'index']);
Route::get('/categories/{id}', [CategoryController::class, 'show']);
```

  </TabItem>
  <TabItem value="express" label="Node.js / Express">

```javascript
// ── Service ─────────────────────────────────────────
// services/categoryService.js

const axios = require('axios');
const { baseUrl, accessToken } = require('../config/salesplay');

const client = axios.create({
  baseURL: baseUrl,
  headers: { Authorization: `Bearer ${accessToken}` },
});

// Get all categories
const getAll = async () => {
  const { data } = await client.get('/categories');
  return data;
};

// Get single category by ID
const getById = async (id) => {
  const { data } = await client.get(`/categories/${id}`);
  return data;
};

module.exports = { getAll, getById };

// ── Controller ──────────────────────────────────────
// controllers/categoryController.js

// GET /api/categories
const index = async (req, res) => {
  const categories = await categoryService.getAll();
  res.json(categories);
};

// GET /api/categories/:id
const show = async (req, res) => {
  const category = await categoryService.getById(req.params.id);
  res.json(category);
};

// ── Routes ──────────────────────────────────────────
// routes/categories.js

router.get('/',    asyncHandler(ctrl.index));
router.get('/:id', asyncHandler(ctrl.show));
```

  </TabItem>
  <TabItem value="fastapi" label="Python / FastAPI">

```python
# ── Service ─────────────────────────────────────────
# services/category_service.py

import httpx
from config.salesplay import settings

HEADERS = {"Authorization": f"Bearer {settings.access_token}"}

# Get all categories
async def get_all() -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.base_url}/categories",
            headers=HEADERS
        )
        response.raise_for_status()
        return response.json()

# Get single category by ID
async def get_by_id(category_id: str) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.get(
            f"{settings.base_url}/categories/{category_id}",
            headers=HEADERS
        )
        response.raise_for_status()
        return response.json()

# ── Controller ──────────────────────────────────────
# controllers/category_controller.py

# GET /api/categories
@router.get("/")
async def index():
    return await service.get_all()

# GET /api/categories/{id}
@router.get("/{category_id}")
async def show(category_id: str):
    return await service.get_by_id(category_id)
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
// ── Service ─────────────────────────────────────────
// services/CategoryService.java

@Service
public class CategoryService {

    // Get all categories
    public String getAll() {
        HttpEntity<Void> entity = new HttpEntity<>(headers());
        return restTemplate.exchange(
            url("/categories"), HttpMethod.GET, entity, String.class
        ).getBody();
    }

    // Get single category by ID
    public String getById(String id) {
        HttpEntity<Void> entity = new HttpEntity<>(headers());
        return restTemplate.exchange(
            url("/categories/" + id), HttpMethod.GET, entity, String.class
        ).getBody();
    }
}

// ── Controller ──────────────────────────────────────
// controllers/CategoryController.java

// GET /categories
@GetMapping
public ResponseEntity<String> index() {
    return ResponseEntity.ok(categoryService.getAll());
}

// GET /categories/{id}
@GetMapping("/{id}")
public ResponseEntity<String> show(@PathVariable String id) {
    return ResponseEntity.ok(categoryService.getById(id));
}
```

  </TabItem>
</Tabs>


- See [**Get Categories**](/API-reference/categories/get-categories) in the API reference.


---

## Edit Category

Update an existing category by sending a `PUT` request with the fields you want to change. All fields are optional — only include what needs updating.

<Tabs>
  <TabItem value="php" label="PHP">

```php
<?php
// ── Service ─────────────────────────────────────────
// services/CategoryService.php

// Update a category
public function update(string $id, array $data): array
{
    return $this->request('PUT', "/categories/{$id}", $data);
}

// ── Controller ──────────────────────────────────────
// controllers/CategoryController.php

// PUT /categories?id={id}
public function update(string $id): void
{
    $body = json_decode(file_get_contents('php://input'), true);

    $data = array_filter([
        'name'        => $body['name']        ?? null,
        'description' => $body['description'] ?? null,
        'color'       => $body['color']       ?? null,
        'sort_order'  => $body['sort_order']  ?? null,
        'is_active'   => $body['is_active']   ?? null,
    ], fn($value) => !is_null($value));

    $category = $this->service->update($id, $data);

    header('Content-Type: application/json');
    echo json_encode($category);
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
// app/Services/CategoryService.php

// Update a category
public function update(string $id, array $data): array
{
    $response = $this->client()->put("/categories/{$id}", $data);
    $response->throw();
    return $response->json();
}

// ── Controller ──────────────────────────────────────
// app/Http/Controllers/CategoryController.php

// PUT /api/categories/{id}
public function update(Request $request, string $id): JsonResponse
{
    $validated = $request->validate([
        'name'        => 'sometimes|string|max:255',
        'description' => 'nullable|string',
        'color'       => 'nullable|string|regex:/^#[0-9A-Fa-f]{6}$/',
        'sort_order'  => 'nullable|integer|min:0',
        'is_active'   => 'nullable|boolean',
    ]);

    $category = $this->service->update($id, $validated);
    return response()->json($category);
}

// ── Routes ──────────────────────────────────────────
// routes/api.php

Route::put('/categories/{id}', [CategoryController::class, 'update']);
```

  </TabItem>
  <TabItem value="express" label="Node.js / Express">

```javascript
// ── Service ─────────────────────────────────────────
// services/categoryService.js

// Update a category
const update = async (id, payload) => {
  const { data } = await client.put(`/categories/${id}`, payload);
  return data;
};

module.exports = { update };

// ── Controller ──────────────────────────────────────
// controllers/categoryController.js

// PUT /api/categories/:id
const update = async (req, res) => {
  const category = await categoryService.update(req.params.id, req.body);
  res.json(category);
};

// ── Routes ──────────────────────────────────────────
// routes/categories.js

router.put('/:id', asyncHandler(ctrl.update));
```

  </TabItem>
  <TabItem value="fastapi" label="Python / FastAPI">

```python
# ── Service ─────────────────────────────────────────
# services/category_service.py

# Update a category
async def update(category_id: str, data: dict) -> dict:
    async with httpx.AsyncClient() as client:
        response = await client.put(
            f"{settings.base_url}/categories/{category_id}",
            json=data,
            headers=HEADERS
        )
        response.raise_for_status()
        return response.json()

# ── Controller ──────────────────────────────────────
# controllers/category_controller.py

class CategoryUpdateRequest(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    color: Optional[str] = None
    sort_order: Optional[int] = None
    is_active: Optional[bool] = None

# PUT /api/categories/{id}
@router.put("/{category_id}")
async def update(category_id: str, body: CategoryUpdateRequest):
    return await service.update(
        category_id,
        body.model_dump(exclude_none=True)
    )
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
// ── Service ─────────────────────────────────────────
// services/CategoryService.java

// Update a category
public String update(String id, Map<String, Object> body) {
    HttpEntity<Map<String, Object>> entity = new HttpEntity<>(body, headers());
    return restTemplate.exchange(
        url("/categories/" + id), HttpMethod.PUT, entity, String.class
    ).getBody();
}

// ── Controller ──────────────────────────────────────
// controllers/CategoryController.java

// PUT /categories/{id}
@PutMapping("/{id}")
public ResponseEntity<String> update(
    @PathVariable String id,
    @RequestBody Map<String, Object> body
) {
    return ResponseEntity.ok(categoryService.update(id, body));
}
```

  </TabItem>
</Tabs>

- For full request and response details, see the [**Create Categories**](/API-reference/categories/get-categories) API reference.

---

## Delete Category

Permanently remove a category by sending a `DELETE` request with its ID.

> **⚠️ Warning**
> Deleting a category that has products assigned to it may fail. Reassign or remove those products first.

<Tabs>
  <TabItem value="php" label="PHP">

```php
<?php
// ── Service ─────────────────────────────────────────
// services/CategoryService.php

// Delete a category
public function delete(string $id): bool
{
    $this->request('DELETE', "/categories/{$id}");
    return true;
}

// ── Controller ──────────────────────────────────────
// controllers/CategoryController.php

// DELETE /categories?id={id}
public function destroy(string $id): void
{
    $this->service->delete($id);

    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode(['message' => 'Category deleted successfully']);
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
// app/Services/CategoryService.php

// Delete a category
public function delete(string $id): bool
{
    $response = $this->client()->delete("/categories/{$id}");
    $response->throw();
    return true;
}

// ── Controller ──────────────────────────────────────
// app/Http/Controllers/CategoryController.php

// DELETE /api/categories/{id}
public function destroy(string $id): JsonResponse
{
    $this->service->delete($id);
    return response()->json(['message' => 'Category deleted successfully']);
}

// ── Routes ──────────────────────────────────────────
// routes/api.php

Route::delete('/categories/{id}', [CategoryController::class, 'destroy']);
```

  </TabItem>
  <TabItem value="express" label="Node.js / Express">

```javascript
// ── Service ─────────────────────────────────────────
// services/categoryService.js

// Delete a category
const remove = async (id) => {
  await client.delete(`/categories/${id}`);
  return true;
};

module.exports = { remove };

// ── Controller ──────────────────────────────────────
// controllers/categoryController.js

// DELETE /api/categories/:id
const destroy = async (req, res) => {
  await categoryService.remove(req.params.id);
  res.json({ message: 'Category deleted successfully' });
};

// ── Routes ──────────────────────────────────────────
// routes/categories.js

router.delete('/:id', asyncHandler(ctrl.destroy));
```

  </TabItem>
  <TabItem value="fastapi" label="Python / FastAPI">

```python
# ── Service ─────────────────────────────────────────
# services/category_service.py

# Delete a category
async def delete(category_id: str) -> bool:
    async with httpx.AsyncClient() as client:
        response = await client.delete(
            f"{settings.base_url}/categories/{category_id}",
            headers=HEADERS
        )
        response.raise_for_status()
        return True

# ── Controller ──────────────────────────────────────
# controllers/category_controller.py

# DELETE /api/categories/{id}
@router.delete("/{category_id}")
async def destroy(category_id: str):
    await service.delete(category_id)
    return {"message": "Category deleted successfully"}
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
// ── Service ─────────────────────────────────────────
// services/CategoryService.java

// Delete a category
public void delete(String id) {
    HttpEntity<Void> entity = new HttpEntity<>(headers());
    restTemplate.exchange(
        url("/categories/" + id), HttpMethod.DELETE, entity, String.class
    );
}

// ── Controller ──────────────────────────────────────
// controllers/CategoryController.java

// DELETE /categories/{id}
@DeleteMapping("/{id}")
public ResponseEntity<Map<String, String>> destroy(@PathVariable String id) {
    categoryService.delete(id);
    return ResponseEntity.ok(Map.of("message", "Category deleted successfully"));
}
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