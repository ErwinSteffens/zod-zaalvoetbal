import * as fs from 'fs'

import { slug } from './utils'
import SheetParser, { SheetPoule, SheetTeam, SheetGame } from './SheetParser'
import TeamNameParser from './input/TeamName'
import TeamCollection from './input/TeamCollection'
import ClubCollection from './input/ClubCollection'
import LocationCollection from './input/LocationCollection'
import GameCollection from './input/GameCollection'
import PouleCollection, { Poule, TeamScore } from './input/PouleCollection'
import ScoreCalculator from './ScoreCalculator'

class Importer {
    sheetParser: SheetParser
    clubs: ClubCollection
    locations: LocationCollection
    games: GameCollection
    poules: PouleCollection
    teams: TeamCollection

    constructor(inputFile: string) {
        this.clubs = new ClubCollection('./input/clubs.json')
        this.locations = new LocationCollection('./input/locations.json')
        this.games = new GameCollection()
        this.poules = new PouleCollection()
        this.teams = new TeamCollection()

        this.sheetParser = new SheetParser(inputFile)
        this.sheetParser.pouleFound = poule => this.pouleFound(poule)
        this.sheetParser.teamFound = team => this.teamFound(team)
        this.sheetParser.gameFound = game => this.gameFound(game)
    }

    toOutputDir(outputDir: string) {
        this.sheetParser.parse()

        this.check()

        let scoreCalc = new ScoreCalculator(this.games, this.poules)
        this.poules.items = scoreCalc.processGames()

        // Create the output directory
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir)
        }

        this.clubs.save(outputDir)
        this.locations.save(outputDir)
        this.poules.save(outputDir)
        this.teams.save(outputDir)
        this.games.save(outputDir)
    }

    private pouleFound(sheetPoule: SheetPoule) {
        this.poules.add({
            id: slug(sheetPoule.name),
            name: sheetPoule.name,
            halfCompetition: sheetPoule.halfCompetition,
            teamScores: []
        })
    }

    private teamFound(sheetTeam: SheetTeam) {
        const teamInfo = new TeamNameParser(sheetTeam.name)

        const club = this.clubs.findByInputName(teamInfo.clubName)

        const teamId = slug(`${club.name}-${teamInfo.teamName}`)
        const clubId = slug(club.name)
        const pouleId = slug(sheetTeam.poule)

        this.teams.add({
            id: teamId,
            clubId: clubId,
            name: teamInfo.teamName,
            pouleId: pouleId
        })

        const poule = this.poules.findById(pouleId)
        poule.teamScores.push(new TeamScore(teamId))
    }

    private gameFound(sheetGame: SheetGame) {
        const location = this.locations.findByInputName(sheetGame.location)

        const locationId = slug(location.venue)
        const homeTeamId = this.getTeamId(new TeamNameParser(sheetGame.homeTeam))
        const awayTeamId = this.getTeamId(new TeamNameParser(sheetGame.awayTeam))

        const pouleId = this.poules.getPouleForTeam(homeTeamId).id

        this.games.add({
            round: sheetGame.round,
            time: sheetGame.time,
            pouleId: pouleId,
            homeTeamId: homeTeamId,
            homeScore: sheetGame.homeScore,
            awayTeamId: awayTeamId,
            awayScore: sheetGame.awayScore,
            locationId: locationId,
            field: sheetGame.field
        })
    }

    private check() {
        this.teams.items.forEach(team => {
            let poule = this.poules.findById(team.pouleId)
            let teamsInPoule = poule.teamScores.length
            let gamesForTeam = this.games.getGamesForTeam(team.id).length
            let gamesForTeamExpected = teamsInPoule - 1
            if (!poule.halfCompetition) {
                gamesForTeamExpected *= 2
            }

            if (gamesForTeam !== gamesForTeamExpected) {
                console.warn(
                    `Expected ${gamesForTeamExpected} but found ${gamesForTeam} for team ${team.id}`
                )
            }
        })
    }

    private getTeamId(info: TeamNameParser): string {
        const clubInfo = this.clubs.findByInputName(info.clubName)
        return slug(`${clubInfo.name}-${info.teamName}`)
    }
}

export default Importer
