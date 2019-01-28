import React from 'react';
import {getSettings} from './server-entry';
export {route, ready, config} from './server-entry';

export function server(ctx, fn) {
  return function(...args) {
    return fn.apply(ctx, args);
  }
}

export class Page extends React.Component {

  settings = getSettings();
  state = {};

  setState(updates) {
    this.state = Object.assign(this.state, updates);
  }

  setSession(updates) {
    this.session = Object.assign(this.session, updates);
  }

  set(updates) {
    this.settings = Object.assign(this.settings, updates);
  }

  redirect(target) {
    this._redirect = target;
  }

}
