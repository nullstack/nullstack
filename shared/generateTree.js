import generateKey from '../shared/generateKey';
import { isClass, isFalse, isFunction, isUndefined } from '../shared/nodes';
import fragment from './fragment';
import { transformBody, transformNodes } from './plugins';

async function generateBranch(siblings, node, depth, scope) {

  transformNodes(scope, node, depth);

  if (isUndefined(node)) {
    let message = 'Attempting to render an undefined node. \n'
    if (node === undefined) {
      message += 'This error usually happens because of a missing return statement around JSX or returning undefined from a renderable function.';
    } else {
      message += 'This error usually happens because of a missing import statement or a typo on a component tag';
    }
    throw new Error(message)
  }

  if (isFalse(node)) {
    siblings.push({
      type: false,
      attributes: {}
    });
    return;
  }

  if (isClass(node)) {
    const key = generateKey(scope, node, depth)
    if (
      scope.context.environment.client &&
      scope.context.router._changed &&
      node.attributes &&
      node.attributes.route &&
      scope.context.environment.mode !== 'ssg'
    ) {
      const routeDepth = depth.slice(0, depth.lastIndexOf('-'))
      const newSegments = scope.context.router._newSegments[routeDepth];
      if (newSegments) {
        const oldSegments = scope.context.router._oldSegments[routeDepth];
        for (const segment in newSegments) {
          if (oldSegments[segment] !== newSegments[segment]) {
            delete scope.memory[key];
          }
        }
      }
    }
    const instance = scope.instances[key] || new node.type(scope);
    instance._self.persistent = !!node.attributes.persistent
    instance._self.key = key;
    instance._attributes = node.attributes;
    instance._scope = scope;
    let memory;
    if (scope.memory) {
      memory = scope.memory[key];
      if (memory) {
        instance._self.prerendered = true;
        instance._self.initiated = true;
        Object.assign(instance, memory);
        delete scope.memory[key];
      }
    }
    let shouldHydrate = false;
    const shouldLaunch = instance._self.initiated && (
      !instance._self.prerendered ||
      (instance._self.persistent && instance._self.terminated)
    )
    if (instance._self.terminated) {
      shouldHydrate = true;
      instance._self.terminated = false;
    }
    const shouldPrepare = scope.instances[key] === undefined;
    scope.instances[key] = instance;
    if (shouldPrepare) {
      if (memory === undefined) {
        instance.prepare && instance.prepare();
        if (scope.context.environment.server) {
          instance.initiate && await instance.initiate();
          instance._self.initiated = true;
          instance.launch && instance.launch();
        } else {
          scope.initiationQueue.push(instance);
        }
      }
      shouldHydrate = true;
    }
    if (scope.hydrationQueue) {
      if (shouldHydrate) {
        shouldLaunch && instance.launch && instance.launch();
        scope.hydrationQueue.push(instance);
      } else if (instance._self.initiated === true) {
        instance.update && instance.update();
      }
    }
    if (scope.context.environment.client) {
      scope.renewalQueue.push(instance);
    }
    const children = instance.render();
    if (children && children.type) {
      children.instance = instance;
    }
    node.children = [].concat(children);
    for (let i = 0; i < node.children.length; i++) {
      await generateBranch(siblings, node.children[i], depth + '-' + i, scope);
    }
    return;
  }

  if (node.type === 'body') {
    node.type = fragment
    for (const attribute in node.attributes) {
      if (attribute === 'children' || attribute.startsWith('_')) continue;
      if (attribute === 'class' || attribute === 'style') {
        if (!scope.nextBody[attribute]) {
          scope.nextBody[attribute] = []
        }
        scope.nextBody[attribute].push(node.attributes[attribute])
      } else if (attribute.startsWith('on')) {
        if (scope.context.environment.server) continue
        if (!scope.nextBody[attribute]) {
          scope.nextBody[attribute] = []
        }
        if (Array.isArray(node.attributes[attribute])) {
          scope.nextBody[attribute].push(...node.attributes[attribute])
        } else {
          scope.nextBody[attribute].push(node.attributes[attribute])
        }
      } else {
        scope.nextBody[attribute] = node.attributes[attribute]
      }
    }
  }

  if (isFunction(node)) {
    const context = node.type.name ? scope.generateContext(node.attributes) : node.attributes;
    const children = node.type(context);
    node.children = [].concat(children);
    for (let i = 0; i < node.children.length; i++) {
      await generateBranch(siblings, node.children[i], depth + '-' + i, scope);
    }
    return;
  }

  if (node.type) {
    if (node.type === 'head') {
      siblings.push({
        type: false,
        attributes: {}
      });
      for (let i = 0; i < node.children.length; i++) {
        const id = depth + '-' + i
        await generateBranch(scope.nextHead, node.children[i], id, scope);
        scope.nextHead[scope.nextHead.length - 1].attributes.id ??= id
      }
    } else if (node.children) {
      const branch = {
        type: node.type,
        attributes: node.attributes,
        children: [],
        instance: node.instance
      }
      for (let i = 0; i < node.children.length; i++) {
        await generateBranch(branch.children, node.children[i], depth + '-' + i, scope);
      }
      siblings.push(branch);
    }
    return;
  }

  siblings.push({
    type: 'text',
    text: node,
    instance: node.instance,
  });

}

export default async function generateTree(node, scope) {
  const tree = { type: 'div', attributes: { id: 'application' }, children: [] };
  await generateBranch(tree.children, node, '0', scope);
  transformBody(scope.nextBody)
  return tree;
}