---
title: Get Your Credentials
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

# Authentication

An application credential is any piece of information that identifies, authenticates, or authorizes an application in some way.

SalesPlay API provides the following authorization methods:

## Personal Access Tokens

Personal access tokens provide a simple and secure way to authenticate API calls. This authorization method is ideal for scenarios such as running periodic scripts that interact with data in your own account.

### Obtaining Your Personal Access Token

1. Log in to the SalesPlay Backoffice at https://cloud.salesplaypos.com/
2. Navigate to the Access token page under Integrations
3. Generate and copy your access token

### Using Personal Access Tokens

For every API call, you must include your access token in the Authorization header. The header should be structured as follows:

```
Authorization: Bearer YOUR_ACCESS_TOKEN
```

Replace `YOUR_ACCESS_TOKEN` with the actual token you obtained from the SalesPlay Backoffice.

**Important:** Remember to keep your access token confidential and never share it publicly. If you suspect your token has been compromised, regenerate it immediately in the SalesPlay Backoffice.

## OAuth 2.0

OAuth 2.0 provides a more advanced authorization flow suitable for applications that need to act on behalf of merchants.

### Setting Up OAuth 2.0

1. Log in to the SalesPlay Backoffice at https://cloud.salesplaypos.com/
2. Navigate to the OAuth 2.0 setup page under Integrations
3. Create a new app by providing the necessary details, such as the app name, and selecting the permissions required by your app

After successfully creating your app, you will receive:
- **App ID**: Unique identifier for your app
- **App Secret**: Secret key for your app
- **Authorization Code**: Code used to obtain access tokens

### Obtaining an Access Token

Once you have the authorization code, request an access token by sending a POST request to:

```
https://api.salesplaypos.com/v1.0/oauth/token
```

The request must include `Content-Type: application/x-www-form-urlencoded` and the following parameters:

- `client_id`: The App ID provided when creating your app
- `client_secret`: The App Secret provided when creating your app
- `grant_type`: `authorization_code`
- `code`: The Authorization Code provided when creating your app

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

axios.post('https://api.salesplaypos.com/v1.0/oauth/token', data, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error('Error:', error.response.data);
});
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

response = requests.post('https://api.salesplaypos.com/v1.0/oauth/token', data=data)

if response.status_code == 200:
    print(response.json())
else:
    print(f'Error: {response.status_code}')
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

### Using the Access Token

Once you receive an access token, include it in the Authorization header for API requests:

```
Authorization: Bearer ACCESS_TOKEN_HERE
```

### Refreshing Access Tokens

When the access token expires, obtain a new one by making a POST request to `https://api.salesplaypos.com/v1.0/oauth/token` with the following parameters:

- `client_id`: Your App ID
- `client_secret`: Your App Secret
- `refresh_token`: The refresh token from the initial token response
- `grant_type`: `refresh_token`

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

axios.post('https://api.salesplaypos.com/v1.0/oauth/token', data, {
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded'
  }
})
.then(response => {
  console.log(response.data);
})
.catch(error => {
  console.error('Error:', error.response.data);
});
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

response = requests.post('https://api.salesplaypos.com/v1.0/oauth/token', data=data)

if response.status_code == 200:
    print(response.json())
else:
    print(f'Error: {response.status_code}')
```

  </TabItem>
</Tabs>

## Security Best Practices

1. **Keep credentials secure**: Never expose API keys, access tokens, or app secrets in client-side code
2. **Use HTTPS**: Always make requests over secure connections
3. **Rotate tokens regularly**: Generate new tokens and revoke old ones periodically
4. **Monitor usage**: Keep track of API usage for security auditing
5. **Handle token expiration**: Implement proper token refresh logic in your applications
