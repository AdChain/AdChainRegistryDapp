import React, { Component } from 'react'
import { Loader } from 'semantic-ui-react'

import './DomainChallengeInProgressContainer.css'

class DomainChallengeInProgressContainer extends Component {
  constructor (props) {
    super()
  }

  render () {
    return (
      <div className='DomainChallengeInProgressContainer'>
        <div className='Content'>
          <p><strong>Challenge in progress. </strong>
            <Loader indeterminate active inline />
          </p>
          <p>You will receive <strong>two</strong> MetaMask prompts:</p>
          <p><strong>First prompt:</strong> Allow adChain Registry contract to transfer adToken deposit from your account.</p>
          <p><strong>Second prompt:</strong> Submit challenge to the adChain Registry contract.</p>
        </div>
      </div>
    )
  }
}

export default DomainChallengeInProgressContainer
