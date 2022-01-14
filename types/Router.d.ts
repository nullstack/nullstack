export type NullstackRouter = {

  /**
   * The router path including query params.
   * Does not contain the domain and port.
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
   * Only the base url
   * 
   * @example: `https://nullstack.app`
   * 
   * https://nullstack.app/routes-and-params#router
   */
  base: string,

  /**
   * Event raised when `router.url` (including changes on params) or `router.path` changes.
   * 
   * https://nullstack.app/routes-and-params#custom-events
   */
  event: string

};