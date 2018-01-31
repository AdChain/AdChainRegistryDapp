import React, { Component } from 'react'

import './DomainProfileAdsTxtStatus.css'

class DomainProfileAdsTxtStatus extends Component {
  constructor (props) {
    super()

  //   const {
  //     domain
  //   } = props
  //
  //   this.state = {
  //     domain
  //   }
  }

  render () {
    // const {
    //   domain
    // } = this.state

    return (
      <div className='DomainProfileAdsTxtStatus BoxFrame'>
        <div className='ui grid stackable'>
          <div className='column sixteen wide'>
            <div className='Header'>
              Adstxt Plus Status
            </div>
          </div>
        </div>
      </div>
    )
  }
}

export default DomainProfileAdsTxtStatus
