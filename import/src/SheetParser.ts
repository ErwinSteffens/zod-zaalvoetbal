import * as XLSX from 'xlsx'
import { WorkSheet } from 'xlsx'
import { GameStatus } from './input/GameCollection'

export interface SheetPoule {
    name: string
    halfCompetition: boolean
    temporary: boolean
}

export interface SheetTeam {
    name: string
    poule: string
}

export interface SheetGame {
    round: number
    time: Date
    status: GameStatus
    location: string
    field: number | null
    homeTeam: string
    awayTeam: string
    homeScore: number | null
    awayScore: number | null
}

class SheetParser {
    readonly gameSheetName: string = 'wedstrijdoverzicht'
    readonly timeRows: number = 20

    workbook: XLSX.WorkBook

    pouleFound: (poule: SheetPoule) => void
    teamFound: (team: SheetTeam) => void
    gameFound: (game: SheetGame) => void

    constructor(inputFile: string) {
        this.workbook = XLSX.readFile(inputFile)
    }

    parse() {
        this.parsePoules()
        this.parseGames()
    }

    private parsePoules() {
        this.workbook.SheetNames.forEach((name) => {
            const matches = name.match(/(O\d+)-([A-Z])/)
            console.log('Blaat', name)
            if (matches || name == 'Minis') {
                const sheet: WorkSheet = this.workbook.Sheets[name]

                let pouleName = name
                if (matches) {
                    pouleName = `${matches[1]} Poule ${matches[2]}`
                }

                const half = this.getCellValue(sheet, 1, 0) === 'Halve competitie'
                const temporary = this.getCellValue(sheet, 2, 0) === 'Tijdelijk'

                if (this.pouleFound) {
                    this.pouleFound({
                        name: pouleName,
                        halfCompetition: half,
                        temporary: temporary,
                    })
                }

                let rowIndex = 0
                while (true) {
                    const value = this.getCellValue(sheet, 1, 1 + rowIndex)
                    if (!value || value === 'speeldagen') {
                        break
                    }

                    if (this.teamFound) {
                        this.teamFound({
                            name: value,
                            poule: pouleName,
                        })
                    }

                    rowIndex++
                }
            }
        })
    }

    private parseGames() {
        const gameSheet = this.workbook.Sheets[this.gameSheetName]

        let round = 0
        let row = 0
        while (true) {
            const cell = gameSheet[XLSX.utils.encode_cell({ c: 0, r: row })]
            if (cell && cell.v === 'sporthal') {
                const dateCell = gameSheet[XLSX.utils.encode_cell({ c: 0, r: row + 1 })]
                const dateCode = XLSX.SSF.parse_date_code(dateCell.v)

                let column = 2
                while (true) {
                    let location = this.getCellValue(gameSheet, column, row)
                    if (!location || location === 'Totaal') {
                        break
                    }

                    let field: number | null = null
                    let fieldMatch = location.match(/([\w- ]+)(?: \(Veld (\d+)\))?$/)
                    if (fieldMatch) {
                        location = fieldMatch[1]
                        field = parseInt(fieldMatch[2])
                    }

                    let rowIndex = 0
                    while (true) {
                        const timeValue = this.getCellValue(gameSheet, 0, row + rowIndex + 2)
                        if (!timeValue) {
                            break
                        }

                        const timeCode = XLSX.SSF.parse_date_code(timeValue)
                        const time = new Date(
                            dateCode.y,
                            dateCode.m - 1,
                            dateCode.d,
                            timeCode.H,
                            timeCode.M
                        )

                        const homeTeam = this.getCellValue(
                            gameSheet,
                            column + 0,
                            row + rowIndex + 2
                        )
                        const awayTeam = this.getCellValue(
                            gameSheet,
                            column + 1,
                            row + rowIndex + 2
                        )

                        if (homeTeam && awayTeam) {
                            let status: GameStatus = GameStatus.Planned

                            let homeScore = this.getCellValue(
                                gameSheet,
                                column + 2,
                                row + rowIndex + 2
                            )
                            let awayScore = this.getCellValue(
                                gameSheet,
                                column + 3,
                                row + rowIndex + 2
                            )

                            if (homeScore !== null || awayScore !== null) {
                                if (homeScore === 'x' && awayScore === 'x') {
                                    homeScore = 0
                                    awayScore = 0
                                    status = GameStatus.BothTeamNoShow
                                } else if (homeScore === 'x') {
                                    homeScore = 0
                                    awayScore = 3
                                    status = GameStatus.HomeTeamNoShow
                                } else if (awayScore === 'x') {
                                    homeScore = 3
                                    awayScore = 0
                                    status = GameStatus.AwayTeamNoShow
                                } else {
                                    status = GameStatus.Played
                                }
                            }

                            if (this.gameFound) {
                                this.gameFound({
                                    round: round,
                                    time: time,
                                    status: status,
                                    location: location,
                                    field: field,
                                    homeTeam: homeTeam,
                                    awayTeam: awayTeam,
                                    homeScore: homeScore,
                                    awayScore: awayScore,
                                })
                            }
                        }

                        rowIndex++
                    }

                    column += 5
                }
            } else {
                break
            }

            // Update the rows until we do not find a time value anymore
            row += 2
            while (true) {
                const timeValue = this.getCellValue(gameSheet, 0, row)
                if (!timeValue) {
                    break
                }
                row++
            }

            row++
            round++
        }
    }

    private getCellValue(sheet: XLSX.WorkSheet, column: number, row: number) {
        const cell = sheet[XLSX.utils.encode_cell({ c: column, r: row })]
        if (!cell) {
            return null
        }
        return cell.v
    }
}

export default SheetParser
