const CI = !!process.env.CI;

module.exports = {
  preset: "jest-puppeteer",
  forceExit: CI,
  testTimeout: 10000
}