import React, { Component } from 'react'
import { Loader } from 'semantic-ui-react'

import './DomainVoteRevealInProgressContainer.css'

class DomainVoteRevealInProgressContainer extends Component {
  constructor (props) {
    super()
  }

  render () {
    return (
      <div className='DomainVoteRevealInProgressContainer'>
        <div className='Content'>
          <div><strong>Vote reveal in progress. </strong>
            <Loader indeterminate active inline />
          </div>
          <p>You will receive <strong>one</strong> MetaMask prompts:</p>
          <p><strong>First prompt:</strong> Submit vote reveal hash to the adChain Registry PLCR contract.</p>
        </div>
      </div>
    )
  }
}

export default DomainVoteRevealInProgressContainer
