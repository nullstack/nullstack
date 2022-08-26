export type NullstackWorker = {
  /**
   * - keys: server functions names
   * - values: array of these functions arguments
   *
   * @see https://nullstack.app/service-worker#loading-screens
   */
  queues: Record<string, any[]>;

  /**
   * When a server function is called fetching will be set to `true` until the response is resolved.
   *
   * @see https://nullstack.app/service-worker#loading-screens
   */
  fetching: boolean;

  /**
   * @deprecated Removed on v0.9.20 use `fetching` instead:
   *
   * @see https://nullstack.app/service-worker#loading-screens
   */
  loading: boolean;
};
