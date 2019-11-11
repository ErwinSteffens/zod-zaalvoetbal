import * as fs from 'fs'

export interface Game {
    round: number
    time: Date
    homeTeamId: string
    homeScore: number
    awayTeamId: string
    awayScore: number
    locationId: string
}

class GameCollection {
    inputFile: string
    games: Game[]

    constructor() {
        this.games = []
    }

    add(game: Game) {
        this.games.push(game)
    }

    save(outputDir: string) {
        console.log(`Saving '${this.games.length}' games`)

        const json = JSON.stringify(
            this.games,
            (key, value) => {
                if (key === 'inputName') {
                    return undefined
                }
                return value
            },
            2
        )
        fs.writeFileSync(`${outputDir}/game.json`, json)
    }
}

export default GameCollection
