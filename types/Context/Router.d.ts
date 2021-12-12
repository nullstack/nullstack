type Router = {
  /**
   * All url after the domain including the path and the query params
   * 
   * https://nullstack.app/routes-and-params#router
   */
  url: string,
  /**
   * The router path without query params.
   * 
   * https://nullstack.app/routes-and-params#router
   */
  path: string,
  /**
   * Only the base url, example: `https://nullstack.app`
   * 
   * https://nullstack.app/routes-and-params#router
   */
  base: string,
  /**
   * Event raised when `router.url` or `router.path` changes.
   * 
   * Only on client.
   * 
   * https://nullstack.app/routes-and-params#custom-events
   */
  event: string
};