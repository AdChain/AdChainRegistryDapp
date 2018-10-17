import React, { Component } from 'react'
import { Loader } from 'semantic-ui-react'

import './PublisherApplicationFormInProgress.css'

class PublisherApplicationFormInProgress extends Component {
  constructor (props) {
    super()
  }

  render () {
    return (
      <div className='PublisherApplicationFormInProgress'>
        <div className='Content'>
          <div>
            <strong>Submission in progress. </strong>
            <Loader indeterminate active inverted inline />
          </div>
          <p>You will receive a maximum of <strong>two</strong> MetaMask prompts:</p>
          <p><strong>First prompt:</strong> Allow adChain Registry contract to transfer adToken deposit from your account (if not done so already).</p>
          <p><strong>Second prompt:</strong> Submit domain application to the adChain Registry contract.</p>
        </div>
      </div>
    )
  }
}

export default PublisherApplicationFormInProgress
