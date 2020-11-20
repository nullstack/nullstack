const environment = {client: false, server: true};

environment.development = __dirname.indexOf('.development') > -1;
environment.production = !environment.development;

export default environment;