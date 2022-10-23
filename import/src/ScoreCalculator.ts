import GameCollection, { Game, GameStatus } from './input/GameCollection'
import PouleCollection, { Poule, TeamScore } from './input/PouleCollection'

class ScoreCalculator {
    games: GameCollection
    poules: PouleCollection

    constructor(games: GameCollection, poules: PouleCollection) {
        this.games = games
        this.poules = poules
    }

    processGames(): Poule[] {
        for (const game of this.games.items) {
            this.processGame(game)
        }

        for (const poule of this.poules.items) {
            let teamScores = this.sortTeamScores(poule)

            poule.teamScores = teamScores.map((ts, index) => {
                ts.rank = index
                return ts
            })
        }

        return this.poules.items
    }

    sortTeamScores(poule: Poule): TeamScore[] {
        return poule.teamScores.sort((a, b) => {
            if (a.points < b.points) {
                return 1
            }
            if (a.points > b.points) {
                return -1
            }

            if (a.goalsDifference < b.goalsDifference) {
                return 1
            }
            if (a.goalsDifference > b.goalsDifference) {
                return -1
            }

            if (a.goalsFor < b.goalsFor) {
                return 1
            }
            if (a.goalsFor > b.goalsFor) {
                return -1
            }

            const test = this.games.items.filter(
                (g) =>
                    (g.homeTeamId === a.teamId && g.awayTeamId == b.teamId) ||
                    (g.awayTeamId === a.teamId && g.homeTeamId == b.teamId)
            )

            let pointsA = 0
            let pointsB = 0
            for (const game of test) {
                pointsA += this.getPointsForGame(a.teamId, game)
                pointsB += this.getPointsForGame(b.teamId, game)
            }

            if (pointsA < pointsB) {
                return 1
            }
            if (pointsA > pointsB) {
                return -1
            }

            return 0
        })
    }

    getPointsForGame(teamId: string, game: Game): number {
        var goalsFor = game.homeTeamId == teamId ? game.homeScore : game.awayScore
        var goalsAgainst = game.homeTeamId == teamId ? game.awayScore : game.homeScore

        if (goalsFor == null || goalsAgainst == null) {
            return 0
        }

        if (goalsFor > goalsAgainst) {
            return 3
        } else if (goalsFor < goalsAgainst) {
            return 0
        }
        return 1
    }

    private processGame(game: Game) {
        if (game.homeScore == null || game.awayScore == null) {
            return
        }

        this.processScore(
            game.pouleId,
            game.homeTeamId,
            game.homeScore,
            game.awayScore,
            game.status
        )
        this.processScore(
            game.pouleId,
            game.awayTeamId,
            game.awayScore,
            game.homeScore,
            game.status
        )
    }

    private processScore(
        pouleId: string,
        teamId: string,
        goalsFor: number,
        goalsAgainst: number,
        status: GameStatus
    ) {
        const poule = this.poules.findById(pouleId)
        const teamScore = poule.teamScores.find((t) => t.teamId === teamId)
        if (!teamScore) {
            throw new Error(`Failed to find team '${teamId}' in poule '${pouleId}'`)
        }

        teamScore.gamesPlayed++

        teamScore.goalsFor += goalsFor
        teamScore.goalsAgainst += goalsAgainst
        teamScore.goalsDifference += goalsFor - goalsAgainst

        if (status !== GameStatus.BothTeamNoShow) {
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
}

export default ScoreCalculator
