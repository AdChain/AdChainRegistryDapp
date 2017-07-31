import React, { Component } from 'react'

import './MainTopbar.css'

class MainTopbar extends Component {
  render () {
    const address = '0x06905127EcB3f59c46a468489e5b262d7AfCc2e8'
    const adtBalance = 30452

    return (
      <div className='MainTopbar'>
        <div className='ui top attached menu inverted'>
          <div className='item'>
            {address}
          </div>
          <div className='menu right'>
            <div className='item'>
              ADT: {adtBalance}
            </div>
          </div>
        </div>

      </div>
    )
  }
}

export default MainTopbar
