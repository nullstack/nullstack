export type NullstackProject = {

  domain: string;

  /**
   * Name of the project
   *
   * @see https://nullstack.app/context-project
   */
  name: string;

  shortName?: string;

  color: string;

  backgroundColor?: string;

  /**
   * Type of the app, example: `website`
   */
  type: string;

  display: string;

  orientation: string;

  scope: string;

  root: string;

  /**
   * App icons size/path
   *
   * If not declared, Nullstack searches for an `icon-[WIDTH]x[HEIGHT].png` in **public** folder
   *
   * @example { '72': '/icon-72x72.png' }
   */
  icons: Record<string, string>;

  /**
   * Relative or absolute url to favicon
   */
  favicon: string;

  /**
   * Relative paths
   */
  disallow: string[];

  /**
   * If active or relative/absolute url
   */
  sitemap: boolean | string;

  cdn: string;

  protocol: "http" | "https";

};
