---
description: "HTTP status codes and the error body format of the SalesPlay API (code, details, field), rate-limit behaviour, and how to debug failed requests."
title: Troubleshooting
---

# Troubleshooting & Errors

Building a robust integration requires handling errors gracefully and understanding the feedback provided by the SalesPlay API. This guide details common error codes, rate limits, and debugging strategies.

---

## Standard HTTP Status Codes

SalesPlay uses standard HTTP response codes to indicate the success or failure of an API request.

| Code | Title | Description |
|:---|:---|:---|
| `200` | **OK** | The request was successful. |
| `400` | **Bad Request** | The request was invalid or could not be understood (e.g., missing required fields). |
| `401` | **Unauthorized** | Your Access Token is missing, invalid, or has expired. |
| `403` | **Forbidden** | You do not have the required scope or permissions for this endpoint. |
| `404` | **Not Found** | The requested resource (e.g., `store_id`, `order_id`) does not exist. |
| `429` | **Too Many Requests** | You have exceeded the rate limit. See [Rate Limiting](#rate-limiting). |
| `500` | **Internal Error** | An unexpected error occurred on our server. Please contact support. |

---

## Handling Error Responses

When an error occurs, the API returns a JSON object containing more specific details to help you debug the issue.

### Example Error Payload
```json
{
  "code": "validation_failed",
  "message": "The provided URL is not a valid HTTPS endpoint.",
  "request_id": "req_123abc456"
}
```

- **`code`**: A machine-readable string identifying the error type.
- **`message`**: A human-readable explanation of the error.
- **`request_id`**: A unique identifier for the request. **Please provide this ID when contacting support.**

---

## Rate Limiting

To ensure system stability, SalesPlay enforces the following rate limits:

- **Limit**: 300 requests per 300 seconds (per merchant account).
- **Behavior**: If you exceed this limit, the API will return a `429 Too Many Requests` error.

### Best Practices for Rate Limits
1. **Exponential Backoff**: When you receive a `429`, wait before retrying and increase the wait time with each subsequent failure.
2. **Caching**: Cache static data like Categories and Products to reduce unnecessary calls.
3. **Webhooks**: Use webhooks (SalesPlay Pulse) instead of polling endpoints to stay updated in real-time.

---

## How to debug a failed request

### 1. Use Request IDs
Every API response (success or failure) includes an `X-Request-ID` header. Log this ID in your system to correlate SalesPlay events with your local logs.

### 2. Verify Scopes
If you receive a `403 Forbidden`, check that the Personal Access Token you are using has the required scope (e.g., `orders.manage` for order operations). You can verify your token's scopes by inspecting its metadata in the SalesPlay Backoffice.

### 3. Check JSON Formatting
Ensure your `POST` and `PUT` requests have the `Content-Type: application/json` header and that the JSON body is correctly escaped.

### 4. Use Postman
Test your requests in [Postman](https://www.postman.com/) using our official collection. This helps isolate whether an issue is in your code or in the API request itself.

---

## Frequently asked questions

### What does an error response from the SalesPlay API look like?

A JSON body with an `errors` object: `{"errors": {"code": "INVALID_VALUE", "details": "The value must be a string (Supplier id can not be empty)", "field": "supplier_id"}}`. `code` is the machine-readable error, `details` explains it, and `field` (on validation errors) names the offending field. The response section of every endpoint in the [API Reference](../API-reference/index.md) shows the codes it can return.

### What does INVALID_VALUE mean?

A field in your request was rejected — missing when required, the wrong type, or outside the allowed values. Read the `field` and `details` values in the error body, correct that field, and resend.

### What should I do when I get a 429 Too Many Requests?

Stop sending, wait, and retry with exponential backoff — double the wait after each further `429`. Spread bulk work over time and use webhooks instead of polling where you can. See [Rate Limits](../API-reference/rate-limits.md).

### What should I do when I get a 500 Internal Error?

Retry the request after a short delay with backoff; a `500` is a problem on the SalesPlay side, not in your request. If it keeps happening, contact support with the endpoint, the time and the request you sent (without the token).

### What does 401 UNAUTHORIZED mean?

Your access token is missing, invalid or expired. Check the `Authorization: Bearer <token>` header and, if needed, create a new token in the Backoffice.


## Getting Support

If you encounter an error you cannot resolve:
1. Check the [SalesPlay Status Page](https://status.salesplaypos.com) for known outages.
2. Search the **[SalesPlay Help Center](https://help.salesplaypos.com)**.
3. Email our developer support team at [support@salesplaypos.com](mailto:support@salesplaypos.com) with your **Request ID** and a copy of the payload.
