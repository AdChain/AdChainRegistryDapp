import React, { Component } from 'react'

class AdChainList extends Component {
  constructor (props) {
    super()
  }

  render () {
    return (
      <div>
        <div id='rocket'>

          <iframe title='adchaintools'src='https://tools.adchain.com' height='500' style={{height: '100vh', width: '100%'}} />

        </div>
      </div>
    )
  }
}

export default AdChainList
