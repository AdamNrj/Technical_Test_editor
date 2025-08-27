// lib/mock-image.ts
export function svgPlaceholderDataUrl(text: string) {
  const svg = `
  <svg xmlns="http://www.w3.org/2000/svg" width="1024" height="768">
    <defs>
      <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#111827"/>
        <stop offset="1" stop-color="#0ea5e9"/>
      </linearGradient>
    </defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="50%" font-size="48" font-family="sans-serif"
          fill="#fff" text-anchor="middle" dominant-baseline="middle">
      ${text.replace(/</g, '&lt;')}
    </text>
  </svg>`
  const encoded = encodeURIComponent(svg)
  return `data:image/svg+xml;charset=utf-8,${encoded}`
}
