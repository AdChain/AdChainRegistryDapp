import React, { Component } from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'

import DomainProfileHeader from './DomainProfileHeader'
import DomainStatsbar from './DomainStatsbar'
// import DomainScamReport from './DomainScamReport'
import DomainProfileInfo from './DomainProfileInfo'
import DomainProfileActionContainer from './DomainProfileActionContainer'
import DomainProfileAdsTxtStatus from './DomainProfileAdsTxtStatus'
import DomainProfileStageMap from './DomainProfileStageMap'

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
      action,
      stage: null
    }

    // scroll to top
    window.scrollTo(0, -1)

    this.updateStageMap = this.updateStageMap.bind(this)
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
      action,
      stage
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
              <DomainProfileStageMap stage={stage} domain={domain} />
            </div>
            <div className='column four wide'>
              <DomainProfileInfo
                domain={domain}
              />
              <DomainProfileAdsTxtStatus domain={domain} />
            </div>
            <div className='column seven wide'>
              <DomainProfileActionContainer
                domain={domain}
                action={action}
                updateStageMap={this.updateStageMap}
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

    const response = await window.fetch(`https://adchain-registry-api-staging.metax.io/domains/metadata?domain=${domain}`)

    try {
      const {
        title,
        description
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

  async updateStageMap (status) {
    if (this._isMounted) {
      this.setState({
        stage: status
      })
    }
  }
}

DomainProfile.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default DomainProfile
