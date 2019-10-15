const puppeteer = require('puppeteer')
const rimraf = require('rimraf')
const fs = require('fs')

const baseUrl = 'https://zod-zaalvoetbal.web.app/'

const mkdir = path => {
    rimraf.sync(path)
    fs.mkdirSync(path, { recursive: true })
}

const createPdfFile = async (url, filePath) => {
    const browser = await puppeteer.launch()
    const page = await browser.newPage()
    await page.goto(url)
    await page.pdf({
        path: `static/downloads/${filePath}`,
        format: 'A4',
        margin: {
            top: '40px',
            bottom: '40px',
            left: '40px',
            right: '40px'
        }
    })
    await browser.close()
}

console.log('Fetching locations...')
let locations = JSON.parse(fs.readFileSync('src/data/location.json'))
console.log(`${locations.length} locations found.`)

const run = async () => {
    console.log('Start creating game sheets...')

    mkdir('static/downloads')
    await createPdfFile(`${baseUrl}/spelregels`, `Spelregels.pdf`)

    mkdir('static/downloads/games')
    const promisesGames = locations.map(location => {
        return createPdfFile(
            `${baseUrl}/sheets/games/${location.id}`,
            `games/Programma - ${location.venue}.pdf`
        )
    })
    await Promise.all(promisesGames)

    mkdir('static/downloads/scores')
    const promisesScores = locations.map(location => {
        return createPdfFile(
            `${baseUrl}/sheets/scores/${location.id}`,
            `scores/Uitslagen - ${location.venue}.pdf`
        )
    })
    await Promise.all(promisesScores)

    console.log('Done creating game sheets.')
}

run()
    .then(() => {
        process.exit(0)
    })
    .catch(err => {
        console.error(err)
        process.exit(1)
    })
