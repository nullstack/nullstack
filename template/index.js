import './styles.scss';

import {route, config, ready} from 'nullstack';

config('database.url', 'mongodb://localhost:27017/{{PROJECT_NAME}}'); //server
config('database.name', '{{PROJECT_NAME}}'); //server
config('session.secret', '{{SESSION_SECRET}}'); //server
config('server.port', 3769); //server

config('storage.type', 'disk'); //server
config('storage.key', 'KEY'); //server
config('storage.secret', 'SECRET'); //server
config('storage.region', 'sa-east-1'); //server
config('storage.bucket', 'BUCKET'); //server

config('default.description', 'TODO');
config('default.project', 'TODO');
config('default.image', 'TODO');
config('default.domain', 'TODO');
config('default.locale', 'TODO');
config('default.protocol', 'https');
config('default.path', '/');
config('default.type', 'website');

import Dashboard from './dashboard';
route('/', Dashboard);

ready();
