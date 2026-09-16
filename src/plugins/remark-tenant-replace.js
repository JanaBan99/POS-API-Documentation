/**
 * Remark plugin: turns the SalesPlay-written source into the current brand
 * while each page is compiled.
 *
 *  - Text, inline code, code blocks, raw HTML, link/image URLs and titles, and
 *    JSX string attributes (e.g. alt="SalesPlay Backoffice") go through
 *    `replaceText` from tenant.js.
 *  - Every image path written as /img/<name> (Markdown images and the `src`
 *    of <TenantImage>) is resolved to /img/<brand folder>/<name>, or
 *    /img/shared/<name> when the brand folder has no such file.
 *
 * Runs for every brand, SalesPlay included — no tenant is special.
 */
import { replaceText, resolveImg } from '../../tenant.js';

const TEXT_NODES = new Set(['text', 'inlineCode', 'code', 'html']);
const JSX_NODES = new Set(['mdxJsxFlowElement', 'mdxJsxTextElement']);

function walk(node) {
  if (!node) return;

  if (TEXT_NODES.has(node.type)) {
    node.value = replaceText(node.value);
  } else if (node.type === 'link' || node.type === 'image') {
    node.url = replaceText(node.url);
    if (node.type === 'image') node.url = resolveImg(node.url);
    node.title = replaceText(node.title);
  } else if (JSX_NODES.has(node.type)) {
    for (const attr of node.attributes || []) {
      if (typeof attr.value !== 'string') continue;
      if (attr.name === 'hide') continue; // <TenantBlock hide="salesplay"> is a brand key, not page text
      attr.value = attr.name === 'src' ? resolveImg(attr.value) : replaceText(attr.value);
    }
  }

  for (const child of node.children || []) walk(child);
}

export default function remarkTenantReplace() {
  return (tree) => {
    walk(tree);
    return tree;
  };
}
