import React, { Component } from 'react'
import { Loader } from 'semantic-ui-react'

import './RequestTokenApprovalInProgressContainer.css'

class RequestTokenApprovalInProgressContainer extends Component {
  constructor (props) {
    super()
  }

  render () {
    return (
      <div className='RequestTokenApprovalInProgressContainer overflow-y'>
        <div className='Content'>
          <div><strong>Request in progress. </strong>
            <Loader indeterminate active inline />
          </div>
          <p>You will receive <strong>two</strong> MetaMask prompts:</p>
          <p><strong>First prompt:</strong> Allow adChain Registry contract to transfer adToken deposit from your account.</p>
          {
            // need to add second prompt
          }
        </div>
      </div>
    )
  }
}

export default RequestTokenApprovalInProgressContainer
