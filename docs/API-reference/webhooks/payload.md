---
description: "The JSON payload SalesPlay sends to your webhook URL when an event fires: HTTP method, headers, event fields and an example body."
title: Webhook Payload
sidebar_label: Webhook Payload
sidebar_position: 2
---

# Webhook Payload

Once a webhook is registered, SalesPlay dispatches an HTTP `POST` request to your URL whenever the subscribed event triggers. The request body is JSON describing the object that caused the event.

---

## Envelope

Every payload carries the same three top-level fields, plus one array named after the resource that changed.

| Field | Type | Description |
|---|---|---|
| `merchant_id` | string | Encrypted identifier of the merchant the event belongs to. |
| `type` | string | The event type, matching the `type` on your subscription. |
| `created_at` | string (date-time) | When the event fired, in `Y-m-d H:i:s` format (24-hour). |
| *resource array* | array[object] | The changed records. Named for the resource — `inventory_levels`, `products`, `customers`, `receipts`, `credit_note`. |

---

## Example — `inventory_levels.update`

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

---

## Handling the Payload

- The resource array may contain **more than one record** — iterate it rather than reading index `0`.
- Identifiers such as `product_id`, `shop_id`, and `merchant_id` are encrypted strings. Treat them as opaque; do not parse or decode them.
- Timestamps follow the platform-wide convention documented in [Date & Time Format](../date-time-format).
- Acknowledge with a `2xx` **before** doing slow work. Queue the payload and process it asynchronously — a slow response counts as a failure. See [Request Timeout & Retries](./retries).
