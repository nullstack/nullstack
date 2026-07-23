async function getJson(url) {
  const response = await page.goto(url, { waitUntil: 'networkidle0' })
  const body = await page.evaluate(() => {
    const text = document.body.innerText.trim()
    if (!text) return null
    try {
      return JSON.parse(text)
    } catch (error) {
      return text
    }
  })
  return {
    status: response.status(),
    body,
  }
}

async function invokeCase(methodName) {
  await page.goto('http://localhost:6969/error-handle-server-functions')
  await page.waitForSelector('[data-hydrated]')
  const responsePromise = page.waitForResponse(
    (response) => response.url().includes('/nullstack/') && response.url().includes(`/${methodName}.json`),
  )
  await page.click('[data-run]')
  const response = await responsePromise
  return {
    status: response.status(),
    body: await response.json(),
  }
}

describe('ErrorHandleServerFunctions invoker', () => {
  test('maps AppBusinessException through context.onerror and wraps result', async () => {
    const { status, body } = await invokeCase('throwAppBusinessError')
    expect(status).toBe(422)
    expect(body).toEqual({
      result: {
        message: 'Business Exception: Aconteceu um erro de regra de negocio',
        code: 'BUSINESS_VALIDATION',
      },
    })
  })

  test('maps a normal Error through context.onerror and wraps result', async () => {
    const { status, body } = await invokeCase('throwNormalError')
    expect(status).toBe(500)
    expect(body).toEqual({
      result: {
        message: 'Aconteceu um problema nao esperado',
        code: 'ERROR_UNKNOWN',
      },
    })
  })

  test('tolerates a thrown plain object with status/result and still responds via onerror', async () => {
    const { status, body } = await invokeCase('throwJSONError')
    expect(status).toBe(400)
    expect(body).toEqual({
      result: {
        code: 'ERROR_UNKNOWN',
      },
    })
  })

  test('maps a thrown plain object with message/code through context.onerror', async () => {
    const { status, body } = await invokeCase('throwDummyJsonError')
    expect(status).toBe(500)
    expect(body).toEqual({
      result: {
        message: 'Erro Interno',
        code: 'UNKNOWN_ERROR',
      },
    })
  })
})

describe('ErrorHandleServerFunctions exposed', () => {
  test('returns AppBusinessException payload without wrapping result', async () => {
    const { status, body } = await getJson('http://localhost:6969/error-handle/exposed-business.json')
    expect(status).toBe(422)
    expect(body).toEqual({
      message: 'Business Exception: Aconteceu um erro de regra de negocio',
      code: 'BUSINESS_VALIDATION',
    })
  })

  test('returns a normal Error payload without wrapping result', async () => {
    const { status, body } = await getJson('http://localhost:6969/error-handle/exposed-normal.json')
    expect(status).toBe(500)
    expect(body).toEqual({
      message: 'Aconteceu um problema nao esperado',
      code: 'ERROR_UNKNOWN',
    })
  })

  test('tolerates a thrown plain object with status/result without wrapping', async () => {
    const { status, body } = await getJson('http://localhost:6969/error-handle/exposed-json.json')
    expect(status).toBe(400)
    expect(body).toEqual({
      code: 'ERROR_UNKNOWN',
    })
  })

  test('returns a thrown plain object with message/code without wrapping', async () => {
    const { status, body } = await getJson('http://localhost:6969/error-handle/exposed-dummy.json')
    expect(status).toBe(500)
    expect(body).toEqual({
      message: 'Erro Interno',
      code: 'UNKNOWN_ERROR',
    })
  })
})
