import React, { Component } from 'react'

import GovernanceAndCoreParameters from './GovernanceAndCoreParameters'
import CreateProposal from './CreateProposal'
import OpenProposalsTable from './OpenProposalsTable'

class GovernanceContainer extends Component {
  constructor (props) {
    super()
  }

  render () {
    return (
      <div className='ui grid padded'>
        <div className='column five wide'>
          <GovernanceAndCoreParameters />
        </div>
        <div className='column three wide'>
          <CreateProposal />
        </div>
        <div className='column eight wide'>
          <OpenProposalsTable />
        </div>
      </div>
    )
  }
}

export default GovernanceContainer
