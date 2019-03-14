import React from 'react';
import {getSettings} from './server-entry';
import {bindState, validateState, resetState} from './validate-state.js';
import errorMessages from './error-messages';
export {route, ready, config} from './server-entry';
export {ObjectID} from 'mongodb';

export function server(ctx, fn) {
  return function(...args) {
    return fn.apply(ctx, args);
  }
}

export class Page extends React.Component {

  settings = getSettings();
  state = {};

  constructor(props) {
    super(props);
    this.errorMessages = errorMessages[this.settings.locale];
    this.bindState = bindState.bind(this);
    this.validateState = validateState.bind(this);
    this.resetState = resetState.bind(this);
  }

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
