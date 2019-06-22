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
  let {page, params} = getPageWithParamsFromPath(routes, location.pathname + location.search);
  const wrapper = document.getElementById("application");
  params.ref = (e) => {element = e;};
  class Page extends page {
    constructor(props) {
      super(props);
      this.resetState();
    }
  }
  const current = React.createElement(Radium(Page), params);
  ReactDOM.render(current, wrapper, function() {
    if(window.initialState && !initialStateHydrated) {
      element.setState(window.initialState);
      element.set(window.initialSettings);
    } else if(element.historyDidUpdate) {
      element.historyDidUpdate();
    }
    if(element.ready) {
      element.ready();
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
      event.returnValue = false;
      redirect(target);
    }
  });
  window.addEventListener('submit', function(event) {
    if(event.target.tagName.toLowerCase() == 'form') {
      event.preventDefault();
      event.returnValue = false;
    }
  });
}
