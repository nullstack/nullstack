import Nullstack from 'nullstack';

class ContextProject extends Nullstack {

  static async start({project}) {
    project.name = 'Nullstack Tests';
    project.shortName = 'Nullstack';
    project.domain = 'nullstack.app';
    project.color = '#d22365';
    project.backgroundColor = '#d22365';
    project.type = 'website';
    project.display = 'standalone';
    project.orientation = 'portrait';
    project.scope = '/';
    project.root = '/';
    project.icons = {
      '72': '/icon-72x72.png',
      '144': '/icon-144x144.png'
    };
    project.favicon = '/favicon-96x96.png';
    project.disallow = ['/admin'];
    project.sitemap = true;
  }
  
  render({project}) {
    return (
      <div> 
        <div data-project={!!project} />
        <div data-name={project.name} />
        <div data-short-name={project.shortName} />
        <div data-domain={project.domain} />
        <div data-color={project.color} />
        <div data-background-color={project.backgroundColor} />
        <div data-type={project.type} />
        <div data-display={project.display} />
        <div data-orientation={project.orientation} />
        <div data-scope={project.scope} />
        <div data-root={project.root} />
        <div data-icons={!!project.icons} />
        <div data-icon-72={project.icons['72']} />
        <div data-favicon={project.favicon} />
        <div data-disallow={!!project.disallow} />
        <div data-disallow-admin={project.disallow[0]} />
        <div data-sitemap={project.sitemap} />
      </div>
    )
  }

}

export default ContextProject;