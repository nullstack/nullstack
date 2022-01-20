const CI = Boolean(process.env.CI || false);

module.exports = {
  preset: "jest-puppeteer",
  forceExit: CI,
  testTimeout: CI ? 5000 : 20000
}