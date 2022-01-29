export type NullstackSelf = {

  initiated: boolean,

  hydrated: boolean,

  terminated: boolean,

  prerendered: boolean,

  /**
   * If the component is persistent
   * 
   * https://nullstack.app/persistent-components
   */
  persistent: boolean,

  /**
   * Only available after hydration
   */
  element?: HTMLElement,

  key: string

};