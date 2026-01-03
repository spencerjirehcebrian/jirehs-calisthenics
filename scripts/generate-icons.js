/**
 * Generate placeholder PWA icons
 *
 * Creates simple icons with sky blue background and "JC" initials
 * Run with: node scripts/generate-icons.js
 */

import sharp from 'sharp'
import { writeFileSync, mkdirSync, existsSync } from 'fs'
import { dirname, join } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const publicDir = join(__dirname, '..', 'public')

// Sky blue color from Tailwind (sky-500)
const SKY_BLUE = '#0ea5e9'
const WHITE = '#ffffff'

/**
 * Create an SVG with centered text
 */
function createIconSvg(size, text = 'JC') {
  const fontSize = Math.round(size * 0.4)
  const y = Math.round(size * 0.58) // Adjust for visual centering

  return `
    <svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
      <rect width="${size}" height="${size}" fill="${SKY_BLUE}" rx="${Math.round(size * 0.15)}"/>
      <text
        x="50%"
        y="${y}"
        font-family="system-ui, -apple-system, sans-serif"
        font-size="${fontSize}"
        font-weight="700"
        fill="${WHITE}"
        text-anchor="middle"
      >${text}</text>
    </svg>
  `.trim()
}

/**
 * Generate a PNG icon from SVG
 */
async function generateIcon(size, filename) {
  const svg = createIconSvg(size)
  const outputPath = join(publicDir, filename)

  await sharp(Buffer.from(svg))
    .png()
    .toFile(outputPath)

  console.log(`Generated: ${filename} (${size}x${size})`)
}

async function main() {
  // Ensure public directory exists
  if (!existsSync(publicDir)) {
    mkdirSync(publicDir, { recursive: true })
  }

  console.log('Generating PWA icons...\n')

  // Generate icons
  await generateIcon(192, 'icon-192.png')
  await generateIcon(512, 'icon-512.png')
  await generateIcon(180, 'apple-touch-icon.png')

  // Also generate a favicon
  await generateIcon(32, 'favicon.ico')

  console.log('\nDone! Icons saved to public/')
}

main().catch(console.error)
