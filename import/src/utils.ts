import slugify from 'slugify'

const slugOptions: any = { remove: /[*+~.()'"!:@]/g, replacement: '-', lower: true }

export function slug(input: string) {
    return slugify(input, slugOptions)
}
