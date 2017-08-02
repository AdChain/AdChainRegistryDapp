import React, { Component } from 'react'

import './DomainProfile.css'

class DomainProfile extends Component {
  constructor (props) {
    super()

    const {params} = props.match
    const {domain} = params

    this.state = {
      domain
    }
  }

  render () {
    const {domain} = this.state

    return (
      <div className='DomainProfile'>
      {domain}
      </div>
    )
  }
}

export default DomainProfile
