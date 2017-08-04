import React, { Component } from 'react'
import commafy from 'commafy'

import './DomainChallengeContainer.css'

class DomainChallengeContainer extends Component {
  constructor (props) {
    super()

    this.state = {

    }
  }

  render () {
    const blocksRemaining = 9180

    return (
      <div className='DomainChallengeContainer'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <div className='ui large header center aligned'>
              IN APPLICATION
            </div>
          </div>
          <div className='column sixteen wide'>
            <p>ADT holders are encouraged to challenge publisher applications where the token holders believe the Publisher to be fraudulent.</p>
          </div>
          <div className='column sixteen wide center aligned'>
            <div className='ui divider' />
            <p>Blocks remaining until challenge period ends</p>
            <p><strong>{commafy(blocksRemaining)} blocks</strong></p>
            <p><small>or approximately: 02 days, 14 hours, and 49 minutes</small></p>
            <div className='ui divider' />
          </div>
          <div className='column sixteen wide center aligned'>
            <p>100,000,000 ADT needed to Challenge</p>
          </div>
          <div className='column sixteen wide center aligned'>
            <button className='ui button purple'>
              CHALLENGE
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default DomainChallengeContainer
