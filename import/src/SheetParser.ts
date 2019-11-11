import * as XLSX from 'xlsx'
import { WorkSheet } from 'xlsx'

export interface SheetPoule {
    name: string
}

export interface SheetTeam {
    name: string
    poule: string
}

export interface SheetGame {
    round: number
    time: Date
    location: string
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
        this.workbook.SheetNames.filter(name => name != this.gameSheetName).forEach(name => {
            const sheet: WorkSheet = this.workbook.Sheets[name]

            const parts = name.split('-')
            const pouleName = `${parts[0]} Poule ${parts[1]}`

            if (this.pouleFound) {
                this.pouleFound({
                    name: pouleName
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
                        poule: pouleName
                    })
                }

                rowIndex++
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
                    const locationCell = gameSheet[XLSX.utils.encode_cell({ c: column, r: row })]
                    if (!locationCell || locationCell.v === 'Totaal') {
                        break
                    }

                    const location = locationCell.v
                    for (let rowIndex = 0; rowIndex < this.timeRows; rowIndex++) {
                        const timeCode = XLSX.SSF.parse_date_code(
                            this.getCellValue(gameSheet, 0, row + rowIndex + 2)
                        )
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
                            const homeScore = this.getCellValue(
                                gameSheet,
                                column + 2,
                                row + rowIndex + 2
                            )
                            const awayScore = this.getCellValue(
                                gameSheet,
                                column + 3,
                                row + rowIndex + 2
                            )

                            if (this.gameFound) {
                                this.gameFound({
                                    round: round,
                                    time: time,
                                    location: location,
                                    homeTeam: homeTeam,
                                    awayTeam: awayTeam,
                                    homeScore: homeScore,
                                    awayScore: awayScore
                                })
                            }
                        }
                    }

                    column += 5
                }
            } else {
                break
            }

            row += this.timeRows + 3
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
