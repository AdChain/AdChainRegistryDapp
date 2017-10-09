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
      countdown: '00:00:00',
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
    const {countdown, isExpired} = this.state

    return (
      <span className={`CountdownText ${isExpired ? 'expired' : ''}`}>
        {countdown}
      </span>
    )
  }

  tick () {
    const {endDate, onExpireCalled} = this.state

    if (!endDate) {
      if (this._isMounted) {
        this.setState({
          countdown: '00:00:00',
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
          countdown: '00:00:00',
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
    const countdown = `${pad(dur.hours(), 2, 0)}:${pad(dur.minutes(), 2, 0)}:${pad(dur.seconds(), 2, 0)}`

    if (this._isMounted) {
      this.setState({
        countdown,
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
