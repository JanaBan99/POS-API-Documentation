---
description: "How to test a SalesPlay webhook endpoint before production: capture the request, check the payload, and confirm your URL responds correctly."
title: Testing Webhooks
sidebar_label: Testing Webhooks
sidebar_position: 3
---

# Testing Webhooks

Validate your endpoint before you rely on it in production.

---

## Send a Test Notification

From the SalesPlay back office, trigger a **Test Notification** on the webhook you registered. SalesPlay sends a sample `POST` request to your URL with the same envelope as a real event — see [Webhook Payload](./payload).

---

## Receiving Requests Locally

Your development machine is not reachable from the internet, so point the webhook at a public URL that forwards to it:

- **Tunnel to your own server** — run your app locally and expose it with a tool like [ngrok](https://ngrok.com). Register the tunnel's HTTPS URL as your webhook URL.
- **Use an inspection service** — [Beeceptor](https://beeceptor.com) and similar services give you a public URL and show each incoming request, headers and body included. Useful for confirming the payload shape before you write any handling code.

---

## What to Check

| Check | Why it matters |
|---|---|
| Endpoint returns `2xx` | Anything else — including a redirect — is a failed delivery and will be retried. |
| Response is fast | Acknowledge first, process afterwards. Slow handlers look like failures. |
| URL is HTTPS and publicly reachable | SalesPlay must be able to reach it from outside your network. |
| Handler is idempotent | A retried delivery repeats the same payload; processing it twice must not double-apply the change. |
| Resource array is iterated | A single notification can carry multiple records. |

---

## Going Live

Once the test notification lands and your endpoint acknowledges it correctly, register the production URL with [`POST /webhooks`](./create-webhook) and remove any tunnel-based subscription. See [Going Live](../../guides/going-live) for the full checklist.
