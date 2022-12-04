import dotenv from 'dotenv'

let path = '.env'

if (process.env.NULLSTACK_ENVIRONMENT_NAME) {
  path += `.${process.env.NULLSTACK_ENVIRONMENT_NAME}`
}

dotenv.config({ path })
