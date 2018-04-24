import React, { Component } from 'react'
import PropTypes from 'prop-types'
import moment from 'moment'
import pad from 'left-pad'

import './CountdownText.css'

class CountdownText extends Component {
  constructor (props) {
    super()

    const endDate = props.endDate

    this.state = {
      endDate: endDate || moment(),
      days: '00',
      hours: '00',
      minutes: '00',
      seconds: '00',
      isExpired: false,

      // expired if no endDate set on init
      onExpireCalled: !endDate
    }

    if (props.onExpire) {
      this.onExpire = props.onExpire.bind(this)
    }

    this.tick()

    this.interval = setInterval(() => {
      this.tick()
    }, 1e3)
  }

  componentDidMount () {
    this._isMounted = true
  }

  componentWillUnmount () {
    this._isMounted = false

    window.clearInterval(this.interval)
  }

  componentWillReceiveProps (props) {
    const endDate = props.endDate

    if (endDate) {
      const now = moment()
      const diff = endDate.diff(now, 'seconds')
      const isExpired = (diff <= 0)

      if (this._isMounted) {
        this.setState({
          endDate: endDate,
          isExpired,

          // don't call expired callback if immediately already expired
          onExpireCalled: isExpired
        })
      }
    }
  }

  render () {
    const {days, hours, minutes, seconds, isExpired} = this.state

    return (
      <div className={`CountdownText ${isExpired ? 'expired' : ''}`}>
        <div className='CountdownUnit'>
          {days}
          <span className='CountdownLabel'>days</span>
        </div>
        <div className='CountdownUnit'>
          {hours}
          <span className='CountdownLabel'>hours</span>
        </div>
        <div className='CountdownUnit'>
          {minutes}
          <span className='CountdownLabel'>minutes</span>
        </div>
        <div className='CountdownUnit'>
          {seconds}
          <span className='CountdownLabel'>seconds</span>
        </div>
      </div>
    )
  }

  tick () {
    const {endDate, onExpireCalled} = this.state

    if (!endDate) {
      if (this._isMounted) {
        this.setState({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
          isExpired: true
        })
      }

      return false
    }

    const now = moment()
    const diff = endDate.diff(now, 'seconds')

    if (diff <= 0) {
      if (this._isMounted) {
        this.setState({
          days: '00',
          hours: '00',
          minutes: '00',
          seconds: '00',
          isExpired: true
        })
      }

      if (!onExpireCalled) {
        if (this._isMounted) {
          this.setState({onExpireCalled: true})
        }

        this.onExpire()
      }
      return false
    }

    const dur = moment.duration(diff, 'seconds')
    const days = `${pad(dur.days(), 2, 0)}`
    const hours = `${pad(dur.hours(), 2, 0)}`
    const minutes = `${pad(dur.minutes(), 2, 0)}`
    const seconds = `${pad(dur.seconds(), 2, 0)}`
    // const countdown = `${pad(dur.days(), 2, 0)}:${pad(hours, 2, 0)}:${pad(dur.minutes(), 2, 0)}:${pad(dur.seconds(), 2, 0)}`

    if (this._isMounted) {
      this.setState({
        days,
        hours,
        minutes,
        seconds,
        isExpired: false
      })
    }
  }

  onExpire () {
    // default
  }
}

CountdownText.propTypes = {
  endDate: PropTypes.object,
  onExpire: PropTypes.func
}

export default CountdownText
