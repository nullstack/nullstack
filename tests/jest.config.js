const CI = !!process.env.CI

module.exports = {
  preset: 'jest-puppeteer',
  forceExit: CI,
  testTimeout: 60000,
}
