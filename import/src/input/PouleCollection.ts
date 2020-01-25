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
    halfCompetition: boolean
    isFinished: boolean
    temporary: boolean
    teamScores: TeamScore[]
}

class PouleCollection {
    items: Poule[]

    constructor() {
        this.items = []
    }

    add(poule: Poule) {
        this.items.push(poule)
    }

    findById(pouleId: string) {
        const poule = this.items.find(t => t.id == pouleId)
        if (!poule) {
            throw new Error(`Team with ID '${pouleId}' not found`)
        }
        return poule
    }

    getPouleForTeam(homeTeamId: string): Poule {
        return this.items.find(p => p.teamScores.some(t => t.teamId == homeTeamId))
    }

    save(outputDir: string) {
        console.log(`Saving '${this.items.length}' poules`)

        const json = JSON.stringify(this.items, null, 2)
        fs.writeFileSync(`${outputDir}/poule.json`, json)
    }
}

export default PouleCollection
