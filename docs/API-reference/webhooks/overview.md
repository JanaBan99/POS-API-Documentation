---
description: "How SalesPlay webhooks deliver real-time event notifications to your URL, which events are available, and how to register a webhook."
title: Webhooks Overview
sidebar_label: Overview
sidebar_position: 1
---

# Webhooks Overview

Real-time notifications for SalesPlay system events are most effectively delivered through webhooks. Polling an endpoint on a timer will keep you in sync, but webhooks push the change to you the moment it happens — less traffic, less delay.

When a subscribed event occurs, SalesPlay gathers the relevant data, builds a notification, and sends it as a **POST** request to the URL registered on your webhook subscription.

---

## Supported Events

| Event | Description |
|---|---|
| `inventory_levels.update` | Fired when an item's inventory level changes. |
| `Products.update` | Fired when a product is created, updated, or deleted. |
| `customers.update` | Fired when a customer profile is created, updated, or deleted. |
| `receipts.update` | Fired when a receipt is created or updated. |
| `credit_note.update` | Fired when a credit note or cash refund is created or updated. |

---

## How Delivery Works

1. You register a webhook with a destination URL and an event type — through the back office, or with [`POST /webhooks`](./create-webhook).
2. The event occurs in SalesPlay POS.
3. SalesPlay sends a `POST` request with a JSON body to your URL. See [Webhook Payload](./payload) for its structure.
4. Your endpoint returns a `2xx` status code to acknowledge receipt.

Any response other than `2xx` — including a redirect — is treated as a failed delivery and retried. See [Request Timeout & Retries](./retries).

---

## Managing Subscriptions

| Action | Endpoint |
|---|---|
| List / retrieve a webhook | [`GET /webhooks`](./get-webhook) |
| Register a webhook | [`POST /webhooks`](./create-webhook) |
| Remove a webhook | [`DELETE /webhooks`](./delete-webhook) |

For a step-by-step walkthrough with code samples in six languages, see the [Webhooks Guide](../../guides/webhooks-guide).

## Frequently asked questions

### Which events can a webhook subscribe to?

`inventory_levels.update`, `Products.update`, `customers.update`, `receipts.update` and `credit_note.update` — see the [Supported Events](#supported-events) table above for what each one fires on.

### What does SalesPlay send to my webhook URL?

An HTTP `POST` request with a JSON body describing the event. The exact structure is on the [Webhook Payload](./payload) page.

### What must my endpoint return?

A `2xx` status code, promptly. Any other response — including a redirect — counts as a failed delivery and is retried as described under [Request Timeout & Retries](./retries).

### How do I register or remove a webhook?

Register one with [`POST /webhooks`](./create-webhook) (URL plus event type) or in the Backoffice; list them with [`GET /webhooks`](./get-webhook); remove one with [`DELETE /webhooks`](./delete-webhook).

### How can I test my webhook before going live?

Point a webhook at a request-capture service or a local tunnel, trigger the event in the POS, and check the received payload. Steps are on the [Testing Webhooks](./testing) page.

