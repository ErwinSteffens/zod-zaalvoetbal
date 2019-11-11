import * as fs from 'fs'
import SheetParser from './SheetParser'
import ScoreCalculator from './ScoreCalculator'
import TeamCollection from './input/TeamCollection'

// Constant values
const inputFileName = '../files/2019-2020/Zaalschema 2019-2020 v1.xlsx'
const outputDir = '../app/src/data'

// Parser
const sheetParser = new SheetParser(inputFileName)

console.log('Processing poules')
sheetParser.parsePoules()

console.log('Processing games')
sheetParser.parseGames()

console.log('Updating scores')
const scoreCalculator = new ScoreCalculator(
    sheetParser.teams,
    sheetParser.games,
    sheetParser.poules
)
sheetParser.poules = scoreCalculator.processGames()

console.log('Writing output files')

// Create the output directory
if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir)
}

sheetParser.clubs.save(outputDir)
sheetParser.locations.save(outputDir)
sheetParser.poules.save(outputDir)
sheetParser.teams.save(outputDir)
sheetParser.games.save(outputDir)

console.log('Done')
