---
description: "Create a Personal Access Token in the SalesPlay Backoffice and send it as a Bearer token in the Authorization header on every API request."
title: Personal Access Tokens
---

# Personal Access Tokens

Personal access tokens provide a simple and secure way to authenticate API calls. This authorization method is ideal for scenarios such as running periodic scripts that interact with data in your own account.

## Obtaining Your Personal Access Token

1. Log in to the SalesPlay Backoffice at [https://cloud.salesplaypos.com](https://cloud.salesplaypos.com)
2. Navigate to the **Access Token** page under **Integrations**
3. Generate and copy your access token


## Using Personal Access Tokens

For every API call, you must include your access token in the Authorization header. The header should be structured as follows:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Replace `YOUR_ACCESS_TOKEN` with the actual token you obtained from the SalesPlay Backoffice.

> **🔒 Keep it secret, keep it safe**
> 
> Your access token is like a password. Never share it publicly or commit it to version control. If you think it's been exposed, regenerate it immediately from the Backoffice.


## Security Best Practices

1. **Keep credentials secure**: Never expose access tokens in client-side code
2. **Use HTTPS**: Always make requests over secure connections
3. **Rotate tokens regularly**: Generate new tokens and revoke old ones periodically
4. **Monitor usage**: Keep track of API usage for security auditing

## Frequently asked questions

### Where do I create a Personal Access Token?

Log in to the SalesPlay Backoffice at [https://cloud.salesplaypos.com/](https://cloud.salesplaypos.com/), open **Integrations**, and create the token on the access token (API key) page. The [Getting Started](getting-started) guide shows each screen.

### Does a Personal Access Token expire?

You can give a token an expiry date when you create it. A token created without one does not expire on its own; it stays valid until you delete it in the Backoffice.

### Does a Personal Access Token have scopes or permissions?

No. A Personal Access Token acts as the merchant account it was created in, with access to every endpoint. Fine-grained permissions exist only for [OAuth 2.0](oauth) apps, which are set when the app is created.

### What should I do if my token is exposed?

Delete it in the Backoffice immediately, create a new one, and update your integration. Never commit a token to source control or share it in a ticket.

