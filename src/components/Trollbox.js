import React from 'react'
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

function TrollboxComponent (props) {
  const { channel } = props
  const user = (registry.getAccount() || '').substr(0, 8)

  setTimeout(() => {
    trollbox.render()
    trollbox.setChannel(channel)
    trollbox.setUser(user)
  }, 0)

  return (<div className='' id='trollbox'></div>)
}

TrollboxComponent.propTypes = {
  channel: PropTypes.string,
  user: PropTypes.string
}

export default TrollboxComponent
