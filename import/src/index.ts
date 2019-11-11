import Importer from './Importer'

const inputFile = '../files/2019-2020/Zaalschema 2019-2020 v1.xlsx'
const outputDir = '../app/src/data'

const importer = new Importer(inputFile)
importer.toOutputDir(outputDir)

console.log('Done')
