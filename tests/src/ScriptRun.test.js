const { promisify } = require('util');
const exec = promisify(require('child_process').exec);

test('built packages can run scripts', async () => {
  const { stdout } = await exec('npm run script');
  const line = stdout.split("\n").find((line) => line === 'Nullstack Tests');
  expect(line).toBeTruthy();
});