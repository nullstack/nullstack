import project from './project';
import environment from './environment';

export function absolute(path) {
  if(path.indexOf('//') === -1) {
    return `${project.protocol}://${project.domain}${path}`;
  }  
  return path;
}

export function cdn(path) {
  if(!project.cdn || environment.development) return path;
  if(path.indexOf('//') === -1) {
    return `${project.protocol}://${project.cdn}${path}`;
  }  
  return path;
}

export function cdnOrAbsolute(path) {
  if(path.indexOf('//') > -1) return path;
  if(project.cdn) return `${project.protocol}://${project.cdn}${path}`;
  return `${project.protocol}://${project.domain}${path}`;
}