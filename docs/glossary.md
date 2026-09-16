---
title: Glossary
description: "Definitions of the terms used in the SalesPlay API and Backoffice: access token, Backoffice, cursor, GRN, modifier, POS key, receipt, shift, shop, webhook and more."
---

# Glossary

Terms as they are used in the SalesPlay API and Backoffice, in alphabetical order. Each entry links to the page where the concept is used.

**Access token** — The secret string that identifies your application on every API call, sent as `Authorization: Bearer <token>`. Either a [Personal Access Token](guides/personal-access-tokens.md) created in the Backoffice, or a token obtained through [OAuth 2.0](guides/oauth.md). Depending on the Backoffice version it is labelled *Access token* or *API key*.

**App ID, App Secret, Authorization Code** — The three values the Backoffice gives an [OAuth 2.0](guides/oauth.md) app when it is created. The app exchanges them for an access token.

**Backoffice** — The SalesPlay web portal at [https://cloud.salesplaypos.com/](https://cloud.salesplaypos.com/) where a merchant manages the account: products, shops, staff, reports, and — under *Integrations* — access tokens and OAuth apps. Not the POS app itself.

**Base URL** — `https://api.salesplaypos.com/v1.0`. Every endpoint path in this documentation is appended to it. The `v1.0` is the [API version](guides/versioning.md).

**Category / Sub category** — The two-level grouping of products used for menus and reporting. A product belongs to one [category](API-reference/categories/get-categories.md) and optionally one [sub category](API-reference/sub-categories/get-sub-categories.md) within it.

**Credit note** — A document issued against an existing receipt to return goods or money; the API creates credit notes and cash refunds with [`POST /credit_note_and_refund`](API-reference/receipts/create-credit-note.md) (`receipt_type` of `CREDIT_NOTE` or `CASH_REFUND`).

**Cursor** — The opaque string a list endpoint returns with each page. Send it back in the next request's JSON body to get the following page; an empty results list means there is no more data. See [Pagination](API-reference/pagination.md).

**GRN (Goods Received Note)** — The record of stock that arrived from a supplier: supplier, shop, date, invoice number, and line items. Created with [`POST /grn`](API-reference/grn/create-grn.md).

**Inventory level** — The stock quantity of one product in one shop. Read with [`GET /inventory`](API-reference/inventory/get-inventory.md), set with [`POST /inventory`](API-reference/inventory/update-inventory.md).

**Measurement** — The unit a product is sold and stocked in (pcs, kg, litre …). See [Measurements](API-reference/measurements/get-measurements.md).

**Merchant** — The SalesPlay account itself — the business that owns the shops, products and data. [`GET /merchant`](API-reference/merchant/get-merchant.md) returns its details. An access token belongs to one merchant.

**Modifier** — An add-on or option applied to a product at the point of sale (extra shot, no onions), grouped into modifier groups. See [Modifiers](API-reference/modifiers/get-modifiers.md).

**Online order** — An order placed from outside the POS — a website, an ordering or delivery app — and pushed into the POS of a shop with [`POST /online_orders`](API-reference/online-orders/place-online-order.md). Its progress is read with [`GET /online_order_status`](API-reference/online-orders/get-online-order-status.md).

**Order** — A sale in progress or completed on the POS; listed with [`GET /orders`](API-reference/orders/get-orders.md). When an order is paid, a *receipt* is generated.

**Order type** — How an order is fulfilled: dine-in, takeaway, delivery, or a custom type. See [Order Types](API-reference/order-types/get-order-types.md).

**Pay-in / Pay-out** — Cash added to or taken out of the POS drawer during a shift, other than sales. Listed with [`GET /drawer_transaction`](API-reference/shifts/get-drawer-transactions.md).

**Payment type** — A method of payment accepted at checkout — cash, card, or a custom type such as a voucher. See [Payment Types](API-reference/payment-types/get-payment-types.md).

**Personal Access Token (PAT)** — An access token created by the merchant in the Backoffice for their own integrations. It has no scopes or permissions of its own. See [Personal Access Tokens](guides/personal-access-tokens.md).

**POS device / terminal / POS key** — A POS terminal is one installation of the SalesPlay POS app, registered under a shop. Its identifier is the *POS key* (`pos_key`, e.g. `SP25443956`), which appears as `pos_device_id` on receipts and shifts. See [POS Devices](API-reference/pos-devices/get-pos-devices.md).

**Purchase order** — A request to a supplier for stock, raised in the Backoffice; read-only through [`GET /purchase_orders`](API-reference/purchase-orders/get-purchase-orders.md). Stock arrives against it as a GRN.

**Receipt** — The record of a completed, paid sale (also called an invoice). Listed with [`GET /receipts`](API-reference/receipts/get-receipts.md). A *void receipt* is a receipt that was cancelled after being issued ([`GET /void_receipts`](API-reference/receipts/get-void-receipts.md)).

**Shift** — The period a cashier is signed in on a POS terminal, from opening to closing the drawer. Listed with [`GET /shifts`](API-reference/shifts/get-shifts.md).

**Shop** — A physical or virtual location under the merchant account; each has its own POS terminals, stock and receipts. Its `shop_id` is required by most sales and stock endpoints. Listed with [`GET /shops`](API-reference/shops/get-shops.md).

**Supplier** — A business the merchant buys stock from; referenced by GRNs and purchase orders. See [Suppliers](API-reference/suppliers/get-suppliers.md).

**Timecard** — An employee's clock-in / clock-out record on the POS. Listed with [`GET /timecards`](API-reference/timecards/get-timecards.md).

**Webhook** — A URL you register so that SalesPlay sends it an HTTP `POST` whenever a subscribed event happens (a receipt is created, a product changes …), instead of you polling the API. See [Webhooks](API-reference/webhooks/overview.md).
