import React, { Component } from 'react'
import commafy from 'commafy'

import './DomainVoteCommitContainer.css'

class DomainVoteCommitContainer extends Component {
  constructor (props) {
    super()

    this.state = {

    }
  }

  render () {
    const blocksRemaining = 1239

    return (
      <div className='DomainChallengeContainer'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <div className='ui large header center aligned'>
              VOTING – COMMIT
            </div>
          </div>
          <div className='column sixteen wide'>
            <p>
The first phase of the voting process is the commit phase where the ADT holder stakes a hidden amount of ADT to SUPPORT or OPPOSE the domain application. The second phase is the reveal phase where the ADT holder reveals the staked amount of ADT to either the SUPPORT or OPPOSE side.
            </p>
          </div>
          <div className='column sixteen wide center aligned'>
            <div className='ui divider' />
            <p>
          Total ADT already committed by the general ADT community:
            </p>
            <p>
              <strong>99,000 ADT</strong>
            </p>
            <div className='ui divider' />
            <p>
          Blocks remaining until commit period ends
            </p>
            <p><strong>{commafy(blocksRemaining)} blocks</strong></p>
            <p><small>or approximately: 02 days, 14 hours, and 49 minutes</small></p>
            <div className='ui divider' />
          </div>
          <div className='column sixteen wide center aligned'>
            <button className='ui button blue'>
              SUPPORT
            </button>
            <button className='ui button purple'>
              OPPOSE
            </button>
          </div>
        </div>
      </div>
    )
  }
}

export default DomainVoteCommitContainer
