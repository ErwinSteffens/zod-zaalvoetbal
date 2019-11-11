import TeamName from './input/TeamName'
import GameCollection, { Game } from './input/GameCollection'
import TeamCollection from './input/TeamCollection'
import PouleCollection, { Poule, TeamScore } from './input/PouleCollection'

class ScoreCalculator {
    teams: TeamCollection
    games: GameCollection
    poules: PouleCollection

    constructor(teams: TeamCollection, games: GameCollection, poules: PouleCollection) {
        this.teams = teams
        this.games = games
        this.poules = poules
    }

    processGames() {
        for (const game of this.games.games) {
            this.processGame(game)
        }

        for (const poule of this.poules.poules) {
            poule.teamScores = this.sortTeamScores(poule)
        }

        return this.poules
    }

    sortTeamScores(poule: Poule): TeamScore[] {
        return poule.teamScores.sort((a, b) => {
            if (a.points < b.points) {
                return -1
            }
            if (a.points > b.points) {
                return 1
            }

            if (a.goalsDifference < b.goalsDifference) {
                return -1
            }
            if (a.goalsDifference > b.goalsDifference) {
                return 1
            }

            if (a.goalsFor < b.goalsFor) {
                return -1
            }
            if (a.goalsFor > b.goalsFor) {
                return 1
            }

            // TODO: Sort based on game results

            return 0
        })
    }

    private processGame(game: Game) {
        if (game.homeScore == null || game.awayScore == null) {
            return
        }

        this.processScore(game.homeTeamId, game.homeScore, game.awayScore)
        this.processScore(game.awayTeamId, game.awayScore, game.homeScore)
    }

    private processScore(teamId: string, goalsFor: number, goalsAgainst: number) {
        const team = this.teams.findById(teamId)
        const pouleId = team.pouleId

        const poule = this.poules.findById(pouleId)
        const teamScore = poule.teamScores.find(t => t.teamId === team.id)
        if (!teamScore) {
            throw new Error(`Failed to find team '${team.id}' in poule '${pouleId}'`)
        }

        teamScore.gamesPlayed++

        teamScore.goalsFor += goalsFor
        teamScore.goalsAgainst += goalsAgainst
        teamScore.goalsDifference += goalsFor - goalsAgainst

        if (goalsFor > goalsAgainst) {
            teamScore.points += 3
            teamScore.gamesWon++
        } else if (goalsFor < goalsAgainst) {
            teamScore.gamesLost++
        } else {
            teamScore.points += 1
            teamScore.gamesDraw++
        }
    }
}

export default ScoreCalculator
