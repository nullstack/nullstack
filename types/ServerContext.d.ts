/* eslint-disable @typescript-eslint/no-explicit-any */
import { NullstackEnvironment } from './Environment.d.ts'
import { NullstackProject } from './Project.d.ts'
import { NullstackSecrets } from './Secrets.d.ts'
import { NullstackServer } from './Server.d.ts'
import { NullstackSettings } from './Settings.d.ts'
import { NullstackWorker } from './Worker.d.ts'

/**
 * @see https://nullstack.app/context
 */
export type NullstackServerContext<TProps = unknown> = TProps & {
  /**
   * Callback function that bootstrap the context for the application.
   */
  start?: () => Promise<void>

  /**
   * Information about the app manifest and some metatags.
   *
   * @see https://nullstack.app/context-project
   */
  project: NullstackProject

  /**
   * Gives you granular control of your PWA behavior.
   *
   * @see https://nullstack.app/service-worker
   */
  worker: NullstackWorker

  /**
   * It gives you information about the current environment.
   *
   * @see https://nullstack.app/context-environment
   */
  environment: NullstackEnvironment

  /**
   * The server key is a proxy around the [Express](https://expressjs.com/) instance that runs Nullstack under the hood.
   *
   * @scope server
   * @see https://nullstack.app/server-request-and-response
   */
  server: NullstackServer

  /**
   * Original `request` object from [Express](https://expressjs.com/)
   *
   * @scope server
   * @see https://nullstack.app/server-request-and-response
   */
  request?: Record<string, any>

  /**
   * Original `response` object from [Express](https://expressjs.com/)
   *
   * @scope server
   * @see https://nullstack.app/server-request-and-response
   */
  response?: Record<string, any>

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
  settings: NullstackSettings

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
  secrets: NullstackSecrets
}
