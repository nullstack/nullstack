import { ICONS } from 'nullstack/project'
import environment from './environment'
import worker from './worker'
import { getCurrentContext } from './context'

const project = {}

project.domain = process.env.NULLSTACK_PROJECT_DOMAIN
project.name = process.env.NULLSTACK_PROJECT_NAME
project.shortName = process.env.NULLSTACK_PROJECT_SHORT_NAME
project.color = process.env.NULLSTACK_PROJECT_COLOR
project.viewport = process.env.NULLSTACK_PROJECT_VIEWPORT || 'width=device-width, initial-scale=1, shrink-to-fit=no'
project.type = 'website'
project.display = 'standalone'
project.orientation = 'portrait'
project.scope = '/'
project.root = '/'
project.sitemap = environment.mode === 'ssg'
project.favicon = '/favicon-96x96.png'
project.disallow = []
project.icons = ICONS

function getHost() {
  const currentContext = getCurrentContext()
  if (currentContext.request?.headers?.host) {
    return currentContext.request.headers.host
  }
  if (project.domain === 'localhost') {
    return `localhost:${process.env.NULLSTACK_SERVER_PORT}`
  }
  return project.domain
}

export function generateBase() {
  return `${worker.protocol}://${getHost()}`
}

export default project
