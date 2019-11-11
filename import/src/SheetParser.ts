import * as XLSX from 'xlsx'
import { WorkSheet } from 'xlsx'

import { slug } from './utils'
import TeamName from './input/TeamName'
import ClubCollection from './input/ClubCollection'
import LocationCollection from './input/LocationCollection'
import GameCollection from './input/GameCollection'
import TeamCollection from './input/TeamCollection'
import PouleCollection, { Poule, TeamScore } from './input/PouleCollection'

class SheetParser {
    readonly gameSheetName: string = 'wedstrijdoverzicht'
    readonly timeRows: number = 20

    workbook: XLSX.WorkBook
    clubs: ClubCollection
    locations: LocationCollection
    games: GameCollection
    poules: PouleCollection
    teams: TeamCollection

    constructor(inputFile: string) {
        this.workbook = XLSX.readFile(inputFile)

        this.init()
    }

    init() {
        this.clubs = new ClubCollection('./data/clubs.json')
        this.locations = new LocationCollection('./data/locations.json')
        this.games = new GameCollection()
        this.poules = new PouleCollection()
        this.teams = new TeamCollection()
    }

    parsePoules() {
        this.workbook.SheetNames.filter(name => name != this.gameSheetName).forEach(name => {
            const sheet: WorkSheet = this.workbook.Sheets[name]

            const parts = name.split('-')
            const pouleName = `${parts[0]} Poule ${parts[1]}`
            const poule: Poule = {
                id: slug(pouleName),
                name: pouleName,
                teamScores: []
            }

            console.debug(`  Poule: ${pouleName}`)

            let rowIndex = 0
            while (true) {
                const value = this.getCellValue(sheet, 1, 1 + rowIndex)
                if (!value || value === 'speeldagen') {
                    break
                }

                const teamName = new TeamName(value)

                const clubInfo = this.clubs.findByInputName(teamName.clubName)

                const teamId = slug(`${clubInfo.name}-${teamName.teamName}`)
                const clubId = slug(clubInfo.name)

                console.debug(`  Team: Id: ${teamId}`)
                console.debug(`        Name: ${teamName.clubName} ${teamName.teamName}`)

                this.teams.add({
                    id: teamId,
                    clubId: clubId,
                    name: teamName.teamName,
                    pouleId: poule.id
                })

                poule.teamScores.push(new TeamScore(teamId))

                rowIndex++
            }

            this.poules.add(poule)
        })
    }

    parseGames() {
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

                    const locationInputName = locationCell.v
                    const location = this.locations.findByInputName(locationInputName)

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

                            const homeTeamId = this.getTeamId(new TeamName(homeTeam))
                            const awayTeamId = this.getTeamId(new TeamName(awayTeam))

                            this.games.add({
                                round: round,
                                time: time,
                                homeTeamId: homeTeamId,
                                homeScore: homeScore,
                                awayTeamId: awayTeamId,
                                awayScore: awayScore,
                                locationId: slug(location.venue)
                            })
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

        this.sortTeamsInPoule()
    }

    private sortTeamsInPoule() {
        for (const poule of this.poules.poules) {
        }
    }

    private getCellValue(sheet: XLSX.WorkSheet, column: number, row: number) {
        const cell = sheet[XLSX.utils.encode_cell({ c: column, r: row })]
        if (!cell) {
            return null
        }
        return cell.v
    }

    private getTeamId(info: TeamName): string {
        const clubInfo = this.clubs.findByInputName(info.clubName)

        return slug(`${clubInfo.name}-${info.teamName}`)
    }
}

export default SheetParser
