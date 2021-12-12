type Self = {
  initiated: boolean,
  hydrated: boolean,
  prerendered: boolean,
  /**
   * If the component is persistent
   * 
   * https://nullstack.app/persistent-components
   */
  persistent: boolean,
  /**
   * Only on client
   */
  element: HTMLElement,
  key: string
};