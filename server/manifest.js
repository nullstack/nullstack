import {existsSync, readFileSync} from 'fs';
import path from 'path';
import project from './project';
import {generateIntegrity} from './integrities';
import files from './files';
import {cdn} from './links';

export default function generateManifest() {
  const file = path.join(__dirname, '../', 'public', 'manifest.json');
  if(existsSync(file)) {
    return readFileSync(file, 'utf-8');
  }
  const json = {
    "name": project.name,
    "short_name": project.shortName || project.name,
    "theme_color": project.color,
    "background_color": project.backgroundColor || project.color,
    "display": project.display,
    "orientation": project.orientation,
    "scope": project.scope,
    "start_url": project.root,
    "icons": [],    
    "splash_pages": null
  }
  for(const size in project.icons) {
    const icon = project.icons[size];
    json.icons.push({
      "src": cdn(icon),
      "sizes": `${size}x${size}`,
      "type": "image/png",
      "purpose": "maskable any"
    });
  }
  const manifest = JSON.stringify(json);
  generateIntegrity('manifest.json', manifest);
  files['manifest.json'] = manifest;
}