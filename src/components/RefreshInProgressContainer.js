import React, { Component } from 'react'
import { Loader } from 'semantic-ui-react'

import './RefreshInProgressContainer.css'

class RefreshInProgressContainer extends Component {
  constructor (props) {
    super()
  }

  render () {
    return (
      <div className='RefreshInProgressContainer'>
        <div className='Content'>
          <div><strong>Refresh in progress. </strong>
            <Loader indeterminate active inline />
          </div>
          <p>You will receive <strong>one</strong> MetaMask prompt:</p>
          <p>Allow adChain Registry contract to transfer adToken deposit from your account.</p>
        </div>
      </div>
    )
  }
}

export default RefreshInProgressContainer
