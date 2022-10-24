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
  private items: Club[]

  constructor(inputFile: string) {
    this.fromFile(inputFile)
  }

  private fromFile(inputFile: string) {
    this.items = JSON.parse(fs.readFileSync(inputFile).toString()) as Club[]

    this.items = this.items.map((c) => {
      return Object.assign({ id: slug(c.name) }, c)
    })

    console.log(`Found ${this.items.length} clubs in input`)
  }

  findByInputName(inputName: string) {
    const result = this.items.find((c) => c.inputName == inputName)
    if (!result) {
      throw new Error(`Club with input name ${inputName} not found`)
    }
    return result
  }

  save(outputDir: string) {
    console.log(`Saving '${this.items.length}' clubs`)

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
    fs.writeFileSync(`${outputDir}/club.json`, json)
  }
}

export default ClubCollection
