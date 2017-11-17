import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Trollbox from 'trollbox'

import registry from '../services/registry'
import './Trollbox.css'

const firebase = {
  apiKey: 'AIzaSyAW50YNzjI4LAQo4kEWb0UwhegCTG9hSf8',
  authDomain: 'trollbox-d802b.firebaseapp.com',
  databaseURL: 'https://trollbox-d802b.firebaseio.com',
  projectId: 'trollbox-d802b',
  storageBucket: 'trollbox-d802b.appspot.com',
  messagingSenderId: '770197609793'
}

const config = {
  container: '#trollbox',
  firebase,
  delayRender: true
}

let trollbox = new Trollbox(config)

class TrollboxComponent extends Component {
  constructor (props) {
    super()

    let {
      channel
    } = props

    const user = (registry.getAccount() || '').substr(0, 8)

    this.state = {
      channel,
      user: user || 'anonymous'
    }
  }

  componentDidMount () {
    const {channel, user} = this.state
    trollbox.render()
    trollbox.setChannel(channel)
    trollbox.setUser(user)
  }

  componentWillReceiveProps (props) {
    const {channel: newChannel} = props
    const {channel} = this.state

    if (newChannel !== channel) {
      trollbox.setChannel(channel)
    }
  }

  render () {
    return (
      <div className='Trollbox' id='trollbox' />
    )
  }
}

TrollboxComponent.propTypes = {
  channel: PropTypes.string
  // user: PropTypes.string
}

export default TrollboxComponent
