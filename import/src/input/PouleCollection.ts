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
  gamesMultiplier?: number
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
    const poule = this.items.find((t) => t.id == pouleId)
    if (!poule) {
      throw new Error(`Poule not found for id '${pouleId}'`)
    }
    return poule
  }

  getPouleForTeam(teamId: string): Poule {
    var poule = this.items.find((p) => p.teamScores.some((t) => t.teamId == teamId))
    if (!poule) {
      throw new Error(`Poule not found for team with id '${teamId}'`)
    }
    return poule
  }

  save(outputDir: string) {
    console.log(`Saving '${this.items.length}' poules`)

    const json = JSON.stringify(this.items, null, 2)
    fs.writeFileSync(`${outputDir}/poule.json`, json)
  }
}

export default PouleCollection
