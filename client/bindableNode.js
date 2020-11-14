import findParentInstance from './findParentInstance';
import {isBindable} from '../shared/nodes';
import client from './client';

export default function bindableNode(node, depth) {
  if(isBindable(node)) {
    const instance = findParentInstance(depth);
    const target = node.attributes.source || instance;
    if(node.type === 'textarea') {
      node.children = [target[node.attributes.bind]];
    } else if(node.type === 'input' && node.attributes.type === 'checkbox') {
      node.attributes.checked = target[node.attributes.bind];
    } else {
      node.attributes.value = target[node.attributes.bind];
    }
    node.attributes.name = node.attributes.bind;
    let eventName = 'oninput';
    let valueName = 'value';
    if(node.attributes.type === 'checkbox' || node.attributes.type === 'radio') {
      eventName = 'onclick';
      valueName = 'checked';
    } else if(node.type !== 'input' && node.type !== 'textarea') {
      eventName = 'onchange';
    }
    const originalEvent = node.attributes[eventName];
    node.attributes[eventName] = ({event, value}) => {
      if(valueName == 'checked') {
        target[node.attributes.bind] = event.target[valueName];
      } else if(target[node.attributes.bind] === true || target[node.attributes.bind] === false) {
        target[node.attributes.bind] = event ? (event.target[valueName] == 'true') : value;
      } else if(typeof target[node.attributes.bind] === 'number') {
        target[node.attributes.bind] = parseFloat(event ? event.target[valueName] : value) || 0;
      } else {
        target[node.attributes.bind] = event ? event.target[valueName] : value;
      }
      client.update();
      if(originalEvent !== undefined) {
        setTimeout(() => {
          originalEvent({...node.attributes, event, value});
        }, 0);
      }
    }
  }
}