import * as fs from 'fs'
import { slug } from '../utils'

export interface GameLocation {
  id: string
  name: string | null
  venue: string
  address: string
  postalCode: string
  city: string
  placeId: string
}

class LocationCollection {
  private _items: GameLocation[]

  constructor(inputFile: string) {
    this.read(inputFile)
  }

  private read(inputFile: string) {
    this._items = JSON.parse(fs.readFileSync(inputFile).toString()) as GameLocation[]

    this._items = this._items.map((c) => {
      return Object.assign({ id: slug(c.venue) }, c)
    })

    console.log(`  - Found ${this._items.length} locations in input`)
  }

  findByName(name: string) {
    const result = this._items.find((c) => c.name == name)
    if (!result) {
      throw new Error(`Location with name ${name} not found`)
    }
    return result
  }

  public get items() {
    return this._items
  }

  save(outputDir: string) {
    console.log(`Saving '${this._items.length}' locations`)

    const json = JSON.stringify(this._items, null, 2)
    fs.writeFileSync(`${outputDir}/location.json`, json)
  }
}

export default LocationCollection
