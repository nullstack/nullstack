import project from './project';
import files from './files';

export default function generateRobots() {
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
      lines.push(`Sitemap: ${project.protocol}://${project.domain}/sitemap.xml`);
    } else if (project.sitemap.indexOf('//') === -1) {
      lines.push(`Sitemap: ${project.protocol}://${project.domain}${project.sitemap}`);
    } else {
      lines.push(`Sitemap: ${project.sitemap}`);
    }
  }
  files['robots.txt'] = lines.join(`\n`);
}