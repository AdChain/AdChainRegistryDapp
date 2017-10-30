import React, { Component } from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'

import DomainProfileHeader from './DomainProfileHeader'
import DomainStatsbar from './DomainStatsbar'
import DomainScamReport from './DomainScamReport'
import DomainProfileInfo from './DomainProfileInfo'
import DomainProfileActionContainer from './DomainProfileActionContainer'

import './DomainProfile.css'

class DomainProfile extends Component {
  constructor (props) {
    super()

    const {params} = props.match
    const {domain} = params

    const query = qs.parse(props.location.search.substr(1))
    const action = query.action

    this.state = {
      domain,
      siteName: '',
      siteDescription: '',
      country: null,
      action
    }

    // scroll to top
    window.scrollTo(0, -1)
  }

  componentDidMount () {
    this._isMounted = true

    this.fetchSiteMetadata()
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {
      domain,
      siteName,
      siteDescription,
      country,
      action
    } = this.state

    return (
      <div className='DomainProfile'>
        <div className='ui grid stackable padded'>
          <div className='row'>
            <div className='column seven wide'>
              <DomainProfileHeader
                domain={domain}
                name={siteName}
                description={siteDescription}
                country={country}
              />
            </div>
            <div className='column nine wide'>
              <DomainStatsbar domain={domain} />
            </div>
          </div>
          <div className='row'>
            <div className='column five wide'>
              <DomainScamReport domain={domain} />
            </div>
            <div className='column five wide'>
              <DomainProfileInfo
                domain={domain}
              />
            </div>
            <div className='column six wide'>
              <DomainProfileActionContainer
                domain={domain}
                action={action}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  async fetchSiteMetadata () {
    const {domain} = this.state

    if (!domain) {
      return false
    }

    const response = await window.fetch(`https://adchain-registry-api.metax.io/domains/metadata?domain=${domain}`)

    try {
      const {
        title,
        description,
      } = await response.json()

      if (this._isMounted) {
        this.setState({
          siteName: title,
          siteDescription: description
        })
      }
    } catch (error) {

    }
  }
}

DomainProfile.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default DomainProfile
