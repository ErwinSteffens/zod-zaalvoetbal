import * as fs from 'fs'

export enum GameStatus {
  Planned = 'planned',
  Played = 'played',
  Cancelled = 'cancelled',
  BothTeamNoShow = 'both-team-no-show',
  HomeTeamNoShow = 'home-team-no-show',
  AwayTeamNoShow = 'away-team-no-show',
}

export interface Game {
  round: number
  time: Date
  status: GameStatus
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

  getGamesForTeam(teamId: string) {
    return this.items.filter((game) => {
      return game.homeTeamId === teamId || game.awayTeamId === teamId
    })
  }

  getGamesForLocation(locationId: string) {
    return this.items.filter((game) => game.locationId === locationId)
  }

  save(outputDir: string) {
    console.log(`Saving '${this.items.length}' games`)

    const json = JSON.stringify(this.items, null, 2)
    fs.writeFileSync(`${outputDir}/game.json`, json)
  }
}

export default GameCollection
