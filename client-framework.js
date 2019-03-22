import { Component } from "react";
import {redirect} from './client-entry';
import {getSettings} from './client-entry';
import {bindState, validateState, resetState, whitelistState, bindProp, queryString} from './validate-state.js';
import errorMessages from './error-messages';
export {route, ready, redirect, config} from './client-entry';

export function server(target, key, descriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args) {
    this.setState(function (state, props) {
      const loadingState = {...state};
      loadingState.loading = {...loadingState.loading, [key]: true}
      return loadingState;
    });
    const body = new FormData();
    body.append('method', key);
    body.append('state', JSON.stringify(this.state));
    body.append('settings', JSON.stringify(this.settings));
    args.forEach((arg, index) => {
      if(arg instanceof File) {
        body.append(`param${index}`, arg);
      } else {
        body.append(`param${index}`, JSON.stringify(arg));
      }
    })
    body.append('params', args.length);
    return new Promise((resolve, reject) => {
      fetch(location.href, {
        method: 'post',
        body: body
      }).then(r=>r.json()).then((response) => {
        this.schema = response.schema;
        this.setState(response.state);
        this.setState(function (state, props) {
          const loadingState = {...state};
          loadingState.loading = {...loadingState.loading}
          delete loadingState.loading[key];
          return loadingState;
        });
        this.set(response.settings);
        resolve(response.returned);
        if(response.redirect) {
          this.redirect(response.redirect);
        }
      });
    });
  };
  return descriptor;
}

export class Page extends Component {

  settings = getSettings();
  state = {};
  schema = {};

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

  setSession(updates) {
    console.error('you cannot set sessions in the client!');
  }

  redirect(target) {
    redirect(target);
  }

  set(updates) {
    this.settings = Object.assign(this.settings, updates);
    document.title = `${this.settings.title}`;
  }

  @server
  async uploadImage(recordKey, propertyKey, file) {

  }

}

export function ObjectID() {
  console.error('you cannot generate an object id in the client!');
}
