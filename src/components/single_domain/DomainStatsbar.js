import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'
import './DomainStatsbar.css'
import { registryApiURL } from '../../models/urls'

class DomainStatsbar extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain,
      globalRank: '-',
      category: '-',
      bounceRate: '-',
      dailyPageViewsPerVisitor: '-',
      dailyTimeOnSite: '-',
      monthlyVisits: '-',
      avgVisitDuration: '-',
      pagesPerVisit: '-',
      totalSitesLinkingIn: '-'
    }
  }

  componentDidMount () {
    this._isMounted = true

    this.fetchStats()
  }

  componentWillUnmount () {
    this._isMounted = false
  }

  render () {
    const {
      domain,
      dailyPageViewsPerVisitor,
      dailyTimeOnSite,
      bounceRate,
      category,
      globalRank,
      totalSitesLinkingIn
    } = this.state

    return (
      <div className='DomainStatsbar'>
        <div className='ui grid stackable'>
          <div className='row'>
            <div className='column eight wide'>
              <h4>Daily Page Views per Visitor</h4>
              <strong>{commafy(dailyPageViewsPerVisitor)}</strong>
            </div>
            <div className='column eight wide'>
              <h4>Bounce Rate</h4> 
               <strong>{bounceRate}</strong>
            
            </div>
          </div>
          <div className='row'>
            <div className='column eight wide'>
              <h4>Daily Time on Site</h4> 
               <strong>{dailyTimeOnSite}</strong>
            </div>
            <div className='column eight wide Category'>
              <h4>Category</h4>
              <strong>{category}</strong>
            </div>
          </div>
          <div className='row'>
            <div className='column eight wide bb-none'>
              <h4>Total Sites Linking In</h4>
               <strong>{commafy(totalSitesLinkingIn)}</strong>
            </div>
            <div className='column eight wide bb-none'>
              <h4>Global Rank</h4>
               <strong>{commafy(globalRank)}</strong>
            </div>
          </div>
          <div className='Source'>
            <a
              href={`http://www.alexa.com/siteinfo/${domain}`}
              target='_blank'
              rel='noopener noreferrer'>
              <span>source: </span>
              Alexa
            </a>
          </div>
        </div>
      </div>
    )
  }

  async fetchStats () {
    const {domain} = this.state

    const options = {
      mode: 'cors',
      cache: 'no-cache'
    }

    const response = await window.fetch(`${registryApiURL}/stats/domain?domain=${domain}&filter=alexa`, options)
    const data = await response.json()

    if (this._isMounted) {
      if (data.stats) {
        const stats = data.stats.alexa
        this.setState({
          globalRank: stats.globalRank,
          dailyPageViewsPerVisitor: stats.dailyPageViewsPerVisitor,
          bounceRate: stats.bounceRate,
          dailyTimeOnSite: stats.dailyTimeOnSite,
          category: stats.categories[0],
          totalSitesLinkingIn: stats.totalSitesLinkingIn
        })
      }
    }
  }
}

DomainStatsbar.propTypes = {
  domain: PropTypes.string
}

export default DomainStatsbar
