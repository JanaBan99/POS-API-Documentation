import React from 'react';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';

export default function TenantBlock({ hide, children }) {
  const { siteConfig } = useDocusaurusContext();
  const tenant = siteConfig.customFields.tenant;
  const hideTenants = Array.isArray(hide) ? hide : [hide];
  if (hideTenants.includes(tenant)) return null;
  return <>{children}</>;
}