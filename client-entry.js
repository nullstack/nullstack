import ReactDOM from "react-dom";
import React, { Component } from "react";
import {getPageWithParamsFromPath} from './router';
import Radium from 'radium';

let routes = [];
let element;
let initialStateHydrated = false;
let lastPage;

const settings = {};

export function config(key, value) {
  if(value) {
    settings[key] = value;
  } else {
    return settings[key];
  }
}

export function getSettings() {
  let defaults = {};
  Object.keys(settings).forEach((key) => {
    if(key.startsWith('default')) {
      defaults[key.split('.')[1]] = settings[key];
    }
  });
  return defaults;
}

export function route(path, page) {
  routes.push({path: path, page: page});
}

function renderCurrentPage() {
  const parse = (string) => {
    return JSON.parse(JSON.parse(string));
  }
  let {page, params} = getPageWithParamsFromPath(routes, location.pathname + location.search);
  const wrapper = document.getElementById("application");
  const initialState = wrapper.getAttribute('data-state');
  const initialSettings = wrapper.getAttribute('data-settings');
  params.ref = (e) => {element = e;};
  class Page extends page {
      constructor(props) {
        super(props);
        console.log(this.schema, 'schema');
        this.resetState();
      }
  }
  const current = React.createElement(Radium(Page), params);
  ReactDOM.render(current, wrapper, function() {
    //element.resetState();
    if(initialState && !initialStateHydrated) {
      element.setState(parse(initialState));
      element.set(parse(initialSettings));
    } else if(element.historyDidUpdate) {
      element.historyDidUpdate();
    }
    initialStateHydrated = true;
  });
}

export function redirect(target) {
  history.pushState({}, document.title, target);
  renderCurrentPage();
}

export function ready() {
  renderCurrentPage();
  window.addEventListener('popstate', function(event) {
    renderCurrentPage();
  });
  window.addEventListener('click', function(event) {
    const target = event.target.getAttribute('href');
    if(target && target.startsWith('/')) {
      event.preventDefault();
      redirect(target);
    }
  });
}
