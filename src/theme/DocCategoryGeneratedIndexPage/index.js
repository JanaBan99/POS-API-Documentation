/**
 * Overrides Docusaurus's category page (sidebars.js `link: { type: 'generated-index' }`).
 * Shows the title and description, then — for API Reference categories listed in
 * src/data/category-overviews.js — a "What you can do" feature grid.
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
import overviews from '@site/src/data/category-overviews';

export default function DocCategoryGeneratedIndexPage({ categoryGeneratedIndex }) {
  const { title, description } = categoryGeneratedIndex;
  const extra = overviews[title];
  return (
    <>
      <PageMetadata
        title={title}
        description={description}
        keywords={categoryGeneratedIndex.keywords}
        image={useBaseUrl(categoryGeneratedIndex.image)}
      />
      <div>
        <DocVersionBanner />
        <DocBreadcrumbs />
        <DocVersionBadge />
        <header>
          <Heading as="h1">{title}</Heading>
          {description && <p>{description}</p>}
        </header>
        {extra && (
          <>
            <Heading as="h2">What you can do</Heading>
            <div className="cat-features">
              {extra.features.map(([name, text]) => (
                <div key={name} className="cat-feature">
                  <strong>{name}</strong>
                  <p>{text}</p>
                </div>
              ))}
            </div>
          </>
        )}
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
