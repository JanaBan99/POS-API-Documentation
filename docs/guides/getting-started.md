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

---

## How to get an access token

This is the key that unlocks the API. Without it, SalesPlay has no way of knowing who's knocking on the door. Here's how to get it:

1. Log in to the SalesPlay Backoffice at [https://cloud.salesplaypos.com](https://cloud.salesplaypos.com)

<TenantBlock hide={['salesplay', 'vendrex']}>

> **Backoffice, not Web POS.** Make sure you are on the **Backoffice** at [https://cloud.salesplaypos.com/](https://cloud.salesplaypos.com/). The similarly named Web POS (`selmowebpos.backofficewebportal.com`) is the cashier app — logging in there registers a POS terminal and has no API settings.

</TenantBlock>

<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <TenantImage
    src="/img/login.png"
    style={{
      width: '100%',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #eee'
    }}
    alt="SalesPlay Backoffice sign-in page with email and password fields"
  />
</div>

<TenantBlock hide={['vendrex', 'sellmo']}>

2. If you don't have an account, click "Register" on the login page or go directly to the [Registration Page](https://cloud.salesplaypos.com/registration_form?lang=) to create your free SalesPlay account.

<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <TenantImage
    src="/img/register.png"
    style={{
      width: '100%',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #eee'
    }}
    alt="SalesPlay Backoffice registration form for a new merchant account"
  />
</div>

</TenantBlock>

<TenantBlock hide={['vendrex', 'sellmo']}>

3. Once logged in, navigate to the **Access Token** page under **Integrations**

</TenantBlock>
<TenantBlock hide="salesplay">

3. Once logged in, open **Integrations** (the puzzle icon), then **Developer Tools → API keys**

</TenantBlock>

<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <TenantImage
    src="/img/access_token.png"
    style={{
      width: '100%',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #eee'
    }}
    alt="SalesPlay Backoffice: the access token (API key) page under Integrations, listing existing tokens"
  />
</div>

<TenantBlock hide={['vendrex', 'sellmo']}>

4. Generate your access token by clicking the **Add Access Token** button.

</TenantBlock>
<TenantBlock hide="salesplay">

4. Click **Add API Key**, give the key a name and (optionally) an expiry date, then **Save**.

</TenantBlock>

<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <TenantImage
    src="/img/access_token_generate.png"
    style={{
      width: '100%',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #eee'
    }}
    alt="SalesPlay Backoffice: the form to create a new access token (API key) with a name and optional expiry"
  />
</div>

<TenantBlock hide={['vendrex', 'sellmo']}>

5. Click on the relevant record to view and copy your access token.

</TenantBlock>
<TenantBlock hide="salesplay">

5. Click the key in the list to open it, then use the copy icon next to the **API key** value.

</TenantBlock>

<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <TenantImage
    src="/img/copy.png"
    style={{
      width: '100%',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #eee'
    }}
    alt="SalesPlay Backoffice: an access token opened, with the copy icon next to its value"
  />
</div>

6. Paste it into the `Token` variable in your Postman environment

<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <TenantImage
    src="/img/postman_token.png"
    style={{
      width: '100%',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #eee'
    }}
    alt="Postman environment with baseUrl set to https://api.salesplaypos.com/v1.0 and a Token variable holding the access token"
  />
</div>

> **🔒 Keep it secret, keep it safe**
>
> Your access token is like a password. Never share it publicly or commit it to version control. If you think it's been exposed, regenerate it immediately from the Backoffice.

---

## Make your first request: GET /shops

You're all set. The simplest call in the API is **Get Shops** — it needs no parameters and returns the shops (locations) on your account, so it's the quickest way to prove your token works.

### In Postman

1. In the imported **POS_Developer_API** collection, open the **Shops** folder and click the **shops** request.
2. The URL reads `{{baseUrl}}/shops`. Open the **Headers** tab — the collection already sends your token as `Token: Bearer {{Token}}`, filled from the environment variable you set above.
3. Click **Send**. (The request carries an optional JSON body with filters — `shop_ids`, `updated_at_min`, `limit` — leave them blank for now.)

{/* TODO: drop a Postman screenshot of GET {{baseUrl}}/shops with its 200 response at static/img/shared/postman_first_request.png, then un-comment:
<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <TenantImage
    src="/img/postman_first_request.png"
    style={{
      width: '100%',
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #eee'
    }}
    alt="Postman: GET /shops request with a 200 OK response"
  />
</div>
*/}

### The same request in cURL

```bash
curl -X GET "https://api.salesplaypos.com/v1.0/shops"   -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

### Expected response from GET /shops

A `200 OK` with your shop list. A brand-new account looks like this:

```json
{
  "shops": [
    {
      "id": "MnczNjdrVllFVTZoKzBHak1XZXkrZz09",
      "shop_name": "NoCompany",
      "address": "",
      "phone_number": "",
      "city": "",
      "email": "",
      "longitude": "",
      "latitude": "",
      "terminal_list": [
        { "pos_name": "POS 01", "pos_key": "SP25443956" }
      ],
      "is_enable": "1",
      "updated_date": "2026-09-14 12:27:10"
    }
  ],
  "cursor": "MT@sMT@="
}
```

Keep the `id` handy — it's the `shop_id` you'll pass when you [create your first product](../API-reference/products/create-product.md).

| If you get… | It means… |
|---|---|
| `401` with `"code": "UNAUTHORIZED"` | The token is missing, expired, or pasted with extra spaces. Regenerate it in the Backoffice and update the `Token` variable. |
| `404 Not Found` | Check `baseUrl` — it must be `https://api.salesplaypos.com/v1.0` with no trailing slash. |

That's your integration coming to life. From here, dive deeper into the guides to build out the full integration:

- [Get Your Credentials](personal-access-tokens) — Personal Access Tokens and OAuth 2.0
- [Set Up Categories](categories) → [Create Products](product) → [Process Orders](order-integration) — the core flow
- [API Reference](../API-reference/index.md) — every endpoint with parameters and examples

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

