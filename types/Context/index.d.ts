/// <reference path="./Page.d.ts"/>
/// <reference path="./Project.d.ts"/>
/// <reference path="./Worker.d.ts"/>
/// <reference path="./Self.d.ts"/>
/// <reference path="./Environment.d.ts"/>
/// <reference path="./Server.d.ts"/>
/// <reference path="./UserDefined.d.ts"/>
/// <reference path="./Router.d.ts"/>

/**
 * https://nullstack.app/context
 */
type Context = {
  /**
   * Information about the document `head` metatags.
   *  
   * https://nullstack.app/context-page
   */
  page?: Page,

  /**
   * Information about the app manifest and some metatags.
   *
   * https://nullstack.app/context-project
   */
  project?: Project,

  /**
   * Gives you granular control of your PWA behavior.
   * 
   * https://nullstack.app/service-worker
   */
  worker?: CtxWorker,

  /**
   * It gives you information about the instance lifecycle and it's unique [key](https://nullstack.app/instance-self#instance-key).
   * 
   * https://nullstack.app/instance-self
   */
  self?: Self,

  /**
   * It gives you information about the element dataset.
   * 
   * Any `data-*` attributes will receive a respective camelized key on this object.
   * 
   * Only on client.
   * 
   * https://nullstack.app/context-data
   */
  data?: object,

  /**
   * It gives you all active instances of the application.
   * 
   * Adding a [key](https://nullstack.app/instance-self#instance-key) to a Component adds it here.
   * 
   * Only on client.
   * 
   * https://nullstack.app/context-instances
   */
  instances?: object,

  /**
   * It gives you information about the current environment.
   * 
   * https://nullstack.app/context-environment
   */
  environment?: Environment,

  /**
   * The server key is a proxy around the [Express](https://expressjs.com/) instance that runs Nullstack under the hood.
   * 
   * Only on server.
   * 
   * https://nullstack.app/server-request-and-response
   */
  server?: Server,
  /**
   * Original `request` object from [Express](https://expressjs.com/)
   * 
   * Only on server.
   * 
   * https://nullstack.app/server-request-and-response
   */
  request?: object,
  /**
   * Original `response` object from [Express](https://expressjs.com/)
   * 
   * Only on server.
   * 
   * https://nullstack.app/server-request-and-response
   */
  response?: object,

  /**
   * Each query string param is mapped to this object.
   * 
   * https://nullstack.app/routes-and-params#params
   * @example
   * "/?expanded=true&page=2" === {expanded: true, page: 2}
   */
  params?: Params,

  /**
   * Nullstack router.
   * 
   * https://nullstack.app/routes-and-params#router
   */
  router?: Router,

  /**
   * You can assign any key with any type of public information.
   * 
   * .env `NULLSTACK_SETTINGS_PUBLIC_KEY` -> `settings.publicKey`
   * 
   * https://nullstack.app/context-settings
   */
  settings?: Settings,

  /**
   * You can assign any key with any type of private information.
   * 
   * .env `NULLSTACK_SECRETS_PRIVATE_KEY` -> `secrets.privateKey`
   * 
   * https://nullstack.app/context-secrets
   */
  secrets?: Secrets,

  /**
   * Children elements of this component.
   * 
   * https://nullstack.app/renderable-components#components-with-children
   */
  children?: any,
  [key: string]: any
};
