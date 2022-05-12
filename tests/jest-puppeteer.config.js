// get environment variable
const CI = !!process.env.CI;

const baseOptions = {
  launch: {
    headless: true
  },
  server: {
    command: 'npm run start',
    port: 6969,
    launchTimeout: 25000
  },
  browserContext: 'incognito'
}

const ciPipelineOptions = {
  launch: {
    executablePath: '/usr/bin/google-chrome-stable',
    headless: true,
    args: [
      '--ignore-certificate-errors',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  },
  ...baseOptions
}

module.exports = CI ? ciPipelineOptions : baseOptions;