---
title: Documentation Changelog
sidebar_label: Changelog
description: "What changed in the SalesPlay API documentation and when, newest first — new pages, corrected facts, and structural changes."
---

# Documentation Changelog

What changed in this documentation, newest first. Changes to the **API itself** are announced separately — see [API Versioning](guides/versioning.md). The current API version is **v1.0**.

## 2026-09-16

- Every page now has a one-sentence summary (used by search engines and AI assistants) and a "last updated" date.
- Every endpoint page opens with a self-contained paragraph: method, path, purpose, where parameters go, authentication and base URL.
- New [Glossary](glossary.md) of SalesPlay API and Backoffice terms.
- "Frequently asked questions" added to [Getting Started](guides/getting-started.md), [Personal Access Tokens](guides/personal-access-tokens.md), [OAuth 2.0](guides/oauth.md), [Pagination](API-reference/pagination.md), [Troubleshooting](guides/errors-guide.md) and [Webhooks](API-reference/webhooks/overview.md).
- [Introduction](/) rewritten as a factual overview with a resource table and key facts.
- Headings cleaned up (no emoji, task-shaped names); screenshot descriptions now state what each screen shows.
- Machine-readable files published: [OpenAPI specification](pathname:///api_spec.json), [llms.txt](pathname:///llms.txt), [llms-full.txt](pathname:///llms-full.txt), `robots.txt`, sitemap with dates; structured data on every page.

## 2026-09-15

- Category pages in the API Reference show a description and previous/next links instead of tiles.
- Site infrastructure: one build per brand, brand facts in one configuration file per brand, screenshots per brand.

## 2026-09-14

- API reference rebuilt from the OpenAPI specification: one page per endpoint (53), with request fields, examples in six languages, complete example responses and the error codes each endpoint can return; concept pages for pagination, rate limits and date formats; webhook pages reorganised.
- Reference verified against the live API for 26 endpoints: parameters are sent as a JSON body on every method (including `GET`), an empty results list marks the last page, the error body is `{"errors": {"code", "details", "field"}}`. 27 endpoints remain to be verified.
- Site search added.
