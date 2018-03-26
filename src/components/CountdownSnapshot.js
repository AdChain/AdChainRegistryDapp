import React, { Component } from 'react'
import moment from 'moment'
import pad from 'left-pad'

import './CountdownSnapshot.css'

class CountdownSnapshot extends Component {
  constructor (props) {
    super()

    const endDate = moment.unix(props.endDate)
    const now = moment()
    const diff = endDate.diff(now, 'seconds')
    const dur = moment.duration(diff, 'seconds')

    this.state = {
      endDate: endDate,
      days: `${pad(dur.days(), 2, 0)}`,
      hours: `${pad(dur.hours(), 2, 0)}`,
      minutes: `${pad(dur.minutes(), 2, 0)}`
    }
  }

  render () {
    const { days, hours, minutes } = this.state

    return (
      <span className='StageEndsCountdownContainer'>
        <span className='StageEndsTime'>
          {days <= 0 ? '00' : days}
          <span className='StageEndsLabel'>D</span>
        </span>
        <span className='StageEndsTimeSeparator' />
        <span className='StageEndsTime'>
          {hours <= 0 ? '00' : hours}
          <span className='StageEndsLabel'>H</span>
        </span>
        <span className='StageEndsTimeSeparator'>:</span>
        <span className='StageEndsTime'>
          {minutes <= 0 ? '00' : minutes}
          <span className='StageEndsLabel'>M</span>
        </span>
      </span>
    )
  }
}

export default CountdownSnapshot
