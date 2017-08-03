import React, { Component } from 'react'

import DomainNoActionContainer from './DomainNoActionContainer'
import DomainChallengeContainer from './DomainChallengeContainer'
import DomainVoteCommitContainer from './DomainVoteCommitContainer'
import DomainVoteRevealContainer from './DomainVoteRevealContainer'

import './DomainProfileActionContainer.css'

class DomainProfileActionContainer extends Component {
  constructor (props) {
    super()

    const {
      domain,
      action
    } = props

    this.state = {
      domain,
      action
    }
  }

  render () {
    const {action} = this.state

    let component = <DomainNoActionContainer />

    if (action === 'challenge') {
      component = <DomainChallengeContainer />
    } else if (action === 'commit') {
      component = <DomainVoteCommitContainer />
    } else if (action === 'reveal') {
      component = <DomainVoteRevealContainer />
    }

    return (
      <div className='DomainProfileActionContainer BoxFrame'>
        {component}
      </div>
    )
  }
}

export default DomainProfileActionContainer
