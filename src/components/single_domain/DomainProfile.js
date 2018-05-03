import React, { Component } from 'react'
import PropTypes from 'prop-types'
import qs from 'qs'

import DomainProfileHeader from './DomainProfileHeader'
import DomainStatsbar from './DomainStatsbar'
// import DomainScamReport from './DomainScamReport'
import DomainRedditBox from '../reddit/DomainRedditBox'
import DomainProfileActionContainer from './DomainProfileActionContainer'
// import DomainProfileAdsTxtStatus from './DomainProfileAdsTxtStatus'
import DomainProfileStageMap from './DomainProfileStageMap'
import { registryApiURL } from '../../models/urls'

import './DomainProfile.css'
import getDomainState from '../../utils/getDomainState';

class DomainProfile extends Component {
  constructor(props) {
    super()

    const { params } = props.match
    const { domain } = params

    const query = qs.parse(props.location.search.substr(1))
    const action = query.action

    this.state = {
      domain,
      siteName: '',
      siteDescription: '',
      country: null,
      action,
      stage: null,
      domainData: null
    }

    // scroll to top
    window.scrollTo(0, -1)
  }

  componentDidMount() {
    this._isMounted = true
    this.fetchSiteData()
  }


  componentWillUnmount() {
    this._isMounted = false
  }

  render() {
    const {
      stage,
      domain,
      action,
      country,
      siteName,
      domainData,
      siteDescription,
    } = this.state

    const redirectState = this.props.location.state

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
                domainData={domainData}
              />
            </div>
            <div className='column nine wide'>
              <DomainStatsbar
                domain={domain}
                domainData={domainData}
              />
            </div>
          </div>
          <div className='row'>
            <div className='column four wide'>
              <DomainProfileStageMap
                stage={stage}
                domain={domain}
                domainData={domainData}
              />
            </div>
            <div className='column five wide'>
              <DomainRedditBox
                domain={domain}
                domainData={domainData}
              />
              {
                // <DomainProfileAdsTxtStatus domain={domain} />
              }
            </div>
            <div className='column seven wide'>
              <DomainProfileActionContainer
                domain={domain}
                action={action}
                redirectState={redirectState}
                domainData={domainData}
              />
            </div>
          </div>
        </div>
      </div>
    )
  }

  async fetchSiteData() {
    let metadata
    let listing
    const { domain } = this.state

    if (!domain) return null

    try {
      listing = await (await window.fetch(`${registryApiURL}/registry/domain?domain=${domain}`)).json()
      
      try {
        metadata = await (await window.fetch(`${registryApiURL}/domains/metadata?domain=${domain}`)).json()
      } catch (error) {
        console.log(error)
      }

      let listingHash = listing.listingHashNew || listing.listingHashOld

      const domainData = await getDomainState({ domain, domainHash: listingHash })

      // If rejected --> Check to see if listing is withdrawn
      if(domainData.stage === 'rejected'){
        const getWithdrawn = async () => {
          const withdrawn = await (await window.fetch(`${registryApiURL}/registry/domains?filter=withdrawn`)).json()
          return withdrawn
        }
        let withdrawn = await getWithdrawn()
        for (let w of withdrawn) {
          if (w.domainHash === domainData.listingHash) {
            domainData.stage = 'withdrawn'
            break;
          }
        }
      }
      
      if (this._isMounted) {
        this.setState({
          domainData,
          siteName: domainData.siteName,
          siteDescription: metadata ? metadata.description : ''
        })
      }
    } catch (error) {
      console.log(error)
    }
  }
}

DomainProfile.propTypes = {
  location: PropTypes.object,
  match: PropTypes.object
}

export default DomainProfile
