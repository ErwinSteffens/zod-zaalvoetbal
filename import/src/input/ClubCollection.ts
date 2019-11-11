import * as fs from 'fs'
import { slug } from '../utils'

export interface Club {
    inputName: string
    id: string
    name: string
    contact: string
    contactPhone: string
    contactEmail: string
}

class ClubCollection {
    inputFile: string
    clubs: Club[]

    constructor(inputFile: string) {
        this.inputFile = inputFile

        this.read()
    }

    private read() {
        this.clubs = JSON.parse(fs.readFileSync('./input/clubs.json').toString()) as Club[]

        this.clubs = this.clubs.map(c => {
            return Object.assign({ id: slug(c.name) }, c)
        })

        console.log(`Found ${this.clubs.length} clubs in input`)
    }

    findByInputName(inputName: string) {
        const result = this.clubs.find(c => c.inputName == inputName)
        if (!result) {
            throw new Error(`Club with input name ${inputName} not found`)
        }
        return result
    }

    save(outputDir: string) {
        console.log(`Saving '${this.clubs.length}' clubs`)

        const json = JSON.stringify(
            this.clubs,
            (key, value) => {
                if (key === 'inputName') {
                    return undefined
                }
                return value
            },
            2
        )
        fs.writeFileSync(`${outputDir}/club.json`, json)
    }
}

export default ClubCollection
