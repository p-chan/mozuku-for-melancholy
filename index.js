const Botkit = require('botkit')
const dotenv = require('dotenv')
const helper = require('./helper')
const http = require('http')

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

// Server

http.createServer((req, res) => {
  res.end('OK!')
}).listen(3000)
