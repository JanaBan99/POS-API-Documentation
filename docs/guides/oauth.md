---
description: "Set up OAuth 2.0 for a SalesPlay app: create the app in the Backoffice, get the App ID, secret and authorization code, then request and refresh access tokens."
title: OAuth 2.0
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

import TenantBlock from '@site/src/components/TenantBlock';
import TenantImage from '@site/src/components/TenantImage';

# OAuth 2.0

OAuth 2.0 provides a more advanced authorization flow suitable for applications that need to act on behalf of merchants.

## OAuth Flow

### Step 1 — Create Your App

<TenantBlock hide={['vendrex', 'sellmo']}>

Log in to the SalesPlay Backoffice at [https://cloud.salesplaypos.com/](https://cloud.salesplaypos.com/) and navigate to the **OAuth 2.0** setup page under **Integrations**. Create a new app by providing the app name and selecting the permissions your app requires. You can find the full list of available permissions on that page.

</TenantBlock>
<TenantBlock hide="salesplay">

Log in to the SalesPlay Backoffice at [https://cloud.salesplaypos.com/](https://cloud.salesplaypos.com/), open **Integrations** (the puzzle icon), then **Developer Tools → OAuth Apps**. Click **Add App Token**, give the app a name, tick the permissions it needs, and **Save**. The full list of permissions is shown on that page.

</TenantBlock>

<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <TenantImage
    src="/img/oauth_token.png" 
    style={{
      width: '100%',
      borderRadius: '8px', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #eee'
    }} 
    alt="SalesPlay Backoffice: the OAuth apps page under Integrations, with the form to add a new app and its permissions" 
  />
</div>

### Step 2 — Get Your Keys

After successfully creating your app, you will receive 3 unique keys:

| Key | Description |
|-----|-------------|
| **App ID** | Unique identifier for your app |
| **App Secret** | Secret key for your app |
| **Authorization Code** | Code used to obtain access tokens |

<div style={{textAlign: 'center', margin: '2rem 0'}}>
  <TenantImage
    src="/img/outh_token_app.png" 
    style={{
      width: '100%',
      borderRadius: '8px', 
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
      border: '1px solid #eee'
    }} 
    alt="SalesPlay Backoffice: an OAuth app opened, showing its App ID, App Secret (masked), Authorization Code and permissions" 
  />
</div>

### Step 3 — Request an Access Token

Once you have the authorization code, request an access token by sending a `POST` request to:

```
https://api.salesplaypos.com/v1.0/oauth/token
```

The payload must be `Content-Type: application/x-www-form-urlencoded` and include:

- `client_id` — The App ID provided when creating your app
- `client_secret` — The App Secret provided when creating your app
- `grant_type` — `authorization_code`
- `code` — The Authorization Code provided when creating your app

#### Example Request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X POST https://api.salesplaypos.com/v1.0/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_APP_ID" \
  -d "client_secret=YOUR_APP_SECRET" \
  -d "grant_type=authorization_code" \
  -d "code=YOUR_AUTHORIZATION_CODE"
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
const axios = require('axios');

const data = new URLSearchParams();
data.append('client_id', 'YOUR_APP_ID');
data.append('client_secret', 'YOUR_APP_SECRET');
data.append('grant_type', 'authorization_code');
data.append('code', 'YOUR_AUTHORIZATION_CODE');

const response = await axios.post(
  'https://api.salesplaypos.com/v1.0/oauth/token',
  data,
  { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
);

console.log(response.data);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

data = {
    'client_id': 'YOUR_APP_ID',
    'client_secret': 'YOUR_APP_SECRET',
    'grant_type': 'authorization_code',
    'code': 'YOUR_AUTHORIZATION_CODE'
}

response = requests.post(
    'https://api.salesplaypos.com/v1.0/oauth/token',
    data=data
)

print(response.json())
```

  </TabItem>
  <TabItem value="php" label="PHP">

```php
<?php

$data = http_build_query([
    'client_id'     => 'YOUR_APP_ID',
    'client_secret' => 'YOUR_APP_SECRET',
    'grant_type'    => 'authorization_code',
    'code'          => 'YOUR_AUTHORIZATION_CODE',
]);

$ch = curl_init('https://api.salesplaypos.com/v1.0/oauth/token');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);

$response = curl_exec($ch);
curl_close($ch);

print_r(json_decode($response, true));
```

  </TabItem>
  <TabItem value="java" label="Java (Standard)">

```java
import java.net.URI;
import java.net.http.*;
import java.net.http.HttpRequest.BodyPublishers;

HttpClient client = HttpClient.newHttpClient();

String body = "client_id=YOUR_APP_ID"
    + "&client_secret=YOUR_APP_SECRET"
    + "&grant_type=authorization_code"
    + "&code=YOUR_AUTHORIZATION_CODE";

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.salesplaypos.com/v1.0/oauth/token"))
    .header("Content-Type", "application/x-www-form-urlencoded")
    .POST(BodyPublishers.ofString(body))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.util.*;

RestTemplate restTemplate = new RestTemplate();

HttpHeaders headers = new HttpHeaders();
headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
map.add("client_id", "YOUR_APP_ID");
map.add("client_secret", "YOUR_APP_SECRET");
map.add("grant_type", "authorization_code");
map.add("code", "YOUR_AUTHORIZATION_CODE");

HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
ResponseEntity<String> response = restTemplate.postForEntity(
    "https://api.salesplaypos.com/v1.0/oauth/token", 
    request, 
    String.class
);

System.out.println(response.getBody());
```

  </TabItem>

  <TabItem value="csharp" label="C# (.NET)">

```csharp
using System.Net.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

using var client = new HttpClient();

var values = new Dictionary<string, string>
{
    { "client_id", "YOUR_APP_ID" },
    { "client_secret", "YOUR_APP_SECRET" },
    { "grant_type", "authorization_code" },
    { "code", "YOUR_AUTHORIZATION_CODE" }
};

var content = new FormUrlEncodedContent(values);
var response = await client.PostAsync("https://api.salesplaypos.com/v1.0/oauth/token", content);

var responseString = await response.Content.ReadAsStringAsync();
Console.WriteLine(responseString);
```

  </TabItem>
</Tabs>

#### Successful Response

```json
{
  "access_token": "d6a4a1ceb2b6738352ddc945a676c5cf37d8ca4e",
  "expires_in": 3600,
  "token_type": "Bearer",
  "scope": "OptNZG",
  "refresh_token": "b54f8bc7235272c569c1ec25684a430c5d94050b"
}
```

### Step 4 — Use the Access Token

Once you receive an access token, include it in the `Authorization` header for all API requests made on behalf of the merchant:

```
Authorization: Bearer ACCESS_TOKEN_HERE
```

---

## Refreshing Access Tokens

Access tokens expire after `3600` seconds (1 hour). When that happens, use the refresh token to obtain a new access token without going through the full OAuth flow again.

Send a `POST` request to `https://api.salesplaypos.com/v1.0/oauth/token` with the following parameters:

- `client_id` — Your App ID
- `client_secret` — Your App Secret
- `refresh_token` — The refresh token from the previous token response
- `grant_type` — `refresh_token`

#### Example Refresh Request

<Tabs>
  <TabItem value="curl" label="cURL" default>

```bash
curl -X POST https://api.salesplaypos.com/v1.0/oauth/token \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "client_id=YOUR_APP_ID" \
  -d "client_secret=YOUR_APP_SECRET" \
  -d "refresh_token=YOUR_REFRESH_TOKEN" \
  -d "grant_type=refresh_token"
```

  </TabItem>
  <TabItem value="javascript" label="JavaScript">

```javascript
const axios = require('axios');

const data = new URLSearchParams();
data.append('client_id', 'YOUR_APP_ID');
data.append('client_secret', 'YOUR_APP_SECRET');
data.append('refresh_token', 'YOUR_REFRESH_TOKEN');
data.append('grant_type', 'refresh_token');

const response = await axios.post(
  'https://api.salesplaypos.com/v1.0/oauth/token',
  data,
  { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
);

console.log(response.data);
```

  </TabItem>
  <TabItem value="python" label="Python">

```python
import requests

data = {
    'client_id': 'YOUR_APP_ID',
    'client_secret': 'YOUR_APP_SECRET',
    'refresh_token': 'YOUR_REFRESH_TOKEN',
    'grant_type': 'refresh_token'
}

response = requests.post(
    'https://api.salesplaypos.com/v1.0/oauth/token',
    data=data
)

print(response.json())
```

  </TabItem>
  <TabItem value="php" label="PHP">

```php
<?php

$data = http_build_query([
    'client_id'     => 'YOUR_APP_ID',
    'client_secret' => 'YOUR_APP_SECRET',
    'refresh_token' => 'YOUR_REFRESH_TOKEN',
    'grant_type'    => 'refresh_token',
]);

$ch = curl_init('https://api.salesplaypos.com/v1.0/oauth/token');
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_HTTPHEADER, ['Content-Type: application/x-www-form-urlencoded']);

$response = curl_exec($ch);
curl_close($ch);

print_r(json_decode($response, true));
```

  </TabItem>
  <TabItem value="java" label="Java (Standard)">

```java
import java.net.URI;
import java.net.http.*;
import java.net.http.HttpRequest.BodyPublishers;

HttpClient client = HttpClient.newHttpClient();

String body = "client_id=YOUR_APP_ID"
    + "&client_secret=YOUR_APP_SECRET"
    + "&refresh_token=YOUR_REFRESH_TOKEN"
    + "&grant_type=refresh_token";

HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://api.salesplaypos.com/v1.0/oauth/token"))
    .header("Content-Type", "application/x-www-form-urlencoded")
    .POST(BodyPublishers.ofString(body))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());
```

  </TabItem>
  <TabItem value="spring" label="Spring Boot">

```java
import org.springframework.web.client.RestTemplate;
import org.springframework.http.*;
import org.springframework.util.*;

RestTemplate restTemplate = new RestTemplate();

HttpHeaders headers = new HttpHeaders();
headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

MultiValueMap<String, String> map = new LinkedMultiValueMap<>();
map.add("client_id", "YOUR_APP_ID");
map.add("client_secret", "YOUR_APP_SECRET");
map.add("refresh_token", "YOUR_REFRESH_TOKEN");
map.add("grant_type", "refresh_token");

HttpEntity<MultiValueMap<String, String>> request = new HttpEntity<>(map, headers);
ResponseEntity<String> response = restTemplate.postForEntity(
    "https://api.salesplaypos.com/v1.0/oauth/token", 
    request, 
    String.class
);

System.out.println(response.getBody());
```

  </TabItem>

  <TabItem value="csharp" label="C# (.NET)">

```csharp
using System.Net.Http;
using System.Collections.Generic;
using System.Threading.Tasks;

using var client = new HttpClient();

var values = new Dictionary<string, string>
{
    { "client_id", "YOUR_APP_ID" },
    { "client_secret", "YOUR_APP_SECRET" },
    { "refresh_token", "YOUR_REFRESH_TOKEN" },
    { "grant_type", "refresh_token" }
};

var content = new FormUrlEncodedContent(values);
var response = await client.PostAsync("https://api.salesplaypos.com/v1.0/oauth/token", content);

var responseString = await response.Content.ReadAsStringAsync();
Console.WriteLine(responseString);
```

  </TabItem>
</Tabs>

> **💡 Token Expiry**
> 
> Store the `expires_in` value when you receive a token and set up a timer to refresh it before it expires. This avoids failed API calls due to an expired token.

## Frequently asked questions

### When should I use OAuth 2.0 instead of a Personal Access Token?

Use a [Personal Access Token](personal-access-tokens) for an integration that works with your own SalesPlay account. Use OAuth 2.0 when your application acts on behalf of other merchants, each of whom authorises your app from their own Backoffice.

### What are the App ID, App Secret and Authorization Code?

The three values the SalesPlay Backoffice shows after you create an OAuth app under **Integrations**. Your app sends them to obtain an access token; keep the secret and the code private.

### How long does an OAuth access token last, and how do I renew it?

An access token expires after `3600` seconds (one hour). Use the refresh token you received with it to obtain a new access token without repeating the authorisation, as described under [Refreshing Access Tokens](#refreshing-access-tokens).

### Where are an app's permissions set?

In the Backoffice when the app is created — tick the permissions the app needs on the app form. The token issued to the app is limited to those permissions.

