import React from 'react'
import PropTypes from 'prop-types'
import Tbox from 'trollbox'

import './Trollbox.css'

function Trollbox (props) {
  const { channel, user } = props

  const config = {
    container: '#trollbox',
    firebase: {
      apiKey: 'AIzaSyAW50YNzjI4LAQo4kEWb0UwhegCTG9hSf8',
      authDomain: 'trollbox-d802b.firebaseapp.com',
      databaseURL: 'https://trollbox-d802b.firebaseio.com',
      projectId: 'trollbox-d802b',
      storageBucket: 'trollbox-d802b.appspot.com',
      messagingSenderId: '770197609793'
    },
    channel,
    user
  }

  setTimeout(() => {
    const trollbox = new Tbox(config)
  }, 0)

  return (<div className='BoxFrame' id='trollbox'></div>)
}

Trollbox.propTypes = {
  channel: PropTypes.string,
  user: PropTypes.string
}

export default Trollbox
