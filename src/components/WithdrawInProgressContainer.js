import React, { Component } from 'react'
import { Loader } from 'semantic-ui-react'

import './WithdrawInProgressContainer.css'

class WithdrawInProgressContainer extends Component {
  constructor (props) {
    super()
  }

  render () {
    return (
      <div className='WithdrawInProgressContainer'>
        <div className='Content'>
          <div><strong>Withdraw in progress. </strong>
            <Loader indeterminate active inline />
          </div>
        </div>
      </div>
    )
  }
}

export default WithdrawInProgressContainer
