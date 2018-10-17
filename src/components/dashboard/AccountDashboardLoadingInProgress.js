import React, { Component } from 'react'
import { Loader } from 'semantic-ui-react'

import './AccountDashboardLoadingInProgress.css'

class AccountDashboardLoadingInProgress extends Component {
  constructor (props) {
    super()
  }

  render () {
    return (
      <div className='AccountDashboardLoadingInProgress'>
        <div className='Content'>
          <div>
            <Loader indeterminate active inline='centered' />
          </div>
          <div>
          Loading your Dashboard
          </div>
        </div>
      </div>
    )
  }
}

export default AccountDashboardLoadingInProgress
