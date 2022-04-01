const { readFileSync } = require('fs');

let css;

beforeAll(async () => {
  css = readFileSync('.production/client.css', 'utf-8')
});

describe('WebpackCustomPlugin Purge', () => {

  test('used classes stay after purge', async () => {
    const hasClass = css.includes('.class')
    expect(hasClass).toBeTruthy();
  })

  test('used classes with brackets stay after purge', async () => {
    const hasClass = css.includes('.class-\\[custom\\]')
    expect(hasClass).toBeTruthy();
  })

  test('used classes with arbitraty value and variable stay after purge', async () => {
    const hasClass = css.includes('\\[color\\:var\\(--custom-var-value\\)\\]')
    expect(hasClass).toBeTruthy();
  })

  test('used classes with dots stay after purge', async () => {
    const hasClass = css.includes('.class-0\\.5')
    expect(hasClass).toBeTruthy();
  })

  test('unused classes are removed during purge', async () => {
    const hasClass = css.includes('.should-be-removed')
    expect(hasClass).toBeFalsy();
  })

})
