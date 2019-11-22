import * as fs from 'fs'
import fetch from 'node-fetch'
import Importer from './Importer'
import * as dotenv from 'dotenv'

dotenv.config()

const link = process.env.SHEET_SHARE_LINK
const exportLink = `${link}/export?format=xlsx`

const schemaFile = './schema.xlsx'

const downloadFile = async url => {
    const response = await fetch(url)

    const fileStream = fs.createWriteStream(schemaFile)
    await new Promise((resolve, reject) => {
        response.body.pipe(fileStream)
        response.body.on('error', err => {
            reject(err)
        })
        fileStream.on('finish', function() {
            resolve()
        })
    })
}

const runImport = async () => {
    await downloadFile(exportLink)

    const outputDir = '../app/src/data'

    const importer = new Importer(schemaFile)
    importer.toOutputDir(outputDir)

    console.log('Done')
}

runImport()
