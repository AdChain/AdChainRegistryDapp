import React, { Component } from 'react'
import toastr from 'toastr'

import registry from '../services/registry'

import './DomainVoteCommitInProgressContainer.css'

class DomainVoteCommitInProgressContainer extends Component {
  constructor (props) {
    super()

  }

  render () {
    return (
      <div className='DomainVoteCommitInProgressContainer'>
        <div className='Content'>
          <p><strong>Vote commit in progress.</strong></p>
          <p>You will receive <strong>two</strong> MetaMask prompts:</p>
          <p><strong>First prompt:</strong> Allow adChain Registry contract to transfer adToken deposit from your account.</p>
          <p><strong>Second prompt:</strong> Submit vote commit to the adChain Registry PLCR contract.</p>
        </div>
      </div>
    )
  }
}

export default DomainVoteCommitInProgressContainer
