import React, { Component } from 'react'
import PropTypes from 'prop-types'
import commafy from 'commafy'

import './DomainStatsbar.css'

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
      <div className='DomainStatsbar BoxFrame'>
        <div className='ui grid stackable'>
          <div className='row'>
            <div className='column eight wide'>
              <span className='Header'>Site Analytics</span>
            </div>
          </div>
          <div className='row'>
            <div className='column eight wide'>
              Daily Page Views per Visitor: <strong>{commafy(dailyPageViewsPerVisitor)}</strong>
            </div>
            <div className='column eight wide'>
              Bounce Rate: <strong>{bounceRate}</strong>
            </div>
          </div>
          <div className='row'>
            <div className='column eight wide'>
              Daily Time on Site: <strong>{dailyTimeOnSite}</strong>
            </div>
            <div className='column eight wide Category'>
              <span>Category:&nbsp;</span><strong className='overflow-x'>{category}</strong>
            </div>
          </div>
          <div className='row'>
            <div className='column eight wide'>
              Total Sites Linking In: <strong>{commafy(totalSitesLinkingIn)}</strong>
            </div>
            <div className='column eight wide'>
              Global Rank: <strong>{commafy(globalRank)}</strong>
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

    const response = await window.fetch(`https://adchain-registry-api-staging.metax.io/stats/domain?domain=${domain}&filter=alexa`, options)
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
