import { createHash } from 'crypto';
import environment from './environment'

const integrities = {};

export function generateIntegrity(key, source) {
  if (environment.development) return
  integrities[key] = 'sha512-' + createHash('sha512', 'utf8').update(source).digest('base64');
}

export default integrities;