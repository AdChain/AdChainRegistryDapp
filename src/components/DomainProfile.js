import React, { Component } from 'react'

import DomainProfileHeader from './DomainProfileHeader'
import DomainStatsbar from './DomainStatsbar'
import DomainProfileInfo from './DomainProfileInfo'
import DomainProfileActionContainer from './DomainProfileActionContainer'
import DomainProfileComments from './DomainProfileComments'

import './DomainProfile.css'

class DomainProfile extends Component {
  constructor (props) {
    super()

    const {params} = props.match
    const {domain} = params

    this.state = {
      domain,
      siteName: domain.toUpperCase().replace(/\..*/gi, ''),
      country: 'United States'
    }
  }

  render () {
    const {domain, siteName, country} = this.state

    return (
      <div className='DomainProfile'>
        <div className='ui grid stackable padded'>
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
          <div className='column ten wide'>
            <DomainProfileInfo />
          </div>
          <div className='column six wide'>
            <DomainProfileActionContainer />
          </div>
          <div className='column ten wide'>
            <DomainProfileComments domain={domain} />
          </div>
        </div>
      </div>
    )
  }
}

export default DomainProfile
