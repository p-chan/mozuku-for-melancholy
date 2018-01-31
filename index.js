const Botkit = require('botkit')
const dotenv = require('dotenv')
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

// Server

http.createServer((req, res) => {
  res.end('OK!')
}).listen(3000)
