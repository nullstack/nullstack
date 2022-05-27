const defaultOptions = {
  launch: {
    headless: false,
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
    headless: false,
    args: [
      '--ignore-certificate-errors',
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-accelerated-2d-canvas',
      '--disable-gpu'
    ]
  },
  server: {
    command: 'npm run start',
    port: 6969,
    launchTimeout: 25000
  },
  browserContext: 'incognito'
}

module.exports = process.env.CI ? ciPipelineOptions : defaultOptions;