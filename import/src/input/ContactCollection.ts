import * as fs from 'fs'
import { slug } from '../utils'

export interface Contact {
  description?: string
  name: string
  email: string
  clubId?: string
}

class ContactCollection {
  private items: Contact[]

  constructor() {
    this.items = []
  }

  private fromFile(inputFile: string) {
    this.items = JSON.parse(fs.readFileSync(inputFile).toString()) as Contact[]

    console.log(`Found ${this.items.length} contacts input`)
  }

  public add(contact: Contact) {
    this.items.push(contact)
  }

  public findByName(name: string) {
    const result = this.items.find((c) => c.name == name)
    if (!result) {
      throw new Error(`Contact with name ${name} not found`)
    }
    return result
  }

  public save(outputDir: string) {
    console.log(`Saving '${this.items.length}' contacts`)

    const json = JSON.stringify(this.items, null, 2)
    fs.writeFileSync(`${outputDir}/contact.json`, json)
  }
}

export default ContactCollection
