import React, { Component } from 'react'
import toastr from 'toastr'

import registry from '../services/registry'

import './DomainVoteRevealInProgressContainer.css'

class DomainVoteRevealInProgressContainer extends Component {
  constructor (props) {
    super()

  }

  render () {
    return (
      <div className='DomainVoteRevealInProgressContainer'>
        <div className='Content'>
          <p><strong>Vote reveal in progress.</strong></p>
          <p>You will receive <strong>one</strong> MetaMask prompts:</p>
          <p><strong>First prompt:</strong> Submit vote reveal hash to the adChain Registry PLCR contract.</p>
        </div>
      </div>
    )
  }
}

export default DomainVoteRevealInProgressContainer
