import * as fs from 'fs'
import { slug } from '../utils'

export interface Club {
  inputName: string
  id: string
  name: string
  phone: string
  email: string
}

class ClubCollection {
  private _items: Club[]

  constructor(inputFile: string) {
    this.fromFile(inputFile)
  }

  private fromFile(inputFile: string) {
    this._items = JSON.parse(fs.readFileSync(inputFile).toString()) as Club[]

    this._items = this._items.map((c) => {
      return Object.assign({ id: slug(c.name) }, c)
    })

    console.log(`  - Found ${this._items.length} clubs in input`)
  }

  public findByInputName(inputName: string) {
    const result = this._items.find((c) => c.inputName == inputName)
    if (!result) {
      throw new Error(`Club with input name ${inputName} not found`)
    }
    return result
  }

  public get items() {
    return this._items
  }

  public save(outputDir: string) {
    console.log(`Saving '${this._items.length}' clubs`)

    const json = JSON.stringify(
      this._items,
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
