---
description: "Create a Personal Access Token in the SalesPlay Backoffice and send it as a Bearer token in the Authorization header on every API request."
title: Personal Access Tokens
---

import TenantBlock from '@site/src/components/TenantBlock';
import TenantImage from '@site/src/components/TenantImage';

# Personal Access Tokens

Personal access tokens provide a simple and secure way to authenticate API calls. This authorization method is ideal for scenarios such as running periodic scripts that interact with data in your own account.

## Obtaining Your Personal Access Token

This is the key that unlocks the API. Without it, SalesPlay has no way of knowing who's knocking on the door. Here's how to get it:

1. Log in to the SalesPlay Backoffice at [https://cloud.salesplaypos.com/](https://cloud.salesplaypos.com/)

<TenantBlock hide={['salesplay', 'vendrex']}>

> **Backoffice, not Web POS.** Make sure you are on the **Backoffice** at [https://cloud.salesplaypos.com/](https://cloud.salesplaypos.com/). The similarly named Web POS (`selmowebpos.backofficewebportal.com`) is the cashier app — logging in there registers a POS terminal and has no API settings.

</TenantBlock>

<TenantBlock hide={['vendrex', 'sellmo']}>

2. If you don't have an account, click "Register" on the login page or go directly to the [Registration Page](https://cloud.salesplaypos.com/registration_form?lang=) to create your free SalesPlay account.

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

Log in to the SalesPlay Backoffice at [https://cloud.salesplaypos.com/](https://cloud.salesplaypos.com/), open **Integrations**, and create the token on the access token (API key) page. The [steps above](#obtaining-your-personal-access-token) show each screen.

### Does a Personal Access Token expire?

You can give a token an expiry date when you create it. A token created without one does not expire on its own; it stays valid until you delete it in the Backoffice.

### Does a Personal Access Token have scopes or permissions?

No. A Personal Access Token acts as the merchant account it was created in, with access to every endpoint. Fine-grained permissions exist only for [OAuth 2.0](oauth) apps, which are set when the app is created.

### What should I do if my token is exposed?

Delete it in the Backoffice immediately, create a new one, and update your integration. Never commit a token to source control or share it in a ticket.

