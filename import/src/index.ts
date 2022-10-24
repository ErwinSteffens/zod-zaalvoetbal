import * as fs from 'fs'
import Importer from './Importer'
import * as dotenv from 'dotenv'

const axios = require('axios')

dotenv.config()

const link = process.env.SHEET_SHARE_LINK
const exportLink = `${link}/export?format=xlsx`

const schemaFile = './schema.xlsx'

const downloadFile = async (url) => {
  const fileStream = fs.createWriteStream(schemaFile)

  const { data } = await axios({
    url,
    responseType: 'stream',
  })

  await new Promise<void>((resolve, reject) => {
    data.pipe(fileStream)
    data.on('error', (err) => {
      reject(err)
    })
    fileStream.on('finish', function () {
      resolve()
    })
  })
}

const runImport = async () => {
  console.log('Downloading latest sheet')

  await downloadFile(exportLink)

  console.log('Importing data from sheet')

  const outputDir = '../app/src/data'
  const importer = new Importer(schemaFile)
  importer.toOutputDir(outputDir)

  console.log('Done')
}

runImport()
