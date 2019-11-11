import * as fs from 'fs'

export interface Team {
    id: string
    clubId: string
    name: string
    pouleId: string
}

class TeamCollection {
    inputFile: string
    teams: Team[]

    constructor() {
        this.teams = []
    }

    add(game: Team) {
        this.teams.push(game)
    }

    findById(teamId: string) {
        const team = this.teams.find(t => t.id == teamId)
        if (!team) {
            throw new Error(`Team with ID '${teamId}' not found`)
        }
        return team
    }

    save(outputDir: string) {
        console.log(`Saving '${this.teams.length}' teams`)

        const json = JSON.stringify(this.teams, null, 2)
        fs.writeFileSync(`${outputDir}/team.json`, json)
    }
}

export default TeamCollection
