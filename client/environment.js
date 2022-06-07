import state from './state';

const environment = {
  ...state.environment,
  client: true,
  server: false,
  event: 'nullstack.environment'
};

export default environment;