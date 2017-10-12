import React, { Component } from 'react'
import { Loader } from 'semantic-ui-react'

import './DomainVoteCommitInProgressContainer.css'

class DomainVoteCommitInProgressContainer extends Component {
  constructor (props) {
    super()
  }

  render () {
    return (
      <div className='DomainVoteCommitInProgressContainer'>
        <div className='Content'>
          <div><strong>Vote commit in progress. </strong>
            <Loader indeterminate active inline />
          </div>
          <p>You will receive <strong>three</strong> MetaMask prompts:</p>
          <p><strong>First prompt:</strong> Allow adChain Registry PLCR contract to transfer adToken deposit from your account.</p>
          <p><strong>Second prompt:</strong> Request voting rights from the adChain Registry PLCR contract.</p>
          <p><strong>Third prompt:</strong> Submit vote commit to the adChain Registry PLCR contract.</p>
        </div>
      </div>
    )
  }
}

export default DomainVoteCommitInProgressContainer
