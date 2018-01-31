const fetch = require('node-fetch')
const dotenv = require('dotenv')

const env = process.env.NODE_ENV || 'development'

if (env === 'development') {
  dotenv.config()
}

module.exports = {
  getIdByName: async (name) => {
    let channelId = ''

    const endpoint = `https://slack.com/api/channels.list?token=${process.env.SLACK_TOKEN}`
    const response = await fetch(endpoint, 'GET').then(res => {
      return res.json()
    })

    response.channels.forEach((el) => {
      if (el.name === name) {
        channelId = el.id
      }
    })

    return channelId
  }
}
