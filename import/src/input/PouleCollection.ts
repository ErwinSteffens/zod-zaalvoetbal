import * as fs from 'fs'

export class TeamScore {
    constructor(teamId: string) {
        this.teamId = teamId
    }

    teamId: string
    rank: number = 0
    points: number = 0
    gamesPlayed: number = 0
    gamesWon: number = 0
    gamesLost: number = 0
    gamesDraw: number = 0
    goalsFor: number = 0
    goalsAgainst: number = 0
    goalsDifference: number = 0
}

export class Poule {
    id: string
    name: string
    teamScores: TeamScore[]
}

class PouleCollection {
    inputFile: string
    poules: Poule[]

    constructor() {
        this.poules = []
    }

    add(poule: Poule) {
        this.poules.push(poule)
    }

    findById(pouleId: string) {
        const poule = this.poules.find(t => t.id == pouleId)
        if (!poule) {
            throw new Error(`Team with ID '${pouleId}' not found`)
        }
        return poule
    }

    save(outputDir: string) {
        console.log(`Saving '${this.poules.length}' poules`)

        const json = JSON.stringify(this.poules, null, 2)
        fs.writeFileSync(`${outputDir}/poule.json`, json)
    }
}

export default PouleCollection
