---
description: "Get a SalesPlay API access token from the Backoffice, set up Postman with the base URL, and make your first request to GET /shops."
title: Getting Started
---

import TenantBlock from '@site/src/components/TenantBlock';
import TenantImage from '@site/src/components/TenantImage';

# Getting Started

You've signed up, you're ready to build — but where do you begin? This guide will get your environment set up and your first API call fired in just a few minutes. Let's go.

---

## Install Postman

Before anything else, you need the right tool for the job. Postman is the easiest way to explore and test the SalesPlay API — it lets you send requests, inspect responses, and manage your credentials all in one place. If you haven't used it before, don't worry — it's straightforward to get started.

Download and install Postman from [https://www.getpostman.com](https://www.getpostman.com).

---

## Import the SalesPlay Postman collection

Now that Postman is ready, you don't have to build every request from scratch. SalesPlay provides a pre-built Postman Collection with all the API endpoints already configured and waiting for you.

[Get the SalesPlay API Postman Collection](https://developer.salesplay.com/download_postman_collection.php) and import it into Postman. In seconds, you'll have the entire API at your fingertips.

---

## Set the base URL and token in Postman

A collection alone isn't enough — you also need to tell Postman *where* to send requests and *who* you are. That's where environment variables come in.

Set up the following variables in your Postman environment:

| Variable | Value |
|----------|-------|
| `baseUrl` | `https://api.salesplaypos.com/v1.0` |
| `Token` | Your access token from SalesPlay Backoffice |

> **💡 Why bother with variables?**
>
> Variables are reused across every request automatically. No more copying and pasting your token into every call. It also makes switching between production, staging, and development environments effortless.

With `baseUrl` and `Token` set, you are ready to [make your first request](shops).

---

## Frequently asked questions

### What is the base URL of the SalesPlay API?

`https://api.salesplaypos.com/v1.0`, with no trailing slash. Every endpoint path in this documentation is appended to it, for example `https://api.salesplaypos.com/v1.0/shops`.

### Which header carries the access token?

`Authorization: Bearer <your access token>` on every request. The token comes from the SalesPlay Backoffice (see [Personal Access Tokens](personal-access-tokens)) or from an [OAuth 2.0](oauth) app.

### Why do I send filters in a JSON body on a GET request?

The SalesPlay API reads its parameters — filters, IDs, `limit` and `cursor` — from the JSON request body on every method, including `GET` and `DELETE`. Query-string parameters such as `?limit=10` are ignored.

### What does a 401 UNAUTHORIZED response mean?

The token is missing, invalid, expired, or was pasted with extra spaces. Generate a new token in the Backoffice and update the `Token` variable in Postman (or the `Authorization` header in your code).

### Is there a Postman collection for the SalesPlay API?

Yes — download it from [https://developer.salesplay.com/download_postman_collection.php](https://developer.salesplay.com/download_postman_collection.php) and import it into Postman; it contains every endpoint with the `baseUrl` and `Token` variables already wired in.

