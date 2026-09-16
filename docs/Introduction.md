---
description: "Overview of the SalesPlay REST API: what you can build with it (catalog, inventory, customers, sales, online orders, webhooks), how to authenticate, and where to start."
title: Introduction
slug: /
---

# SalesPlay API Documentation

The SalesPlay API is a REST API over HTTPS that gives software developers programmatic access to the data in a SalesPlay point-of-sale account: the product catalog, stock levels, customers, suppliers, sales receipts, orders, shifts and employees. Requests and responses are JSON. The base URL is `https://api.salesplaypos.com/v1.0`, every request carries a Bearer token in the `Authorization` header (a Personal Access Token or an OAuth 2.0 token), and filters and pagination are sent as a JSON request body on every method, including `GET`.

It is for anyone connecting their own system to a SalesPlay account — an online store, an accounting package, a delivery or ordering app, a reporting tool, or an in-house integration.

## What you can do

| Resource | What it is for | Methods |
|---|---|---|
| [Products](API-reference/products/get-products.md) | Create and retrieve the products in the catalog, with pricing, tax and stock settings | `GET` `POST` |
| [Product Image](API-reference/product-image/upload-image.md) | Upload or remove a product's image (multipart upload) | `POST` `DELETE` |
| [Categories](API-reference/categories/get-categories.md) / [Sub Categories](API-reference/sub-categories/get-sub-categories.md) | Group products for menus and reporting | `GET` `POST` `DELETE` |
| [Measurements](API-reference/measurements/get-measurements.md) | Units products are sold and stocked in (kg, pcs, litre) | `GET` `POST` `DELETE` |
| [Taxes](API-reference/taxes/get-taxes.md) | Tax rates applied to products and receipts | `GET` `POST` `DELETE` |
| [Modifiers](API-reference/modifiers/get-modifiers.md) | Product add-ons and options | `GET` `DELETE` |
| [Inventory](API-reference/inventory/get-inventory.md) | Read and set stock levels per product and shop | `GET` `POST` |
| [GRN](API-reference/grn/get-grn.md) / [Purchase Orders](API-reference/purchase-orders/get-purchase-orders.md) | Goods Received Notes for incoming stock; purchase orders raised to suppliers | `GET` `POST` / `GET` |
| [Suppliers](API-reference/suppliers/get-suppliers.md) | The suppliers stock is purchased from | `GET` `POST` `DELETE` |
| [Customers](API-reference/customers/get-customers.md) | Customer profiles attached to sales | `GET` `POST` `DELETE` |
| [Receipts](API-reference/receipts/get-receipts.md) | Sales receipts, void receipts, credit notes; issue credit notes and refunds | `GET` `POST` |
| [Orders](API-reference/orders/get-orders.md) | Orders placed through the POS (read-only) | `GET` |
| [Online Orders](API-reference/online-orders/place-online-order.md) | Place orders from an external channel into the POS, check their status, cancel them | `GET` `POST` |
| [Payment Types](API-reference/payment-types/get-payment-types.md) / [Order Types](API-reference/order-types/get-order-types.md) | Payment methods accepted at checkout; order types such as dine-in, takeaway, delivery | `GET` `POST` `DELETE` |
| [Shops](API-reference/shops/get-shops.md) / [POS Devices](API-reference/pos-devices/get-pos-devices.md) | Locations under the account and the POS terminals registered in each (read-only) | `GET` |
| [Shifts](API-reference/shifts/get-shifts.md) / [Timecards](API-reference/timecards/get-timecards.md) / [Employee](API-reference/employee/get-employees.md) | Cashier shifts and drawer pay-ins/pay-outs; clock-in/clock-out records; employees (read-only) | `GET` |
| [Merchant](API-reference/merchant/get-merchant.md) | The merchant account's own details (read-only) | `GET` |
| [Webhooks](API-reference/webhooks/overview.md) | Register a URL to receive real-time event notifications | `GET` `POST` `DELETE` |

The full list of endpoints, with request fields, examples and responses, is in the [API Reference](API-reference/index.md).

## How to start

1. **Get a token.** Log in to the SalesPlay Backoffice at [https://cloud.salesplaypos.com/](https://cloud.salesplaypos.com/) and create a Personal Access Token under *Integrations* — see [Personal Access Tokens](guides/personal-access-tokens.md). Apps that act on behalf of many merchants use [OAuth 2.0](guides/oauth.md) instead.
2. **Make a first request.** The [Getting Started](guides/getting-started.md) guide sets up Postman with the base URL and token and calls `GET /shops`, which needs no parameters.
3. **Build the integration.** Follow the guides for [categories](guides/categories.md), [products](guides/product.md), [orders](guides/order-integration.md), [receipts](guides/receipt.md) and [webhooks](guides/webhooks-guide.md), then the [pre-launch checklist](guides/going-live.md).

## Key facts

| | |
|---|---|
| Base URL | `https://api.salesplaypos.com/v1.0` — the version is part of the URL ([versioning](guides/versioning.md)) |
| Authentication | `Authorization: Bearer <token>` on every request ([Personal Access Tokens](guides/personal-access-tokens.md), [OAuth 2.0](guides/oauth.md)) |
| Content type | `application/json` for requests and responses; product images use `multipart/form-data` |
| Parameters | Sent as a JSON request body on every method, including `GET` and `DELETE`; query-string parameters are ignored |
| Pagination | `limit` and `cursor` in the request body; each response returns a `cursor`; an empty results list means the last page ([pagination](API-reference/pagination.md)) |
| Dates | `YYYY-MM-DD HH:MM:SS`, 24-hour clock ([date and time format](API-reference/date-time-format.md)) |
| Errors | JSON body `{"errors": {"code": "…", "details": "…", "field": "…"}}` with codes such as `UNAUTHORIZED` and `INVALID_VALUE` ([troubleshooting](guides/errors-guide.md)) |
| Rate limits | Requests are rate limited per account; a `429` response means back off and retry ([rate limits](API-reference/rate-limits.md)) |
| Webhooks | HTTP `POST` to your URL when a subscribed event happens ([webhooks](API-reference/webhooks/overview.md)) |

## Support & Resources

- [Troubleshooting](guides/errors-guide.md) — status codes, error bodies and how to debug a failed request
- [SalesPlay Backoffice](https://cloud.salesplaypos.com/) — account management, tokens and OAuth apps

## Machine-readable

- [OpenAPI 3.0 specification](pathname:///api_spec.json) — the full API description for code generators and API tools
- [llms.txt](pathname:///llms.txt) — an index of this documentation for AI and coding assistants ([full text](pathname:///llms-full.txt))
