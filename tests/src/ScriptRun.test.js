const childProcess = require('child_process')
const { promisify } = require('util')

const exec = promisify(childProcess.exec)

test('built packages can run scripts', async () => {
  const { stdout } = await exec('npm run script')
  const line = stdout.split('\n').find((l) => l === 'Nullstack Tests')
  expect(line).toBeTruthy()
})
