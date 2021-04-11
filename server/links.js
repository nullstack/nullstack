import project, { generateBase } from './project';
import environment from './environment';

export function absolute(path) {
  if(path.indexOf('//') === -1) {
    return `${generateBase()}${path}`;
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
  return `${generateBase()}${path}`;
}