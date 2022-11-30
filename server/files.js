import { existsSync, readFileSync } from 'fs'
import path from 'path'

import environment from './environment'
import { generateIntegrity } from './integrities'

const files = {}

export function generateFile(file, server) {
  if (files[file] && environment.production) return files[file]
  const filePath = path.join(__dirname, file)
  if (existsSync(filePath)) {
    files[file] = readFileSync(filePath, 'utf-8')
  } else {
    files[file] = ''
  }
  if (!server.less) {
    generateIntegrity(file, files[file])
  }
  return files[file]
}

export default files
