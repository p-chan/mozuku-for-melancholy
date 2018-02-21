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

controller.hears('anime (.+)$', 'direct_mention', (bot, message) => {
  if (message.match[1] == 'rand') {
    bot.reply(message, 'https://animeloop.org/api/v2/rand/loop-360p.gif')
  } else {
    fetch(`https://animeloop.org/api/v2/search/series?value=${message.match[1]}`)
      .then(res => res.json())
      .then(json => {
        if (json.data.length) {
          const animeId = json.data[0].id

          fetch(`https://animeloop.org/api/v2/rand/loop?seriesid=${animeId}`)
            .then(res => res.json())
            .then(json => {
              bot.reply(message, json.data[0].files.gif_360p)
            })
        } else {
          bot.reply(message, 'Not Found')
        }
      })
  }
})

// Server

http.createServer((req, res) => {
  res.end('OK!')
}).listen(3000)

// Debug

process.on('unhandledRejection', console.dir)
