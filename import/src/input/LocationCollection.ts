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
    private items: GameLocation[]

    constructor(inputFile: string) {
        this.read(inputFile)
    }

    private read(inputFile: string) {
        this.items = JSON.parse(fs.readFileSync(inputFile).toString()) as GameLocation[]

        this.items = this.items.map((c) => {
            return Object.assign({ id: slug(c.venue) }, c)
        })

        console.log(`Found ${this.items.length} locations in input`)
    }

    findByInputName(inputName: string) {
        const result = this.items.find((c) => c.inputName == inputName)
        if (!result) {
            throw new Error(`Location with input name ${inputName} not found`)
        }
        return result
    }

    save(outputDir: string) {
        console.log(`Saving '${this.items.length}' locations`)

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
        fs.writeFileSync(`${outputDir}/location.json`, json)
    }
}

export default LocationCollection
