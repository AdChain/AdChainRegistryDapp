const moment = require('moment')
const pify = require('pify')
const {createEvent} = require('ics')

function generateReminder ({
  title = '',
  description = '',
  start = moment(),
  url = 'https://example.com'
}) {
  const startArray = [
    start.year(),
    start.month(),
    start.date(),
    start.hour(),
    start.minute()
  ]

  return pify(createEvent)({
    uid: `${Date.now()}`,
    duration: {
      minutes: 60
    },
    start: startArray,
    title,
    description,
    // url is required
    url
  })
}

export default generateReminder
