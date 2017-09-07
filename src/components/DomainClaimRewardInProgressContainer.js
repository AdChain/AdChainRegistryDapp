import React, { Component } from 'react'
import { Loader } from 'semantic-ui-react'

import './DomainClaimRewardInProgressContainer.css'

class DomainClaimRewardInProgressContainer extends Component {
  constructor (props) {
    super()
  }

  render () {
    return (
      <div className='DomainClaimRewardInProgressContainer'>
        <div className='Content'>
          <p><strong>Reward claim in progress. </strong>
            <Loader indeterminate active inline />
          </p>
          <p>You will receive <strong>one</strong> MetaMask prompts:</p>
          <p><strong>First prompt:</strong> Claim reward from adChain Registry contract.</p>
        </div>
      </div>
    )
  }
}

export default DomainClaimRewardInProgressContainer
