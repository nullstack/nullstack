import { NullstackClientContext } from "./ClientContext";
import { NullstackPlugin } from "./Plugin";
import { NullstackServerContext } from "./ServerContext";

export interface NullstackContext
  extends NullstackClientContext,
    NullstackServerContext {}

export * from "./ClientContext";
export * from "./Environment";
export * from "./Page";
export * from "./Params";
export * from "./Plugin";
export * from "./Project";
export * from "./Router";
export * from "./Secrets";
export * from "./Self";
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

  render?(context: NullstackContext & TProps): void;
}
