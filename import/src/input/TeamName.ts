class TeamNameParser {
    inputName: string
    teamName: string
    clubName: string

    constructor(inputName: string) {
        this.inputName = inputName

        this.parse(inputName)
    }

    private parse(name: string) {
        const regex = /(.+) ((?:JO|MO|M)\d+(?:-\d+)?)/
        const matches = name.match(regex)
        if (!matches) {
            throw new Error(`Team name failed to match regex: ${name}`)
        }

        this.clubName = matches[1]
        this.teamName = matches[2]
    }
}

export default TeamNameParser
