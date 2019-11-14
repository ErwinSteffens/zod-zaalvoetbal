import * as fs from 'fs'

export interface Game {
    round: number
    time: Date
    pouleId: string
    homeTeamId: string
    homeScore: number
    awayTeamId: string
    awayScore: number
    locationId: string
    field: number | null
}

class GameCollection {
    items: Game[]

    constructor() {
        this.items = []
    }

    add(game: Game) {
        this.items.push(game)
    }

    save(outputDir: string) {
        console.log(`Saving '${this.items.length}' games`)

        const json = JSON.stringify(
            this.items,
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
