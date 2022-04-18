import state from './state';
const environment = { ...state.environment, client: true, server: false };

Object.freeze(environment);

export default environment;