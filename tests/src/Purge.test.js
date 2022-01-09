const { readFileSync } = require('fs');
const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

let css;

const unused = '.unused'

beforeAll(async () => {
  await exec('npm run build');
  css = readFileSync('.production/client.css', 'utf-8')
  console.log(css)
});

describe('.production', () => {

  test('used classes stay after purge', async () => {
    const hasClass = css.includes('.class')
    expect(hasClass).toBeTruthy();
  })

  test('used classes with brackets stay after purge', async () => {
    const hasClass = css.includes('.class-\[custom\]')
    expect(hasClass).toBeTruthy();
  })

  test('used classes with dots stay after purge', async () => {
    const hasClass = css.includes('.class-0\.5')
    expect(hasClass).toBeTruthy();
  })

  test('unused classes are removed during purge', async () => {
    const hasClass = css.includes(unused)
    expect(hasClass).toBeFalsy();
  })

})
