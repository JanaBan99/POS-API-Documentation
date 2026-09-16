---
description: "Overview of every SalesPlay REST API endpoint by resource — catalog, inventory, customers, receipts, orders, webhooks — with links to each reference page."
title: API Reference Overview
sidebar_label: Overview
slug: /API-reference
---

# API Reference Overview

The SalesPlay REST API gives you programmatic access to your POS data — catalog, customers, sales, and configuration. Every endpoint is documented with complete parameter tables, multi-language code examples (cURL, JavaScript, Python, PHP, Java, C#), and real response payloads.

**Base URL:** `https://api.salesplaypos.com/v1.0`

All requests require a valid Bearer token in the `Authorization` header. See [Personal Access Tokens](../guides/personal-access-tokens) or [OAuth 2.0](../guides/oauth) to get your credentials.

---

## Current Resources

| Collection | Purpose | Operations |
|---|---|---|
| [Webhooks](./webhooks/overview.md) | Subscribe to real-time event notifications — register, retrieve, and remove webhook URLs. | `GET` `POST` `DELETE` |
| [Categories](./categories/get-categories.md) | Organize products into top-level groups for menus and reporting. | `GET` `POST` `DELETE` |
| [Sub Categories](./sub-categories/get-sub-categories.md) | Split categories into finer groups to keep large catalogs navigable. | `GET` `POST` `DELETE` |
| [Measurements](./measurements/get-measurements.md) | Define the units (kg, pcs, litre, etc.) products are sold and stocked in. | `GET` `POST` `DELETE` |
| [Taxes](./taxes/get-taxes.md) | Manage tax rates applied to products and receipts. | `GET` `POST` `DELETE` |
| [Customers](./customers/get-customers.md) | Create and manage customer profiles attached to sales. | `GET` `POST` `DELETE` |
| [Employee](./employee/get-employees.md) | Retrieve the employees registered in your POS. Read-only. | `GET` |
| [Suppliers](./suppliers/get-suppliers.md) | Manage the suppliers you purchase stock from. | `GET` `POST` `DELETE` |
| [Products](./products/get-products.md) | Create and retrieve the products in your catalog, including pricing and stock details. | `GET` `POST` |
| [Product Image](./product-image/upload-image.md) | Upload or remove product images (multipart upload). | `POST` `DELETE` |
| [Receipts](./receipts/get-receipts.md) | Retrieve sales receipts, void receipts, and credit notes; issue credit notes and refunds. | `GET` `POST` |
| [Orders](./orders/get-orders.md) | Retrieve orders placed through the POS. Read-only. | `GET` |
| [Shops](./shops/get-shops.md) | List the shops (locations) under your account. Read-only. | `GET` |
| [Payment Types](./payment-types/get-payment-types.md) | Manage the payment methods accepted at checkout (cash, card, etc.). | `GET` `POST` `DELETE` |
| [Order Types](./order-types/get-order-types.md) | Manage order types such as dine-in, takeaway, and delivery. | `GET` `POST` `DELETE` |
| [Modifiers](./modifiers/get-modifiers.md) | Retrieve and remove product modifiers (add-ons and options). | `GET` `DELETE` |
| [Inventory](./inventory/get-inventory.md) | Read and update stock levels per product and shop. | `GET` `POST` |
| [GRN](./grn/get-grn.md) | Retrieve and create Goods Received Notes for incoming stock. | `GET` `POST` |
| [Purchase Orders](./purchase-orders/get-purchase-orders.md) | Retrieve purchase orders raised to suppliers. Read-only. | `GET` |
| [Online Orders](./online-orders/place-online-order.md) | Place online orders into the POS, check their status, and cancel them. | `GET` `POST` |
| [Shifts](./shifts/get-shifts.md) | Retrieve cashier shifts and drawer pay-ins / pay-outs. Read-only. | `GET` |
| [Timecards](./timecards/get-timecards.md) | Retrieve employee clock-in / clock-out records. Read-only. | `GET` |
| [POS Devices](./pos-devices/get-pos-devices.md) | List the POS terminals registered under each shop. Read-only. | `GET` |
| [Merchant](./merchant/get-merchant.md) | Retrieve your merchant account details. Read-only. | `GET` |

---

## Conventions

| Topic | Description |
|---|---|
| [Pagination](./pagination.md) | Cursor-based pagination for large result sets. |
| [Rate Limits](./rate-limits.md) | Request quotas and how to handle `429` responses. |
| [Date & Time Format](./date-time-format.md) | Timestamp formats used in requests and responses. |

---

For step-by-step integration examples, visit the **[How to Guides](../guides/getting-started)** section.
