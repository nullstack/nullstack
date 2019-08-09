import React from 'react';
import {getSettings} from './server-entry';
import {bindState, validateState, resetState, whitelistState, bindProp, queryString} from './validate-state.js';
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
  schema = {};

  authorize() {

  }

  constructor(props) {
    super(props);
    this.errorMessages = errorMessages[this.settings.locale];
    this.queryString = queryString.bind(this);
    this.bindProp = bindProp.bind(this);
    this.bindState = bindState.bind(this);
    this.validateState = validateState.bind(this);
    this.resetState = resetState.bind(this);
    this.whitelistState = whitelistState.bind(this);
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

  async uploadImage(recordKey, propertyKey, file) {
    const sizes = {};
    const collection = `${recordKey}-${propertyKey}`;
    for(const size of Object.keys(this.schema[recordKey][propertyKey].sizes)) {
      const settings = this.schema[recordKey][propertyKey].sizes[size];
      sizes[size] = `${this.settings.protocol}://${this.settings.domain}` + await this.storage.collection(collection).insertOne({...file, ...settings});
    };
    return {...sizes, label: file.originalname};
  }

  async uploadFile(recordKey, propertyKey, file) {
    const collection = `${recordKey}-${propertyKey}`;
    const link = `${this.settings.protocol}://${this.settings.domain}` + await this.storage.collection(collection).insertOne(file);
    return {link, label: file.originalname};
  }

}
