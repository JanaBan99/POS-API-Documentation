---
description: "How the SalesPlay API is versioned: the current v1.0 base URL, what counts as a breaking change, and how changes are announced."
title: API Versioning
---

# API Versioning

The SalesPlay API follows semantic versioning to ensure backward compatibility while allowing for continuous improvements and new features.

## Current Version

**Version 1.0** is the current stable release of the SalesPlay API. This documentation covers all endpoints and features available in this version.

## Version in Base URL

The API version must be specified in every request URL:

```
https://api.salesplaypos.com/v1.0
```

### Examples

**Correct:**
```
GET https://api.salesplaypos.com/v1.0/products
POST https://api.salesplaypos.com/v1.0/customers
```

**Incorrect (will fail):**
```
GET https://api.salesplaypos.com/products
POST https://api.salesplaypos.com/v2.0/customers
```

## Versioning Policy

### Breaking Changes

Breaking changes require a major version increment (e.g., v1.0 → v2.0). Breaking changes include:

- Removing or renaming endpoints
- Removing or renaming request/response fields
- Changing the type of a field
- Changing HTTP method requirements
- Removing or changing authentication methods

### Non-Breaking Changes

Non-breaking changes are introduced within the current version. These include:

- Adding new endpoints
- Adding new optional fields to requests
- Adding new fields to responses
- Adding new optional query parameters
- Deprecating (but not removing) endpoints or fields

## Backward Compatibility

We maintain backward compatibility within a major version. Existing integrations will continue to work even after updates within the same version (e.g., v1.0 → v1.1).

> **💡 Best Practice**
>
> Always specify the full version (v1.0) in your requests rather than omitting it. This ensures your integration remains stable even if new major versions are released.

## Deprecation Policy

When an endpoint or feature is deprecated:

1. **Documentation** — The feature is marked as deprecated in the API documentation
2. **Communication** — We notify developers 90 days before removal
3. **Replacement** — A new recommended approach is provided
4. **Support** — Deprecated features continue to work during the grace period

### Example Deprecation Timeline

```
Day 0:    Feature marked as deprecated
Day 30:   Email notification sent to developers
Day 90:   Final notice sent
Day 120:  Feature removed in next major version
```

## Version History

### v1.0 (Current)

**Release Date:** 2024-01-15

**Features:**
- REST API with 40+ endpoints
- Personal Access Token authentication
- OAuth 2.0 support
- Webhook events for real-time notifications
- Rate limiting (300 requests per 300 seconds)
- Full CRUD operations for products, customers, orders, and more

**Improvements:**
- Added inventory level tracking
- Enhanced error handling with detailed codes
- Improved pagination with cursor support
- Support for multi-shop operations

## Future Versions

New major versions will be announced with:

- 6 months advance notice
- Clear migration guides
- Side-by-side endpoint documentation
- Example code in popular languages

## Checking Your API Version

You can verify which API version you're using by:

1. **Checking your base URL** — The version is in the URL path
2. **Reviewing this documentation** — The version is on the homepage
3. **Contacting Support** — We can confirm your integration version

## Migration Guide

When a new major version is released, we provide:

- **Endpoint Mapping** — Which v1 endpoints map to v2 endpoints
- **Code Examples** — Updated examples in multiple languages
- **Testing Guide** — Steps to test your integration with the new version
- **Support Period** — How long both versions are supported

## Getting Help

Need assistance with versioning?

- Check the [Errors Guide](errors-guide) for version-related errors
- Contact our support team through the SalesPlay Backoffice

---

**Current API Version: v1.0**

Always ensure your requests include the correct version in the URL for optimal performance and compatibility.
