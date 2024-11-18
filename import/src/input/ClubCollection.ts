import * as fs from 'fs'
import { slug } from '../utils'

export interface Club {
  id: string
  name: string
  email: string
  managedVenue: string
}

class ClubCollection {
  private _items: Club[]

  constructor() {
    this._items = []
  }

  public add(club: Club) {
    this.items.push(club)
  }

  public findByName(name: string) {
    const result = this._items.find((c) => c.name == name)
    if (!result) {
      throw new Error(`Club with name ${name} not found`)
    }
    return result
  }

  public findClubsManagingVenue(venue: string) {
    return this._items.filter((c) => c.managedVenue == venue);
  }

  public get items() {
    return this._items
  }

  public save(outputDir: string) {
    console.log(`Saving '${this._items.length}' clubs`)

    const json = JSON.stringify(this._items, null, 2)
    fs.writeFileSync(`${outputDir}/club.json`, json)
  }
}

export default ClubCollection
