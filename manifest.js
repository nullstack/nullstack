export default function manifest(project) {
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
      "src": icon,
      "sizes": `${size}x${size}`,
      "type": "image/png",
      "purpose": "maskable any"
    });
  }
  return json;
}