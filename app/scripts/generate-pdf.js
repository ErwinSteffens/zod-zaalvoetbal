const puppeteer = require('puppeteer')
const rimraf = require('rimraf')
const fs = require('fs')
const { spawn } = require('child_process')
const exec = require('child_process').exec
const waitOn = require('wait-on')

const baseUrl = 'http://localhost:9000/'

process.env.TZ = 'Europe/Amsterdam'

async function runGatsby() {
  console.log('Starting Gatsby serve')

  let gatsby = spawn('gatsby', ['serve'], { detached: false, stdio: 'inherit' })

  gatsby.on('exit', (code) => {
    console.log(`child process exited with code ${code}`)
    process.exit(1)
  })

  console.log('Starting waiting on Gatsby to run')

  await waitOn({
    resources: [baseUrl],
    delay: 1000,
    interval: 100,
    timeout: 30000,
  })

  console.log('Gatsby is running')

  return gatsby
}

const mkdir = (path) => {
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
      right: '40px',
    },
  })
  await browser.close()
}

console.log('Fetching locations...')
let locations = JSON.parse(fs.readFileSync('src/data/location.json'))
console.log(`${locations.length} locations found.`)

const run = async () => {
  let gatsbyProcess = await runGatsby()

  console.log('Start creating game rule sheet')

  mkdir('static/downloads')
  await createPdfFile(`${baseUrl}/spelregels`, `Spelregels.pdf`)

  console.log('Done creating game rule sheet')

  console.log('Start creating game sheets')

  mkdir('static/downloads/games')
  const promisesGames = locations.map((location) => {
    return createPdfFile(
      `${baseUrl}/sheets/games/${location.id}`,
      `games/Programma - ${location.venue}.pdf`
    )
  })
  await Promise.all(promisesGames)

  console.log('Done creating game sheets')

  console.log('Creating score sheets')

  mkdir('static/downloads/scores')
  const promisesScores = locations.map((location) => {
    return createPdfFile(
      `${baseUrl}/sheets/scores/${location.id}`,
      `scores/Uitslagen - ${location.venue}.pdf`
    )
  })
  await Promise.all(promisesScores)

  console.log('Done creating score sheets')

  console.log('Killing Gatsby')

  gatsbyProcess.kill()

  console.log('Killing Gatsby done')
}

run()
  .then(() => {
    process.exit(0)
  })
  .catch((err) => {
    console.error(err)
    process.exit(1)
  })
