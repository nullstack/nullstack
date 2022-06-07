import { NullstackClientContext } from "./ClientContext";
import { NullstackPlugin } from "./Plugin";
import { NullstackServerContext } from "./ServerContext";

export interface NullstackContext
  extends NullstackClientContext,
  NullstackServerContext { }

export * from "./ClientContext";
export * from "./Environment";
export * from "./Page";
export * from "./Params";
export * from "./Plugin";
export * from "./Project";
export * from "./Router";
export * from "./Secrets";
export * from "./Server";
export * from "./ServerContext";
export * from "./Settings";
export * from "./Worker";
export * from "./JSX";

export default class Nullstack<TProps = {}> {
  constructor(props?: TProps);

  /**
   * @param App A Nullstack app root component
   */
  static start?(App: any): NullstackContext;

  /**
   * Use a plugin
   */
  static use?(Plugin: NullstackPlugin): void;

  /**
   * Could run on the server or client.
   * @see https://nullstack.app/full-stack-lifecycle#prepare
   */
  prepare?(context: NullstackContext & TProps): void;

  /**
   * Could run on the server or client.
   * @see https://nullstack.app/full-stack-lifecycle#initiate
   */
  initiate?(context: NullstackContext & TProps): void;

  initiated: boolean;

  /**
   * Could run on the server or client.
   * @see https://nullstack.app/full-stack-lifecycle#launch
   */
  launch?(context: NullstackContext & TProps): void;

  /**
   * Runs on the client.
   * @see https://nullstack.app/full-stack-lifecycle#hydrate
   */
  hydrate?(context: NullstackClientContext & TProps): void;

  hydrated: boolean;

  /**
   * Runs on the client.
   * @see https://nullstack.app/full-stack-lifecycle#update
   */
  update?(context: NullstackContext & TProps): void;

  /**
   * Runs on the client.
   * @see https://nullstack.app/full-stack-lifecycle#terminate
   */
  terminate?(context: NullstackContext & TProps): void;

  terminated: boolean;

  render?(context: NullstackContext & TProps): void;

  prerendered: boolean;

  /**
   * If the component is persistent
   *
   * @see https://nullstack.app/persistent-components
   */
  persistent: boolean;

  key: string;
}
