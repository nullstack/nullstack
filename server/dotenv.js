import dotenv from 'dotenv'

let path = '.env'

if (process.env.NULLSTACK_ENVIRONMENT_NAME) {
  path += `.${process.env.NULLSTACK_ENVIRONMENT_NAME}`
}

if (module.hot) {
  dotenv.config({ path, override: true })
} else {
  dotenv.config({ path })
}
