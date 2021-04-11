import project, { generateBase } from './project';
import files from './files';

export default function generateRobots() {
  if(files['robots.txt']) return files['robots.txt'];
  const lines = []
  lines.push('User-Agent: *');
  if(!project.disallow.includes('/')) {
    lines.push(`Allow: ${project.root}`);
  }
  for(const path of project.disallow) {
    lines.push(`Disallow: ${path}`);
  }
  if(project.sitemap) {
    if(project.sitemap === true) {
      lines.push(`Sitemap: ${generateBase()}/sitemap.xml`);
    } else if (project.sitemap.indexOf('//') === -1) {
      lines.push(`Sitemap: ${generateBase()}${project.sitemap}`);
    } else {
      lines.push(`Sitemap: ${project.sitemap}`);
    }
  }
  files['robots.txt'] = lines.join(`\n`);
  return files['robots.txt']
}