import project from './project';

export function absolute(path) {
  if(path.indexOf('//') === -1) {
    return `${project.protocol}://${project.domain}${path}`;
  }  
  return path;
}

export function cdn(path) {
  if(!project.cdn) return path;
  if(path.indexOf('//') === -1) {
    return `${project.protocol}://${project.cdn}${path}`;
  }  
  return path;
}

export function cdnOrAbsolute(path) {
  return project.cdn ? cdn(path) : absolute(path);
}