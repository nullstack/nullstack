const defaultOptions = {
  launch: {
    headless: true,
  },
  server: {
    command: 'npm run build && node .production/server.js',
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
  server: {
    command: 'npm run build && node .production/server.js',
    port: 6969,
    launchTimeout: 25000
  },
  browserContext: 'incognito'
}

module.exports = process.env.CI ? ciPipelineOptions : defaultOptions;