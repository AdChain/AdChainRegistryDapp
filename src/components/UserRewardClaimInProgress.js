import React, { Component } from 'react'
import { Loader } from 'semantic-ui-react'

import './UserRewardClaimInProgress.css'

class UserRewardClaimInProgress extends Component {
  constructor (props) {
    super()
  }

  render () {
    return (
      <div className='UserRewardClaimInProgress'>
        <div className='Content'>
          <div><strong>Reward claim in progress. </strong>
            <Loader indeterminate active inline />
          </div>
        </div>
      </div>
    )
  }
}

export default UserRewardClaimInProgress
