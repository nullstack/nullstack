const environment = {...window.environment, client: true, server: false};
delete window.environment;

Object.freeze(environment);

export default environment;