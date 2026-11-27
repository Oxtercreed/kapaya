'use strict';

/**
 * Kapaya brand geometry. Shared by build.cjs (inline SVG symbols / favicon) and
 * build-logo.cjs (standalone SVG sources and the transparent 4K PNG master).
 * The split ring is deliberately built from two open Bézier arcs so it matches
 * the supplied reference without carrying its low-resolution artefact halo.
 */
const BRAND_ORANGE = '#B84B18';
const BRAND_INK = '#14171E';
const BRAND_CREAM = '#F4F3EF';

const arcs = (x = 0) => `
  <g fill="none" stroke="${BRAND_ORANGE}" stroke-width="10.5" stroke-linecap="round"${x ? ` transform="translate(${x} 0)"` : ''}>
    <path d="M17 41 C17 8 83 8 83 41"/>
    <path d="M17 59 C17 92 83 92 83 59"/>
  </g>`;

const monogram = (x = 0) => `
  <g fill="none" stroke="${BRAND_INK}" stroke-width="9.5" stroke-linecap="round" stroke-linejoin="round"${x ? ` transform="translate(${x} 0)"` : ''}>
    <path d="M40 26 V74"/>
    <path d="M42 50 L70 26"/>
    <path d="M42 50 L70 74"/>
  </g>`;

const brandBody = String.raw`${arcs()}${monogram()}
  <text x="106" y="69" fill="${BRAND_INK}" font-family="Inter, Arial, Helvetica, sans-serif" font-size="56" font-weight="700" letter-spacing="-2.6">Kapaya</text>`;

const markBody = String.raw`
  <rect width="100" height="100" rx="24" fill="${BRAND_CREAM}"/>${arcs()}${monogram()}`;

const brandSvg = (fontCss = '') => `<svg xmlns="http://www.w3.org/2000/svg" width="340" height="100" viewBox="0 0 340 100" role="img" aria-label="Kapaya"><title>Kapaya</title>${fontCss ? `<style>${fontCss}</style>` : ''}${brandBody}</svg>`;

const markSvg = () => `<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100" role="img" aria-label="Kapaya monogram"><title>Kapaya monogram</title>${markBody}</svg>`;

module.exports = {
  BRAND_ORANGE,
  BRAND_INK,
  BRAND_CREAM,
  brandBody,
  markBody,
  brandSvg,
  markSvg,
};
