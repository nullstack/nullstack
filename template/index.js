import './styles.scss';

import {route, config, ready} from 'nullstack';

config('database.url', 'mongodb://localhost:27017/{{PROJECT_NAME}}');
config('database.name', '{{PROJECT_NAME}}');
config('session.secret', '{{SESSION_SECRET}}');
config('server.port', 3769);
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
