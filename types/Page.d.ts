export type NullstackPage = {

  /**
   * Current page title
   * 
   * @see https://nullstack.app/context-page
   */
  title: string,

  /**
   * Path to site banner at **public** folder
   * 
   * @see https://nullstack.app/context-page
   */
  image: string,

  /**
   * Current page description
   * 
   * @see https://nullstack.app/context-page
   */
  description?: string,

  /**
   * Absolute canonical url
   * 
   * @see https://nullstack.app/context-page
   */
  canonical: string,

  /**
   * Current page locale, example: `en-US`
   * 
   * @see https://nullstack.app/context-page
   */
  locale: string,

  /**
   * Related to robots.txt file generation
   * 
   * @see https://nullstack.app/context-page
   */
  robots: string,

  schema?: any,

  /**
   * Represents the `changefreq` key in the **sitemap.xml**
   * 
   * @see https://nullstack.app/context-page
   */
  changes: 'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never',

  /**
   * Represents the `priority` key in the **sitemap.xml**
   * 
   * sitemaps assumes a `0.5` priority
   * 
   * @see https://nullstack.app/context-page
   */
  priority: number,

  /**
   * The page current HTTP response, example: `200`
   * 
   * @see https://nullstack.app/context-page
   */
  status: number,

  /**
   * Event raised when `page.title` changes.
   * 
   * @scope client
   * @see https://nullstack.app/context-page#custom-events
   */
  event: string

};