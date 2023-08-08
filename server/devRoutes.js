import path from 'path'
import fs from 'fs'

/**
 * @param {import("express").Application} server
 */
export default function addDevRoutes(server) {
  server.get("/nullstack-dev-server/open-editor", (req, res) => {
    const { fileName } = req.query

    if (fileName) {
      const launchEditor = require("launch-editor")
      launchEditor(fileName, process.env.NULLSTACK_EDITOR || 'code')
    }

    res.end()
  })

  server.get("/nullstack-dev-server/get-file", (req, res) => {
    /** @type {{ fileName: string, lineNumber: string, columnNumber: string }} */
    const { fileName, lineNumber, columnNumber } = req.query

    const originalFile = fs.readFileSync(fileName, 'utf8')
    const lineBelowError = (
      '|'.padStart(lineNumber.length + 4, ' ') +
      '^'.padStart(parseInt(columnNumber) + 1, ' ')
    )
    const file = originalFile
      .split('\n')
      .map((line, idx) => {
        const currentLineNumber = idx + 1
        const formattedLine = ` ${currentLineNumber} | ${line}`
        if (currentLineNumber === parseInt(lineNumber)) {
          return ['>' + formattedLine, lineBelowError]
        }
        return ' ' + formattedLine
      })
      .flat()
      .slice(parseInt(lineNumber) - 3, parseInt(lineNumber) + 3)
      .join('\n')

    const relativePath = path
      .relative(process.cwd(), fileName)
      .split(path.sep)
      .join('/')

    res.send({ file, relativePath })
  })
}
