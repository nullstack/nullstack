import {createHash} from 'crypto';

const integrities = {};

export function generateIntegrity(key, source) {
  integrities[key] = 'sha512-' + createHash('sha512', 'utf8').update(source).digest('base64');
}

export default integrities;