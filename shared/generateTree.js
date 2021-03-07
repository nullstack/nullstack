import generateKey from '../shared/generateKey';
import {isClass, isFunction} from '../shared/nodes';

async function generateBranch(parent, node, depth, scope) {

  for(const plugin of scope.plugins) {
    if(plugin.match({node, depth, scope})) {
      plugin.transform({node, depth, scope});
    }
  }

  if(isClass(node)) {
    const key = node.attributes.key || generateKey(depth);
    if(
      scope.context.environment.client && 
      scope.context.router._changed &&
      node.attributes && 
      node.attributes.route && 
      !scope.context.environment.static
    ) {
      const routeDepth = depth.slice(0, -1).join('.');
      const newSegments = scope.newSegments[routeDepth];
      if(newSegments) {
        const oldSegments = scope.oldSegments[routeDepth];
        for(const segment in newSegments) {
          if(oldSegments[segment] !== newSegments[segment]) {
            delete scope.memory[key];
            delete scope.instances[key];
          }
        }
      }
    }  
    const instance = scope.instances[key] || new node.type(scope);
    instance._self.key = key;
    instance._attributes = node.attributes;
    instance._scope = scope;
    let memory;
    if(scope.memory) {
      memory = scope.memory[key];
      if(memory) {
        instance._self.initiated = true;
        Object.assign(instance, memory);
        delete scope.memory[key];
      }
    }
    let shouldHydrate = false;
    if(scope.instances[key] === undefined) {
      if(memory === undefined) {
        instance.prepare && instance.prepare();
        if(scope.context.environment.server) {
          instance.initiate && await instance.initiate();
          instance._self.initiated = true;
        } else {
          scope.initiationQueue.push(instance);
        }
      }
      shouldHydrate = true;
    }
    if (scope.hydrationQueue) {
      if(shouldHydrate) {
        scope.hydrationQueue.push(instance);
      } else if(instance._self.initiated == true) {
        instance.update && instance.update();
      }
    }
    scope.instances[key] = instance;
    if(scope.context.environment.client) {
      scope.renewalQueue.push(instance);
    }
    const children = instance.render();
    if(children && children.type) {
      children.instance = instance;
    }
    node.children = [].concat(children);
    for(let i=0; i<node.children.length; i++) {
      await generateBranch(parent, node.children[i], [...depth, i], scope);
    }
    return;
  }

  if(isFunction(node)) {
    const context = node.type.name ? {...scope.context, ...node.attributes} : node.attributes;
    const children = node.type(context);
    node.children = [].concat(children);
    for(let i=0; i<node.children.length; i++) {
      await generateBranch(parent, node.children[i], [...depth, i], scope);
    }
    return;
  }

  if(node.type) {
    const branch = {
      type: node.type,
      attributes: node.attributes || {},
      instance: node.instance,
      children: []
    }
    if(node.children) {
      for(let i=0; i<node.children.length; i++) {
        await generateBranch(branch, node.children[i], [...depth, i], scope);
      }
    }
    parent.children.push(branch);
    return;
  }

  parent.children.push(node);

}

export default async function generateTree(node, scope) {
  const tree = {type: 'div', attributes: {id: 'application'}, children: []};
  await generateBranch(tree, node, [0], scope);
  return tree;
}