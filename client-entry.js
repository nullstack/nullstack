import ReactDOM from "react-dom";
import React, { Component } from "react";
import {getPageWithParamsFromPath} from './router';
import Radium from 'radium';

let routes = [];
let element;
let initialStateHydrated = false;
let lastPage;

export function config() {

}

export function route(path, page) {
  routes.push({path: path, page: page});
}

function renderCurrentPage() {
  let {page, params} = getPageWithParamsFromPath(routes, location.pathname + location.search);
  /*if(!lastPage || lastPage.name != page.name) {
    lastPage = page;*/
    const wrapper = document.getElementById("application");
    const initialState = wrapper.getAttribute('data-state');
    const initialSettings = wrapper.getAttribute('data-settings');
    params.ref = (e) => {element = e;};
    const current = React.createElement(Radium(page), params);
    ReactDOM.render(current, wrapper, function() {
      if(initialState && !initialStateHydrated) {
        console.log(element);
        element.setState(JSON.parse(initialState));
        element.set(JSON.parse(initialSettings));
        //wrapper.removeAttribute('data-state');
        //wrapper.removeAttribute('data-settings');
      } else if(element.historyDidUpdate) {
        console.log(element);
        element.historyDidUpdate();
      }
      initialStateHydrated = true;
    });
  /*} else {
    element.props = params;
    if(element.historyDidUpdate) {
      element.historyDidUpdate();
    }
    console.log(element.state);
    element.forceUpdate();
    console.log(element.props);
    element.setState({_lastReloadAt: new Date()});
  }*/
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
