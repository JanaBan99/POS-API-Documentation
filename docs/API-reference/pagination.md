---
description: "How cursor pagination works in the SalesPlay API: the limit field, the cursor returned in each response, and how to know you are on the last page."
title: Pagination
sidebar_label: Pagination
---

# Pagination

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

List endpoints return results in pages. Each page comes with a **`cursor`**; send it back to get the next page, and keep going until a page comes back empty. You can often avoid paginating at all by narrowing the request with date or ID filters.

---

## How Pagination Works

1. Send the first request with an optional `limit` and **no** `cursor`.
2. The response contains the first page of results plus a `cursor` string.
3. Send the same request again with that `cursor` in the body.
4. Repeat until the results array is **empty** — that is the end of the data.

:::info Parameters go in the JSON body
Like every filter on this API, `limit` and `cursor` are sent as a **JSON request body**, even on `GET`. Query-string parameters (`?limit=50`) are ignored.
:::

---

## Parameters

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `limit` | integer | `10` | Number of objects to return per page. |
| `cursor` | string | — | Pagination cursor returned by the previous response. Omit on the first request. |

---

## Paginated Response Structure

```json
{
  "measurements": [
    { "id": "cXIvbG42Zkl2V1RQU3lpT0U3Y2h5Zz09", "measurement_name": "g", "weight_scale_enable": 0 }
  ],
  "cursor": "MSwx"
}
```

The `cursor` field is **always present**, including on the last page. You know you've reached the end when the results array is empty:

```json
{
  "measurements": [],
  "cursor": "N3wx"
}
```

---

## Iterating Through Pages

<Tabs>
<TabItem value="curl" label="cURL" default>

```bash
# First page (no cursor)
curl -X GET "https://api.salesplaypos.com/v1.0/category" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"limit": "50"}'

# Next page (cursor from the previous response)
curl -X GET "https://api.salesplaypos.com/v1.0/category" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"limit": "50", "cursor": "MSwx"}'
```

</TabItem>
<TabItem value="javascript" label="JavaScript">

```javascript
// Node.js — fetch() cannot send a body with GET, so use https.request
import https from "node:https";

const BASE_URL = "https://api.salesplaypos.com/v1.0";
const TOKEN = "YOUR_ACCESS_TOKEN";

function get(path, body) {
  const payload = JSON.stringify(body);
  return new Promise((resolve, reject) => {
    const req = https.request(BASE_URL + path, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
        "Content-Length": Buffer.byteLength(payload),
      },
    }, (res) => {
      let data = "";
      res.on("data", (chunk) => (data += chunk));
      res.on("end", () => resolve(JSON.parse(data)));
    });
    req.on("error", reject);
    req.write(payload);
    req.end();
  });
}

async function fetchAllCategories() {
  const all = [];
  let cursor;
  while (true) {
    const data = await get("/category", { limit: "50", ...(cursor && { cursor }) });
    if (!data.categories.length) break;   // empty page = end
    all.push(...data.categories);
    cursor = data.cursor;
  }
  return all;
}
```

</TabItem>
<TabItem value="python" label="Python">

```python
import requests

BASE_URL = "https://api.salesplaypos.com/v1.0"
HEADERS = {"Authorization": "Bearer YOUR_ACCESS_TOKEN"}

def fetch_all_categories(limit=50):
    all_categories, cursor = [], None
    while True:
        body = {"limit": str(limit)}
        if cursor:
            body["cursor"] = cursor
        data = requests.get(f"{BASE_URL}/category", headers=HEADERS, json=body).json()
        if not data.get("categories"):   # empty page = end
            break
        all_categories.extend(data["categories"])
        cursor = data["cursor"]
    return all_categories
```

</TabItem>
<TabItem value="php" label="PHP">

```php
<?php
$baseUrl = "https://api.salesplaypos.com/v1.0";
$token   = "YOUR_ACCESS_TOKEN";

function fetchAllCategories($baseUrl, $token, $limit = 50) {
    $all = [];
    $cursor = null;
    do {
        $body = ["limit" => (string)$limit];
        if ($cursor) $body["cursor"] = $cursor;

        $ch = curl_init("$baseUrl/category");
        curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "GET");
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            "Authorization: Bearer $token",
            "Content-Type: application/json",
        ]);
        $data = json_decode(curl_exec($ch), true);
        curl_close($ch);

        $page = $data["categories"] ?? [];
        $all = array_merge($all, $page);
        $cursor = $data["cursor"] ?? null;
    } while (count($page) > 0);   // empty page = end
    return $all;
}
```

</TabItem>
<TabItem value="java" label="Java">

```java
import java.net.URI;
import java.net.http.*;
import java.util.*;
import com.fasterxml.jackson.databind.*;

public class Pagination {
    static final String BASE_URL = "https://api.salesplaypos.com/v1.0";
    static final String TOKEN = "YOUR_ACCESS_TOKEN";
    static final HttpClient client = HttpClient.newHttpClient();
    static final ObjectMapper mapper = new ObjectMapper();

    static List<JsonNode> fetchAllCategories() throws Exception {
        List<JsonNode> all = new ArrayList<>();
        String cursor = null;
        while (true) {
            Map<String, String> body = new HashMap<>(Map.of("limit", "50"));
            if (cursor != null) body.put("cursor", cursor);

            HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(BASE_URL + "/category"))
                .header("Authorization", "Bearer " + TOKEN)
                .header("Content-Type", "application/json")
                .method("GET", HttpRequest.BodyPublishers.ofString(mapper.writeValueAsString(body)))
                .build();

            JsonNode data = mapper.readTree(client.send(request, HttpResponse.BodyHandlers.ofString()).body());
            JsonNode page = data.get("categories");
            if (page == null || page.isEmpty()) break;   // empty page = end
            page.forEach(all::add);
            cursor = data.get("cursor").asText();
        }
        return all;
    }
}
```

</TabItem>
<TabItem value="csharp" label="C#">

```csharp
using System.Net.Http;
using System.Text;
using System.Text.Json;

const string BASE_URL = "https://api.salesplaypos.com/v1.0";
const string TOKEN = "YOUR_ACCESS_TOKEN";
var client = new HttpClient();

async Task<List<JsonElement>> FetchAllCategories()
{
    var all = new List<JsonElement>();
    string? cursor = null;
    while (true)
    {
        var body = new Dictionary<string, string> { ["limit"] = "50" };
        if (cursor != null) body["cursor"] = cursor;

        var request = new HttpRequestMessage(HttpMethod.Get, $"{BASE_URL}/category");
        request.Headers.Add("Authorization", $"Bearer {TOKEN}");
        request.Content = new StringContent(JsonSerializer.Serialize(body), Encoding.UTF8, "application/json");

        using var doc = JsonDocument.Parse(await (await client.SendAsync(request)).Content.ReadAsStringAsync());
        var page = doc.RootElement.GetProperty("categories");
        if (page.GetArrayLength() == 0) break;   // empty page = end
        all.AddRange(page.EnumerateArray().Select(e => e.Clone()));
        cursor = doc.RootElement.GetProperty("cursor").GetString();
    }
    return all;
}
```

</TabItem>
</Tabs>

---

## Best Practices

- **Start without a cursor** — omit `cursor` on your first request.
- **Stop on an empty page** — the `cursor` is always returned, so check the results array, not the cursor.
- **Use a reasonable page size** — `50`–`100` keeps long-running jobs resilient and memory-friendly.
- **Narrow your query first** — date filters (`created_at_min`, `created_at_max`) or ID filters reduce the number of pages to walk.

---

## Frequently asked questions

### How do I know I have reached the last page?

When a request returns an **empty results list**. Keep sending the `cursor` from each response until a page comes back with no items; that is the end of the data.

### Where do `limit` and `cursor` go in the request?

In the JSON request body, even on `GET`. `limit` sets the page size and `cursor` is the value returned by the previous response. Query-string parameters are ignored.

### Do I send a cursor on the first request?

No. Omit `cursor` on the first request; the response returns the first page and the `cursor` to use for the next one.

### Can I avoid paginating altogether?

Often, yes — narrow the request with the endpoint's ID or date-range filters (for example `created_at_min` and `created_at_max`) so the result fits in one page.


## Related Resources

- [API Rate Limits](./rate-limits.md) — understand request throttling to avoid `429 Too Many Requests` during bulk pagination.
- [Getting Started](../guides/getting-started.md) — authenticate and make your first API call.
