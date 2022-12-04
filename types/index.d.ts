import { NullstackClientContext } from './ClientContext.d.ts'
import { NullstackNode } from './JSX.d.ts'
import { NullstackPlugin } from './Plugin.d.ts'
import { NullstackServerContext } from './ServerContext.d.ts'

export * from './ClientContext.d.ts'
export * from './Environment.d.ts'
export * from './Page.d.ts'
export * from './Params.d.ts'
export * from './Plugin.d.ts'
export * from './Project.d.ts'
export * from './Router.d.ts'
export * from './Secrets.d.ts'
export * from './Server.d.ts'
export * from './ServerContext.d.ts'
export * from './Settings.d.ts'
export * from './Worker.d.ts'
export * from './JSX.d.ts'

/**
 * Functional component
 *
 * @example
 *
 * ```
 * import { NullstackClientContext, NullstackFunctionalComponent } from 'nullstack';
 *
 * interface InputProps {
 *   label: string;
 * }
 *
 * function Input({ label, page }: NullstackClientContext<InputProps>) {
 *   console.log(page.title);
 *   return <p>{label}</p>;
 * }
 *
 * export default Input as NullstackFunctionalComponent<InputProps>;
 * ```
 */
export type NullstackFunctionalComponent<TProps> = (props: TProps) => NullstackNode;

export default class Nullstack<TProps = unknown> {

  constructor(props?: TProps)

  /**
   * @param App A Nullstack app root component
   */
  static start(App: typeof this): NullstackClientContext | NullstackServerContext

  /**
   * Use a plugin
   */
  static use(Plugin: NullstackPlugin): void

  /**
   * Could run on the server or client.
   * @see https://nullstack.app/full-stack-lifecycle#prepare
   */
  prepare?(context: NullstackClientContext<TProps>)

  /**
   * Could run on the server or client.
   * @see https://nullstack.app/full-stack-lifecycle#initiate
   */
  initiate?(context: NullstackClientContext<TProps>)

  initiated: boolean

  /**
   * Could run on the server or client.
   * @see https://nullstack.app/full-stack-lifecycle#launch
   */
  launch?(context: NullstackClientContext<TProps>)

  /**
   * Runs on the client.
   * @see https://nullstack.app/full-stack-lifecycle#hydrate
   */
  hydrate?(context: NullstackClientContext<TProps>)

  hydrated: boolean

  /**
   * Runs on the client.
   * @see https://nullstack.app/full-stack-lifecycle#update
   */
  update?(context: NullstackClientContext<TProps>)

  /**
   * Runs on the client.
   * @see https://nullstack.app/full-stack-lifecycle#terminate
   */
  terminate?(context: NullstackClientContext<TProps>)

  terminated: boolean

  render?(context: NullstackClientContext<TProps>): NullstackNode

  prerendered: boolean

  /**
   * If the component is persistent
   *
   * @see https://nullstack.app/persistent-components
   */
  persistent: boolean

  key: string

}
