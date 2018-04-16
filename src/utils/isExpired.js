import moment from 'moment'

export const isExpired = (end) => {
  if (end === null) {
    console.log('No time supplied to isExpired function')
    return true
  }
  const now = moment().unix()
  if (!end) return false
  return end < now
}
