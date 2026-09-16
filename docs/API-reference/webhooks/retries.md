---
description: "What SalesPlay does when a webhook delivery times out or your endpoint returns an error, and how to make your endpoint safe to call more than once."
title: Request Timeout & Retries
sidebar_label: Request Timeout & Retries
sidebar_position: 4
---

# Request Timeout & Retries

How SalesPlay handles a webhook delivery your endpoint does not accept.

---

## What Counts as Success

Your endpoint **must** return a `2xx` HTTP status code. Anything else — a `4xx`, a `5xx`, or a redirect — is treated as a failed delivery.

---

## Retry Policy

| | |
|---|---|
| **Retries** | Up to **200 attempts** for a failed delivery |
| **Window** | Spread across **48 hours** |
| **Auto-disable** | If no successful response arrives within that window, the webhook is automatically set to **Disabled** |

A disabled webhook stops receiving notifications entirely. Re-enable it from the back office once your endpoint is healthy, or register a new subscription with [`POST /webhooks`](./create-webhook).

---

## Building a Reliable Endpoint

- **Acknowledge first, process later.** Return `2xx` as soon as you have the payload, then handle it on a queue. Doing the work inline risks timing out and triggering a retry for an event you already processed.
- **Make handling idempotent.** A retry delivers the same payload again. Key off the record identifiers in the payload so a repeat is a no-op rather than a duplicate.
- **Do not redirect.** A `301`/`302` from your URL is a failure, not a hop. Register the final URL directly.
- **Monitor for disabled subscriptions.** Call [`GET /webhooks`](./get-webhook) periodically and check `status` — a webhook that silently went `DISABLED` looks identical to a quiet event stream.
- **Have a fallback.** If a webhook is disabled, you will have missed events. Backfill by polling the relevant endpoint with `updated_at_min` covering the gap.
