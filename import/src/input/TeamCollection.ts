import * as fs from 'fs'

export interface Team {
    id: string
    clubId: string
    name: string
    pouleId: string
    category: string
}

class TeamCollection {
    public items: Team[]

    constructor() {
        this.items = []
    }

    add(game: Team) {
        this.items.push(game)
    }

    findById(teamId: string) {
        const team = this.items.find((t) => t.id == teamId)
        if (!team) {
            throw new Error(`Team with ID '${teamId}' not found`)
        }
        return team
    }

    save(outputDir: string) {
        console.log(`Saving '${this.items.length}' teams`)

        const json = JSON.stringify(this.items, null, 2)
        fs.writeFileSync(`${outputDir}/team.json`, json)
    }
}

export default TeamCollection
