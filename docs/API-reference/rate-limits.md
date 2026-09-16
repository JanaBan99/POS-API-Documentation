---
description: "Rate limiting on the SalesPlay API: the published request limit per account, the 429 response, and how to back off and retry."
---

# Rate Limiting

> Throttling policies that apply to every API request on the SalesPlay platform.

---

## Overview

The SalesPlay API platform applies rate limits to all incoming requests. Every request is subject to throttling under the general limits described below. Some resources carry additional, resource-specific limits on top of these.

---

## Current Limit

| Scope      | Limit                  |
|------------|------------------------|
| Per Account | 300 requests / 300 seconds |

:::caution Limit not reproduced in testing
On 2026-09-14, 360 requests sent within 54 seconds from one account all returned `200`. Treat the figure above as the published policy, not a measured ceiling, and always handle `429` defensively. A `429` carries the standard error envelope with `"code": "RATE_LIMITED"`.
:::

All API keys belonging to the same account share the same quota.

---

## When a Limit Is Exceeded

All requests made after the rate limit threshold is reached are throttled. The API responds with:

```
HTTP 429 Too Many Requests
```

Your application should treat a `429` response as a signal to pause and retry after a short delay, rather than continuing to send requests.

---

## Retry Behavior

Your app should be prepared to handle throttling gracefully. The recommended approach is **exponential backoff**:

1. Receive a `429 Too Many Requests` response.
2. Wait a brief interval before retrying.
3. Increase the wait time progressively if subsequent attempts are also throttled.

> **Note:** Continuously retrying without a backoff strategy can prolong throttling and degrade performance for your application.

---

## Additional Resource-Based Limits

Certain API resources carry their own stricter rate limits, applied independently on top of the general account-level threshold. Refer to the documentation for individual endpoints to check for resource-specific limits.