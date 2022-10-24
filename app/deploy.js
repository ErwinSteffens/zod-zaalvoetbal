const FtpDeploy = require('ftp-deploy')
const ftpDeploy = new FtpDeploy()
const dotenv = require('dotenv')

dotenv.config()

const config = {
  user: process.env.FTP_USER,
  password: process.env.FTP_PASS,
  host: process.env.FTP_HOST,
  port: 21,
  remoteRoot: 'httpdocs',
  localRoot: __dirname + '/public',
  include: ['**/*'],
  exclude: [],
  deleteRemote: false,
  continueOnError: true,
  forcePasv: true,
}

ftpDeploy.on('uploading', function (data) {
  console.log(
    `Uploading: ${data.filename} - ${data.transferredFileCount} of ${data.totalFilesCount}`
  )
})

ftpDeploy.on('upload-error', function (data) {
  console.log(`Error: ${data.filename} - ${data.err}`)
})

ftpDeploy
  .deploy(config)
  .then((res) => console.log('Deployment done'))
  .catch((err) => console.log(err))
