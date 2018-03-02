const Botkit = require('botkit')
const dotenv = require('dotenv')
const fetch = require('node-fetch')
const GoogleImages = require('google-images')
const helper = require('./helper')
const http = require('http')


const client = new GoogleImages(process.env.CSE_ID, process.env.CSE_KEY)
const env = process.env.NODE_ENV || 'development'

if (env === 'development') {
  dotenv.config()
}

if (!process.env.SLACK_TOKEN) {
  console.error('[ERR] Does not set SLACK_TOKEN')
  process.exit(1)
}

const controller = Botkit.slackbot({
  debug: false,
  retry: true
})

const bot = controller.spawn({ // eslint-disable-line
  token: process.env.SLACK_TOKEN
}).startRTM()

// Events

controller.hears('ping', 'direct_mention', (bot, message) => {
  bot.reply(message, 'pong')
})

controller.hears('image (.+)$', 'direct_mention', (bot, message) => {
  client.search(message.match[1])
    .then(images => {
      const rnd = Math.floor(Math.random() * 9)
      bot.reply(message, images[rnd].url)
    })
})

controller.hears('anime (.+)$', 'direct_mention', async (bot, message) => {
  const lsitRes = await fetch(`https://animeloop.org/api/v2/search/series?value=${message.match[1]}`)
  const listJson = await lsitRes.json()

  if (listJson.data.length) {
    const animeId = listJson.data[0].id

    const gifRes = await fetch(`https://animeloop.org/api/v2/rand/loop?seriesid=${animeId}`)
    const gifJson = await gifRes.json()

    bot.reply(message, gifJson.data[0].files.gif_360p)
  } else {
    bot.reply(message, 'Not Found')
  }
})

/**
 * 突然の死
 */
controller.hears('balloon (.+)$', 'direct_mention', (bot, message) => {
  bot.reply(message, generate(message.match[1]))
  function generate(message) {
    const headerPrefix = '```\n＿人'
    const headerCenter = '人'
    const headerSuffix = '人＿'
    const bodyPrefix = '＞　'
    const bodySuffix = '　＜'
    const footerPrefix = '￣Y'
    const footerCenter = '^Y'
    const footerSuffix = '￣\n```'
    const renderBody = `${bodyPrefix}${message}${bodySuffix}`
    let renderHeader = headerPrefix
    let renderFooter = footerPrefix
    for (let i = 0; i < message.length; i++) {
      renderHeader += headerCenter
      renderFooter += footerCenter
    }
    renderHeader += headerSuffix
    renderFooter += footerSuffix
    return `${renderHeader}\n${renderBody}\n${renderFooter}`
  }
})

// Server

http.createServer((req, res) => {
  res.end('OK!')
}).listen(3000)

// Debug

process.on('unhandledRejection', console.dir)
