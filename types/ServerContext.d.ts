import { NullstackEnvironment } from "./Environment";
import { NullstackProject } from "./Project";
import { NullstackSecrets } from './Secrets';
import { NullstackServer } from './Server';
import { NullstackSettings } from "./Settings";
import { NullstackWorker } from "./Worker";

/**
 * https://nullstack.app/context
 */
export type NullstackServerContext = {

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
   * It gives you information about the current environment.
   * 
   * https://nullstack.app/context-environment
   */
  environment?: NullstackEnvironment,

  /**
   * The server key is a proxy around the [Express](https://expressjs.com/) instance that runs Nullstack under the hood.
   * 
   * Only on server.
   * 
   * https://nullstack.app/server-request-and-response
   */
  server?: NullstackServer,

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
   * You can assign any key with any type of public information.
   * 
   * .env `NULLSTACK_SETTINGS_PUBLIC_KEY` -> `settings.publicKey`
   * 
   * https://nullstack.app/context-settings
   */
  settings?: NullstackSettings,

  /**
   * You can assign any key with any type of private information.
   * 
   * .env `NULLSTACK_SECRETS_PRIVATE_KEY` -> `secrets.privateKey`
   * 
   * https://nullstack.app/context-secrets
   */
  secrets?: NullstackSecrets,

  [key: string]: any

};
