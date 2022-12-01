const exec = promisify(require('child_process').exec)
const { promisify } = require('util')

test('built packages can run scripts', async () => {
  const { stdout } = await exec('npm run script')
  const line = stdout.split('\n').find((l) => l === 'Nullstack Tests')
  expect(line).toBeTruthy()
})
