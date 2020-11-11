const environment = {...window.environment, client: true, server: false};
delete window.environment;

export default environment;