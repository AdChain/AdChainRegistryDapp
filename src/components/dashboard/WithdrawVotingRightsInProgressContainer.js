import React, { Component } from 'react'
import { Loader } from 'semantic-ui-react'

import './WithdrawVotingRightsInProgressContainer.css'

class WithdrawVotingRightsInProgressContainer extends Component {
  constructor (props) {
    super()
  }

  render () {
    return (
      <div className='WithdrawVotingRightsInProgressContainer overflow-y'>
        <div className='Content'>
          <div><strong>Withdrawal in progress. </strong>
            <Loader indeterminate active inline />
          </div>
          <p>You will receive <strong>one</strong> MetaMask prompt:</p>
          <p><strong>First prompt:</strong> Withdraw voting rights from the adChain Registry PLCR contract.</p>
        </div>
      </div>
    )
  }
}

export default WithdrawVotingRightsInProgressContainer
