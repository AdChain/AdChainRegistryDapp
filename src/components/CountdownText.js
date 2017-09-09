import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import pad from 'left-pad'

import './CountdownText.css'

class CountdownText extends Component {
  constructor (props) {
    super()

    this.state = {
      endDate: props.endDate || moment(),
      countdown: '00:00:00',
      isExpired: false
    }

    this.tick()

    this.interval = setInterval(() => {
      this.tick()
    }, 1e3)
  }

  componentWillUnmount () {
    window.clearInterval(this.interval)
  }

  componentWillReceiveProps (props) {
    this.setState({
      endDate: props.endDate
    })
  }

  render () {
    const {countdown, isExpired} = this.state

    return (
      <span className={`CountdownText ${isExpired ? 'expired' : ''}`}>
        {countdown}
      </span>
    )
  }

  tick () {
    const {endDate} = this.state

    if (!endDate) {
      this.setState({
        countdown: '00:00:00'
      })
      return false
    }

    const now = moment()
    const diff = endDate.diff(now, 'seconds')

    if (diff <= 0) {
      this.setState({
        countdown: '00:00:00',
        isExpired: true
      })
      return false
    }

    const dur = moment.duration(diff, 'seconds')
    const countdown = `${pad(dur.hours(), 2, 0)}:${pad(dur.minutes(), 2, 0)}:${pad(dur.seconds(), 2, 0)}`

    this.setState({
      countdown,
      isExpired: false
    })
  }
}

CountdownText.propTypes = {
  endDate: PropTypes.object
}

export default CountdownText
