type ElementNode = {
  type: string | boolean,
  attributes: {
    route: string,
    html: string,
    [key: string]: any
  },
  children: any[]
};

interface ContextNode extends Context {
  node: ElementNode
}

type ElementPlugin = {
  /**
   * Runs transformation to node element
   * @param context Context with node attributes
   */
  transform(context: ContextNode),
  /**
   * Load something when plugin installs
   * @param context Application context
   */
  load?(context: Context),
  /**
   * Use plugin in server context
   */
  server?: boolean,
  /**
   * Use plugin in client context
   */
  client?: boolean
};