import React, { Component } from 'react'
import { Loader } from 'semantic-ui-react'

import './TopOffInProgressContainer.css'

class TopOffInProgressContainer extends Component {
  constructor (props) {
    super()
  }

  render () {
    return (
      <div className='TopOffInProgressContainer'>
        <div className='Content'>
          <div><strong>Top off in progress. </strong>
            <Loader indeterminate active inline />
          </div>
        </div>
      </div>
    )
  }
}

export default TopOffInProgressContainer
