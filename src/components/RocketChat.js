import React, { Component } from 'react'

class RocketChat extends Component {
  constructor (props) {
    super()
  }

  render () {
    return (
      <div>
        <div id='rocket'>
          <iframe src='https://chat.adchain.com/channel%2Fadchain-registry' height='500' style={{height: '93vh', width: '100%'}} />
        </div>
      </div>
    )
  }
}

export default RocketChat
