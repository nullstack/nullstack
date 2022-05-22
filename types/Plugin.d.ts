import { NullstackClientContext } from "./ClientContext";
import type { NullstackNode } from "./JSX";

interface NullstackNodeContext extends NullstackClientContext {
  node: NullstackNode;
}

export type NullstackPlugin = {
  /**
   * Runs transformation to node element
   * @param context Context with node attributes
   */
  transform(context: NullstackNodeContext);

  /**
   * Load something when plugin installs
   * @param context Application context
   */
  load?(context: NullstackClientContext);

  /**
   * Use plugin in the server environment
   */
  server?: boolean;

  /**
   * Use plugin in the client environment
   */
  client?: boolean;
};
