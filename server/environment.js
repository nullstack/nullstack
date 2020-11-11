const environment = {client: false, server: true, prerendered: false};

environment.development = __dirname.indexOf('.development') > -1;
environment.production = !environment.development;

export default environment;