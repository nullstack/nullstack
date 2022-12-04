import { existsSync, readFileSync } from 'fs'
import path from 'path'

import files from './files'
import { generateIntegrity } from './integrities'
import { cdn } from './links'
import project from './project'

export default function generateManifest(server) {
  if (files['manifest.webmanifest']) return files['manifest.webmanifest']
  const file = path.join(__dirname, '../', 'public', 'manifest.webmanifest')
  if (existsSync(file)) {
    return readFileSync(file, 'utf-8')
  }
  const json = {
    name: project.name,
    short_name: project.shortName || project.name,
    theme_color: project.color,
    background_color: project.backgroundColor || project.color,
    display: project.display,
    orientation: project.orientation,
    scope: project.scope,
    start_url: project.root,
    icons: [],
    splash_pages: null,
  }
  for (const size in project.icons) {
    const icon = project.icons[size]
    json.icons.push({
      src: cdn(icon),
      sizes: `${size}x${size}`,
      type: 'image/png',
      purpose: 'maskable any',
    })
  }
  const manifest = JSON.stringify(json)
  if (!server.less) {
    generateIntegrity('manifest.webmanifest', manifest)
  }
  files['manifest.webmanifest'] = manifest
  return manifest
}
