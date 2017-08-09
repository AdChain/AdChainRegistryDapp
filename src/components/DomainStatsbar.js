import React, { Component } from 'react'
import commafy from 'commafy'

import './DomainStatsbar.css'

class DomainStatsbar extends Component {
  constructor (props) {
    super()

    this.state = {
      domain: props.domain,
      globalRank: 0,
      category: '<unknown>',
      bounceRate: 0,
      dailyPageViewsPerVisitor: 0,
      dailyTimeOnSite: 0,
      monthlyVisits: 0,
      avgVisitDuration: 0,
      pagesPerVisit: 0
    }

    this.fetchStats()
  }

  render () {
    const {
      domain,
      //monthlyVisits,
      //pagesPerVisit,
      //avgVisitDuration,
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
            <div className='column eight wide'>
              Category: <strong>{category}</strong>
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
            <span>Source: </span>
          <a
            href={`http://www.alexa.com/siteinfo/${domain}`}
            target='_blank'
            rel='noopener noreferrer'>Alexa</a>
          </div>
        </div>
      </div>
    )
  }

  async fetchStats () {
    const {domain} = this.state

    const response = await fetch(`https://adchain-registry-api.metax.io/domain/stats?domain=${domain}`)
    const data = await response.json()

    this.setState({
      globalRank: data.globalRank,
      dailyPageViewsPerVisitor: data.dailyPageViewsPerVisitor,
      bounceRate: data.bounceRate,
      dailyTimeOnSite: data.dailyTimeOnSite,
      category: data.categories[0],
      totalSitesLinkingIn: data.totalSitesLinkingIn
    })
  }
}

export default DomainStatsbar
