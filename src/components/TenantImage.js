import React from 'react';

/**
 * Brand-aware screenshot. Write `src="/img/<name>"` and the build resolves it to
 * /img/<brand folder>/<name> (or /img/shared/<name> if the brand has no such
 * file) — see `resolveImg` in tenant.js, applied by src/plugins/remark-tenant-replace.js.
 * By the time this component renders, `src` is already the final path.
 */
export default function TenantImage(props) {
  return <img {...props} />;
}
