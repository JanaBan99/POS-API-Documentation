/**
 * Overrides Docusaurus's category page (sidebars.js `link: { type: 'generated-index' }`).
 * Same as the stock component minus the <DocCardList> tile grid: the page shows the
 * category title, its description, and the previous / next buttons only.
 * Stock source: node_modules/@docusaurus/theme-classic/lib/theme/DocCategoryGeneratedIndexPage/index.js
 */
import React from 'react';
import { PageMetadata } from '@docusaurus/theme-common';
import useBaseUrl from '@docusaurus/useBaseUrl';
import DocPaginator from '@theme/DocPaginator';
import DocVersionBanner from '@theme/DocVersionBanner';
import DocVersionBadge from '@theme/DocVersionBadge';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import Heading from '@theme/Heading';

export default function DocCategoryGeneratedIndexPage({ categoryGeneratedIndex }) {
  return (
    <>
      <PageMetadata
        title={categoryGeneratedIndex.title}
        description={categoryGeneratedIndex.description}
        keywords={categoryGeneratedIndex.keywords}
        image={useBaseUrl(categoryGeneratedIndex.image)}
      />
      <div>
        <DocVersionBanner />
        <DocBreadcrumbs />
        <DocVersionBadge />
        <header>
          <Heading as="h1">{categoryGeneratedIndex.title}</Heading>
          {categoryGeneratedIndex.description && <p>{categoryGeneratedIndex.description}</p>}
        </header>
        <footer className="margin-top--lg">
          <DocPaginator
            previous={categoryGeneratedIndex.navigation.previous}
            next={categoryGeneratedIndex.navigation.next}
          />
        </footer>
      </div>
    </>
  );
}
