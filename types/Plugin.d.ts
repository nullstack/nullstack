import { NullstackClientContext } from "./ClientContext";
import { AllHTMLAttributes, NullstackAttributes } from "./JSX";

type NullstackPluginNode = {
  type: string | boolean;
  attributes: AllHTMLAttributes<HTMLElement> & NullstackAttributes;
  children: NullstackClientContext['children'];
};

interface NullstackNodeContext extends NullstackClientContext {
  node: NullstackPluginNode;
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
