/**
 * The single place brand facts come from.
 *
 * Reads `.env.<TENANT>` (TENANT defaults to "salesplay") into process.env using
 * Node's built-in loader, then exports one `profile` object plus the two helpers
 * every brand-aware file needs: `replaceText` (SalesPlay text → this brand) and
 * `resolveImg` (/img/<name> → the brand's image folder, else shared/).
 *
 * A personal `.env` (git-ignored) is loaded first, so anything in it wins over
 * the committed brand file. Shell variables win over both.
 */
import fs from 'fs';
import path from 'path';

const TENANT = (process.env.TENANT || 'salesplay').trim().toLowerCase();

for (const file of ['.env', `.env.${TENANT}`]) {
  try { process.loadEnvFile(file); } catch { /* .env is optional */ }
}

const env = (key) => {
  const value = process.env[key];
  if (!value) throw new Error(`${key} is missing — check .env.${TENANT}`);
  return value.trim();
};

export const profile = {
  tenant: TENANT,
  name: env('TENANT_NAME'),
  host: env('TENANT_HOST'),
  apiBaseUrl: env('TENANT_API_BASE_URL'),
  backofficeUrl: env('TENANT_BACKOFFICE_URL'),
  developerUrl: env('TENANT_DEVELOPER_URL'),
  siteTitle: env('TENANT_SITE_TITLE'),
  postmanUrl: env('TENANT_POSTMAN_URL'),
  favicon: env('TENANT_FAVICON'),
  imgDir: env('TENANT_IMG_DIR'),
};

// Source files are always written as SalesPlay. These rules turn them into the
// current brand. Whole URLs go first so a brand whose API host is not simply
// "<brand>.com" (Sellmo) still gets the right address; name/host fragments last.
const replacements = [
  [/https:\/\/api\.salesplaypos\.com\/v1\.0/g, profile.apiBaseUrl],
  [/https:\/\/api\.salesplaypos\.com/g, new URL(profile.apiBaseUrl).origin],
  [/https:\/\/cloud\.salesplaypos\.com\/?/g, profile.backofficeUrl],
  [/https:\/\/developer\.salesplay\.com\/download_postman_collection\.php/g, profile.postmanUrl],
  [/https:\/\/developer\.salesplay\.com/g, profile.developerUrl],
  [/SalesPlay/g, profile.name],
  [/SALESPLAY/g, profile.name.toUpperCase()],
  [/salesplaypos\.com/g, profile.host],
  [/salesplay/g, profile.name.toLowerCase()],
];

export function replaceText(value) {
  if (typeof value !== 'string' || !value) return value;
  return replacements.reduce((text, [search, replace]) => text.replace(search, replace), value);
}

// "/img/login.png" → "/img/<brand folder>/login.png" if that file exists,
// else "/img/shared/login.png". Paths that already name a folder are left alone.
export function resolveImg(url) {
  const match = /^\/img\/([^/]+)$/.exec(url || '');
  if (!match) return url;
  const dir = fs.existsSync(path.join('static', 'img', profile.imgDir, match[1])) ? profile.imgDir : 'shared';
  return `/img/${dir}/${match[1]}`;
}
