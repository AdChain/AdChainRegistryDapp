import React, { Component } from 'react'
import { Loader } from 'semantic-ui-react'

import './DomainClaimRewardInProgressContainer.css'

// I think this component can be deleted

class DomainClaimRewardInProgressContainer extends Component {
  constructor (props) {
    super()
  }

  render () {
    return (
      <div className='DomainClaimRewardInProgressContainer'>
        <div className='Content'>
          <div><strong>Reward claim in progress. </strong>
            <Loader indeterminate active inline />
          </div>
          <p>You will receive <strong>one</strong> MetaMask prompts:</p>
          <p><strong>First prompt:</strong> Claim reward from adChain Registry contract.</p>
        </div>
      </div>
    )
  }
}

export default DomainClaimRewardInProgressContainer
