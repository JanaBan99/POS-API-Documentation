---
description: "Pre-launch checklist for a SalesPlay API integration: security, error handling, rate limits, webhooks, monitoring and support contacts."
title: Launch
---

# Going Live Checklist

Transitioning from development to production is a critical milestone. This checklist ensures your integration is secure, reliable, and ready to provide a seamless experience for SalesPlay merchants and their customers.

---

## Pre-launch checklist

Before requesting production access, ensure your integration meets these technical requirements:

- [ ] **Secure Endpoints**: All webhook URLs and API communications are performed over **HTTPS/TLS 1.2+**.
- [ ] **Error Handling**: Your system implements **exponential backoff** for handling `429 Too Many Requests` and `5xx` server errors.
- [ ] **Response Times**: Your webhook listener acknowledges receipts within **2 seconds** to prevent timeout-triggered retries.
- [ ] **Immutability**: You have verified that your system does not attempt to modify orders once they are accepted.

---

## Production Credentials

Production tokens provide access to live merchant data and transactions. 

1. **New Token Generation**: Generate a new **Personal Access Token** specifically for your production environment.
2. **Environment Variable**: Use environment variables (e.g., `SALESPLAY_API_TOKEN`) to manage credentials; never hardcode them in your source code.
3. **Least Privilege**: Ensure the production token only has the specific scopes required for the app to function.

---

## Monitoring & Logging

Robust logging is essential for production support.

- **Log Request IDs**: Store the `X-Request-ID` for every SalesPlay interaction. This is the first thing our support team will ask for.
- **Webhook Health**: Monitor your webhook success rate. A sudden spike in `500` or `404` errors from your endpoint could indicate a deployment issue.
- **Alerting**: Set up active alerts for connectivity issues with `api.salesplaypos.com`.

---

## Final Approval

Once your testing in the sandbox environment is complete:

1. **Submit for Review**: Send an email to [partners@salesplaypos.com](mailto:partners@salesplaypos.com) with a short video or demo of your integration in action.
2. **Technical Validation**: Our team will conduct a brief verification of your webhook implementation and core API flows.
3. **Whitelisting**: Upon approval, your developer account will be whitelisted for production traffic.

---

## Production Support

For urgent production issues, please contact our Developer Support Hotdesk:

- **Email**: [dev-support@salesplaypos.com](mailto:dev-support@salesplaypos.com)
- **Emergency Chat**: Available in the SalesPlay Backoffice during business hours (GMT+5:30).
- **Status Page**: [https://status.salesplaypos.com](https://status.salesplaypos.com)
