import React, { Component } from 'react'

import CoreParameters from './CoreParameters'

class GovernanceContainer extends Component {
  constructor (props) {
    super()
  }

  render () {
    return (
      <div className='ui container grid'>
        <div className='column five wide'>
          <CoreParameters />
        </div>
      </div>
    )
  }
}

export default GovernanceContainer
