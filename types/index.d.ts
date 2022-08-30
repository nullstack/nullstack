import { NullstackClientContext } from './ClientContext';
import { NullstackNode } from './JSX';
import { NullstackPlugin } from './Plugin';
import { NullstackServerContext } from './ServerContext';

export * from './ClientContext';
export * from './Environment';
export * from './Page';
export * from './Params';
export * from './Plugin';
export * from './Project';
export * from './Router';
export * from './Secrets';
export * from './Server';
export * from './ServerContext';
export * from './Settings';
export * from './Worker';
export * from './JSX';

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
  constructor(props?: TProps);

  /**
   * @param App A Nullstack app root component
   */
  static start(App: typeof this): NullstackClientContext | NullstackServerContext;

  /**
   * Use a plugin
   */
  static use(Plugin: NullstackPlugin): void;

  /**
   * Could run on the server or client.
   * @see https://nullstack.app/full-stack-lifecycle#prepare
   */
  prepare?(context: NullstackClientContext<TProps>);

  /**
   * Could run on the server or client.
   * @see https://nullstack.app/full-stack-lifecycle#initiate
   */
  initiate?(context: NullstackClientContext<TProps>);

  initiated: boolean;

  /**
   * Could run on the server or client.
   * @see https://nullstack.app/full-stack-lifecycle#launch
   */
  launch?(context: NullstackClientContext<TProps>);

  /**
   * Runs on the client.
   * @see https://nullstack.app/full-stack-lifecycle#hydrate
   */
  hydrate?(context: NullstackClientContext<TProps>);

  hydrated: boolean;

  /**
   * Runs on the client.
   * @see https://nullstack.app/full-stack-lifecycle#update
   */
  update?(context: NullstackClientContext<TProps>);

  /**
   * Runs on the client.
   * @see https://nullstack.app/full-stack-lifecycle#terminate
   */
  terminate?(context: NullstackClientContext<TProps>);

  terminated: boolean;

  render?(context: NullstackClientContext<TProps>): NullstackNode;

  prerendered: boolean;

  /**
   * If the component is persistent
   *
   * @see https://nullstack.app/persistent-components
   */
  persistent: boolean;

  key: string;
}
