export type NullstackEnvironment = {

  client: boolean,

  server: boolean,

  development: boolean,

  production: boolean,

  static: boolean,

  /**
   * md5 hash of the current environment folder outputs.
   * 
   * https://nullstack.app/context-environment
   */
  key: string

};