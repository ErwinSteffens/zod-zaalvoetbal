import * as fs from 'fs'
import { slug } from '../utils'

export interface GameLocation {
    inputName: string | null
    id: string
    venue: string
    address: string
    postalCode: string
    city: string
    placeId: string
}

class LocationCollection {
    inputFile: string
    locations: GameLocation[]

    constructor(inputFile: string) {
        this.inputFile = inputFile

        this.read()
    }

    private read() {
        this.locations = JSON.parse(
            fs.readFileSync('./input/locations.json').toString()
        ) as GameLocation[]

        this.locations = this.locations.map(c => {
            return Object.assign({ id: slug(c.venue) }, c)
        })

        console.log(`Found ${this.locations.length} locations in input`)
    }

    findByInputName(inputName: string) {
        const result = this.locations.find(c => c.inputName == inputName)
        if (!result) {
            throw new Error(`Location with input name ${inputName} not found`)
        }
        return result
    }

    save(outputDir: string) {
        console.log(`Saving '${this.locations.length}' locations`)

        const json = JSON.stringify(
            this.locations,
            (key, value) => {
                if (key === 'inputName') {
                    return undefined
                }
                return value
            },
            2
        )
        fs.writeFileSync(`${outputDir}/location.json`, json)
    }
}

export default LocationCollection
