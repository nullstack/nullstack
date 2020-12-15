import project from './project';

export default function generateRobot() {
  const lines = []
  lines.push('User-Agent: *');
  if(!project.disallow.includes('/')) {
    lines.push('Allow: /');
  }
  for(const path of project.disallow) {
    lines.push(`Disallow: ${path}`);
  }
  if(project.sitemap) {
    if(project.sitemap === true) {
      lines.push(`Sitemap: https://${project.domain}/sitemap.xml`);
    } else if (project.sitemap.indexOf('//') === -1) {
      lines.push(`Sitemap: https://${project.domain}${project.sitemap}`);
    } else {
      lines.push(`Sitemap: ${project.sitemap}`);
    }
  }
  return lines.join(`\n`);
}