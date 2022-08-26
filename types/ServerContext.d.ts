import { NullstackEnvironment } from './Environment';
import { NullstackProject } from './Project';
import { NullstackSecrets } from './Secrets';
import { NullstackServer } from './Server';
import { NullstackSettings } from './Settings';
import { NullstackWorker } from './Worker';

/**
 * @see https://nullstack.app/context
 */
export type NullstackServerContext = {
  /**
   * Information about the app manifest and some metatags.
   *
   * @see https://nullstack.app/context-project
   */
  project?: NullstackProject;

  /**
   * Gives you granular control of your PWA behavior.
   *
   * @see https://nullstack.app/service-worker
   */
  worker?: NullstackWorker;

  /**
   * It gives you information about the current environment.
   *
   * @see https://nullstack.app/context-environment
   */
  environment?: NullstackEnvironment;

  /**
   * The server key is a proxy around the [Express](https://expressjs.com/) instance that runs Nullstack under the hood.
   *
   * @scope server
   * @see https://nullstack.app/server-request-and-response
   */
  server?: NullstackServer;

  /**
   * Original `request` object from [Express](https://expressjs.com/)
   *
   * @scope server
   * @see https://nullstack.app/server-request-and-response
   */
  request?: Record<string, any>;

  /**
   * Original `response` object from [Express](https://expressjs.com/)
   *
   * @scope server
   * @see https://nullstack.app/server-request-and-response
   */
  response?: Record<string, any>;

  /**
   * You can assign any key with any type of public information.
   *
   * @example
   * ```
   * // .env NULLSTACK_SETTINGS_PUBLIC_KEY
   * settings.publicKey
   * ```
   * @see https://nullstack.app/context-settings
   */
  settings?: NullstackSettings;

  /**
   * You can assign any key with any type of private information.
   *
   * @example
   * ```
   * // .env NULLSTACK_SECRETS_PRIVATE_KEY
   * secrets.privateKey
   * ```
   * @see https://nullstack.app/context-secrets
   */
  secrets?: NullstackSecrets;

  [key: string]: any;
};
