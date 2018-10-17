import React, { Component } from 'react'
import moment from 'moment'
import pad from 'left-pad'

import './CountdownSnapshot.css'

class CountdownSnapshot extends Component {
  render () {
    const endDate = moment.unix(this.props.endDate)
    const now = moment()
    const diff = endDate.diff(now, 'seconds')
    const dur = moment.duration(diff, 'seconds')
    const days = `${pad(dur.days(), 2, 0)}`
    const hours = `${pad(dur.hours(), 2, 0)}`
    const minutes = `${pad(dur.minutes(), 2, 0)}`

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
