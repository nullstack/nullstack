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

export interface INullstack {
  /**
   * @see https://nullstack.app/full-stack-lifecycle#prepare
   */
  prepare?(context?: Record<string, any>): void;

  /**
   * @see https://nullstack.app/full-stack-lifecycle#initiate
   */
  initiate?(context?: Record<string, any>): void;

  /**
   * @see https://nullstack.app/full-stack-lifecycle#launch
   */
  launch?(context?: Record<string, any>): void;

  /**
   * @see https://nullstack.app/full-stack-lifecycle#hydrate
   */
  hydrate?(context?: Record<string, any>): void;

  /**
   * @see https://nullstack.app/full-stack-lifecycle#update
   */
  update?(context?: Record<string, any>): void;

  /**
   * @see https://nullstack.app/full-stack-lifecycle#terminate
   */
  terminate?(context?: Record<string, any>): void;
}

export default class Nullstack<Props = {}> implements INullstack {
  constructor(props?: Props);
  /**
   * @param App A Nullstack app root component
   */
  static start?(App: any): NullstackContext;
  /**
   * Use a plugin
   */
  static use?(Plugin: NullstackPlugin): void;
  prepare?(context: NullstackContext & Props): void;
  initiate?(context: NullstackContext & Props): void;
  launch?(context: NullstackContext & Props): void;
  hydrate?(context: NullstackClientContext & Props): void;
  update?(context: NullstackContext & Props): void;
  terminate?(context: NullstackContext & Props): void;
  render?(context: NullstackContext & Props): void;
}
