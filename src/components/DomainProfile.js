import React, { Component } from 'react'

import DomainProfileHeader from './DomainProfileHeader'
import DomainStatsbar from './DomainStatsbar'

import './DomainProfile.css'

class DomainProfile extends Component {
  constructor (props) {
    super()

    const {params} = props.match
    const {domain} = params

    this.state = {
      domain,
      siteName: 'Foo NET',
      country: 'United States'
    }
  }

  render () {
    const {domain, siteName, country} = this.state

    return (
      <div className='DomainProfile'>
        <div className='ui grid stackabled padded'>
          <div className='column eight wide'>
            <DomainProfileHeader
              domain={domain}
              name={siteName}
              country={country}
            />
          </div>
          <div className='column eight wide'>
            <DomainStatsbar />
          </div>
        </div>
      </div>
    )
  }
}

export default DomainProfile
