import { Component } from "react";
import {redirect} from './client-entry';
export {route, ready, redirect, config} from './client-entry';

export function server(target, key, descriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args) {
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
        this.setState(response.state);
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

  settings = {};
  state = {};

  constructor(props) {
    super(props);
  }

  setSession(updates) {
    console.error('you cannot set sessions in the client!');
  }

  redirect(target) {
    redirect(target);
  }

  set(updates) {
    this.settings = Object.assign(this.settings, updates);
    document.title = `${this.settings.project} - ${this.settings.title}`;
  }

}
