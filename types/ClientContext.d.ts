import { NullstackEnvironment } from "./Environment";
import { NullstackPage } from "./Page";
import { NullstackParams } from "./Params";
import { NullstackProject } from "./Project";
import { NullstackRouter } from "./Router";
import { NullstackSelf } from "./Self";
import { NullstackSettings } from "./Settings";
import { NullstackWorker } from "./Worker";

/**
 * https://nullstack.app/context
 */
export type NullstackClientContext = {

  /**
   * Information about the document `head` metatags.
   *  
   * https://nullstack.app/context-page
   */
  page?: NullstackPage,

  /**
   * Information about the app manifest and some metatags.
   *
   * https://nullstack.app/context-project
   */
  project?: NullstackProject,

  /**
   * Gives you granular control of your PWA behavior.
   * 
   * https://nullstack.app/service-worker
   */
  worker?: NullstackWorker,

  /**
   * It gives you information about the instance lifecycle and it's unique [key](https://nullstack.app/instance-self#instance-key).
   * 
   * https://nullstack.app/instance-self
   */
  self?: NullstackSelf,

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
  environment?: NullstackEnvironment,

  /**
   * Each query string param is mapped to this object.
   * 
   * https://nullstack.app/routes-and-params#params
   * @example
   * "/?expanded=true&page=2" === {expanded: true, page: 2}
   */
  params?: NullstackParams,

  /**
   * Nullstack router.
   * 
   * https://nullstack.app/routes-and-params#router
   */
  router?: NullstackRouter,

  /**
   * You can assign any key with any type of public information.
   * 
   * .env `NULLSTACK_SETTINGS_PUBLIC_KEY` -> `settings.publicKey`
   * 
   * https://nullstack.app/context-settings
   */
  settings?: NullstackSettings,

  /**
   * Children elements of this component.
   * 
   * https://nullstack.app/renderable-components#components-with-children
   */
  children?: any,

  [key: string]: any

};
